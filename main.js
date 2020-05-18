//Options

const CLIENT_ID='320890024553-c4sv5l4bdt5ng2odt3b2og44hqkc6cf1.apps.googleusercontent.com';
const DISCOVERY_DOCS= ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES='https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorizeButton');
const signoutButton = document.getElementById('signoutButton');
const content = document.getElementById('content');
const channelForm = document.getElementById('channelForm');
const channelInput = document.getElementById('channelInput');
const videoContainer = document.getElementById('videoContainer');

const defaultChannel = 'TED';

//form submit and change channel
channelForm.addEventListener('submit', e => {
    e.preventDefault();

    const channel = channelInput.value;

    getChannel(channel);
});

//load auth2 library 
function handleClientLoad(){
    gapi.load('client:auth2', initClient);
}

//init API client library and set sign in listeners
function initClient(){
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() =>{
        //listen for sign in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        //handle initial sign in state
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

//update UI sign in state changes

function updateSigninStatus(isSignedIn) {
    if(isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        authorizeButton.style.display = 'block';
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        authorizeButton.style.display = 'none';
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

//get channel from API
function getChannel(channel) {
    console.log(channel);
}

//diplay channel data 
function  showChannelData(data) {
    const channelData = document.getElementById('channelData');
    channelData.innerhtml = data;
}

//get channel data 
function getChannel(channel){
    gapi.client.youtube.channels
    .list({
        part: 'snippet,contentDetails,statistics',
        forUsername:channel
    })
        .then(response =>{
            console.log(response);
            const channel = response.results.items[0];

            const output = `
            <ul class="collection">
            <li class="collectionItem"> Title: ${channel.snippet.title}</li>
            <li class="collectionItem">ID: ${channel.id}</li>
            <li class="collectionItem">Subscribers: ${numberWithCommas(channel.statistics.subscriberCount)}</li>
            <li class="collectionItem">Views: ${numberWithCommas(channel.statistics.viewCount)}</li>
            <li class="collectionItem">Views: ${numberWithCommas(channel.statistics.videoCount)}</li>
            </ul>
            <p>${channel.snippet.description}</p>
            <hr>
            <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customURL}">Visit Channel</a>
            </hr>`;
            showChannelData(output);

            const playlistId = channel.contentDetails.relatedPlaylists.uploads;
            requestVideoPlaylist(playlistId);

        })
        .catch(err=> alert ('No channel by that name.'));
    }

   //add commas to number 
   function numberWithCommas (x) {
       return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
   }

   function requestVideoPlaylist(playlistId) {
       const requestOptions = {
           playlistId: playlistId,
           part: 'snippet',
           maxResults: 10
       }

       const request = gapi.client.youtube.playlistItems.list (requestOptions);

       request.execute(response => {
        console.log(response);

        const playListItems = response.result.items;
        if(playListItems) {

            let output = <h4 class="align-center">Latest Videos</h4>;

            //loop through videos and append output
            playlistItem.forEach(item => {
                const videoID = item.snippet.resourceID.videoID;

                output +=`
                
                <div class = "col s3>
                <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
            });
              //Output Videos
              videoContainer.innerHTML = output;
        } else {
            videoContainer.innerHTML = "No Uploaded Videos"
        }


       });
   }


