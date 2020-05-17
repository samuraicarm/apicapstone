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
        authorizeButton.style.display = 'show';
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