'use strict';
  
//Options

const CLIENT_ID='320890024553-c4sv5l4bdt5ng2odt3b2og44hqkc6cf1.apps.googleusercontent.com';
const SCOPES='https://www.googleapis.com/auth/youtube.readonly';
const URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const channelUrl = 'https://www.googleapis.com/youtube/v3/channels'
const apiKey = '';

const authorizeButton = document.getElementById('authorizeButton');
const signoutButton = document.getElementById('signoutButton');
const content = document.getElementById('content');
const channelForm = document.getElementById('channelForm');
const channelInput = document.getElementById('channelInput');
const videoContainer = document.getElementById('videoContainer');

const defaultChannel = 'techguyweb';


$(document).ready(function(){
    console.log("ready");
  });
  
$(function() {
    console.log('App loaded! Waiting for submit!');
  });



  function watchForm() {
    console.log("watch form");
    channelForm.addEventListener('submit', e => {
    console.log("I get called after the form is submitted.");
    e.preventDefault();
    const channel = channelInput.value;
    getChannel(channel);
    console.log(channel);
    });
  }
 

//load auth2 library 
function handleClientLoad(){
    gapi.load('client:auth2', initClient);
}

//init API client library and set sign in listeners
function initClient(){
    gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {
        //listen for sign in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        //handle initial sign in state
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
    loadApi(apiKey);
}

function loadApi() {
    gapi.client.setApiKey(apiKey);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }

//update UI sign in state changes

function updateSignInStatus(isSignedIn) {
    if(isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'block';
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}

// handle login 
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

//handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}    


//display channel data 
function  showChannelData(data) {
    const channelData = document.getElementById('channelData');
    channelData.innerhtml = data;
}

//get channel from API
function getChannel(channel){
    console.log(channel)
    gapi.client.youtube.channels.list({
        part: 'snippet,contentDetails,statistics',
        forUsername: channel
       
    })
        .then(response => {
            console.log(response);
            const channel = response.result.items[0];

            const output = `
            <ul class="collection">
            <li class="collection-item"> Title: ${channel.snippet.title}</li>
            <li class="collection-item">ID: ${channel.id}</li>
            <li class="collection-item">Subscribers: ${numberWithCommas(channel.statistics.subscriberCount)}</li>
            <li class="collection-item">Views: ${numberWithCommas(channel.statistics.viewCount)}</li>
            <li class="collection-item">Videos: ${numberWithCommas(channel.statistics.videoCount)}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
           `;
            showChannelData(output);

            const playlistId = channel.contentDetails.relatedPlaylists.uploads;
            requestVideoPlaylist(playlistId);

        })
        .catch(err => alert('No channel by that name.'));
    }

   //add commas to number 
   function numberWithCommas (x) {
       return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
   }

   //request videos
   function requestVideoPlaylist(playlistId) {
       const requestOptions = {
           "playlistId": playlistId,
           "part": 'snippet',
           "maxResults": 10,
       }

       const request = gapi.client.youtube.playlistItems.list(requestOptions);

       request.execute(response => {
        console.log(response);

        const playListItems = response.result.items;
        if(playListItems) {

            let output = '<br><h4 class="center-align">Latest Videos</h4>';

            //loop through videos and append output
            playListItems.forEach(item => {
                const videoId = item.snippet.resourceID.videoId;

                output +=`
                <div class = "col s3>
                <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
            });
              //Output Videos
              videoContainer.innerHTML = output;
        } else {
            videoContainer.innerHTML = "No Uploaded Videos"
        }

       });
   }

   $(watchForm);


