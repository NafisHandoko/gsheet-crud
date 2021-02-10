// Get the modal
var addmodal = document.getElementById("add-modal");
var signinmodal = document.getElementById("signin-modal");
var updatemodal = document.getElementById("update-modal");

// Get the button that opens the modal
var addbtn = document.getElementById("add-btn");

// When the user clicks on the button, open the modal
addbtn.onclick = function() {
  addmodal.style.display = "block";
}

function updatemodalOpen(parentId){
  document.getElementById("usernameUpdate").value = document.getElementById("name"+parentId).innerHTML;
  document.getElementById("emailUpdate").value = document.getElementById("email"+parentId).innerHTML;
  document.getElementById("updateId").value = parentId;
  updatemodal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
function closeModal(){
  addmodal.style.display = "none";
  updatemodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == addmodal) {
    addmodal.style.display = "none";
    updatemodal.style.display = "none";
  }
}

//This will beat code injection
function escapeHTML(text){
  var map = {
    '&' : '&amp',
    '<' : '&lt',
    '>' : '&gt',
    '"' : '&quot',
    "'" : '&#039',
  };
  return text.replace(/[&<>"']/g, function(m){ return map[m];});
}

// Client ID and API key from the Developer Console
var CLIENT_ID = '214629748070-e37kspal1ph79o5cpa3h1qubuhq314pu.apps.googleusercontent.com';
var API_KEY = 'AIzaSyD2OocID-g-mcsw7yv76453QOnuKxYmaLA';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

/**
* Spreadsheet ID from sample spreadsheet
* https://docs.google.com/spreadsheets/d/11uz63H5fCJWBOxHIkAJ3CyAPd4rOCRj28CII4f_eK90/edit
*/
var SHEET_ID = '11uz63H5fCJWBOxHIkAJ3CyAPd4rOCRj28CII4f_eK90';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    document.getElementById("tdMsg").innerHTML = JSON.stringify(error, null, 2)
  });
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    signinmodal.style.display = 'none';
    signoutButton.style.display = 'block';
    readSheet();
  } else {
    signinmodal.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}


/**
* CRUD functions with Google API Client Library for JavaScript
* https://github.com/google/google-api-javascript-client
* https://apis.google.com/js/api.js
*/

//Read/Retreive the data
function readSheet() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A2:B',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      var sheetHeader = "";
      var sheetData = "";
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        if(row.length > 0){
          // Print columns A and E, which correspond to indices 0 and 4.
          sheetHeader = sheetHeader + '<tr class="bg-teal-400 flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">'+
                          '<th class="p-3 text-left">Name</th>'+
                          '<th class="p-3 text-left">Email</th>'+
                          '<th class="p-3 text-left" width="110px">Actions</th>'+
                        '</tr>';

          sheetData = sheetData + '<tr class="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0">'+
                        '<td class="border-grey-light border hover:bg-gray-100 p-3" id="name'+(i+2)+'">'+escapeHTML(row[0])+'</td>'+
                        '<td class="border-grey-light border hover:bg-gray-100 p-3 truncate" id="email'+(i+2)+'">'+escapeHTML(row[1])+'</td>'+
                        '<td class="md:text-2xl border-grey-light border hover:bg-gray-100 p-3 hover:font-medium cursor-pointer" id="'+(i+2)+
                          '"><ion-icon name="trash" class="px-1 text-red-400 hover:text-red-600" id="trash'+(i+2)+'"></ion-icon>'+
                          '<ion-icon name="pencil" class="px-1 text-green-400 hover:text-green-600" id="pencil'+(i+2)+'"></ion-icon>'+
                        '</td>'+
                      '</tr>';

        }
      }
      document.getElementById('tableHead').innerHTML = sheetHeader;
      document.getElementById('tableBody').innerHTML = sheetData;
      for(i = 0; i < range.values.length; i++){
        var row = range.values[i];
        if(row.length > 0){
          var trash = document.getElementById("trash"+(i+2));
          var pencil = document.getElementById("pencil"+(i+2));
          trash.setAttribute("onclick","deleteSheet(this.parentNode.id)");
          pencil.setAttribute("onclick","updatemodalOpen(this.parentNode.id);");
        }
      }
    } else {
      document.getElementById("tdMsg").innerHTML = "No data found";
    }
  }, function(response) {
    document.getElementById("tdMsg").innerHTML = 'Error: ' + response.result.error.message;
  });
}

//Add the data
function addSheet(){
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var values = [
    [username,email],
    // Additional rows ...
  ];
  var body = {
    values: values
  };
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Sheet1",
    valueInputOption: 'USER_ENTERED',
    resource: body
  }).then((response) => {
    var result = response.result;
    console.log(`${result.updates.updatedCells} cells appended.`)
    addmodal.style.display = "none";
    readSheet();
  });
}

//Delete the data
function deleteSheet(rowToDelete){
  var values = [
    ["",""],
    // Additional rows if any...
  ];
  var body = {
    values: values
  };
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A'+rowToDelete+':B'+rowToDelete,
    valueInputOption: 'USER_ENTERED',
    resource: body
  }).then((response) => {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
    readSheet();
  });
}

//Update/edit the data
function updateSheet(){
  var username = document.getElementById("usernameUpdate").value;
  var email = document.getElementById("emailUpdate").value;
  var updateId = document.getElementById("updateId").value;
  var values = [
    [username,email],
    // Additional rows if any...
  ];
  var body = {
    values: values
  };
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A'+updateId+':B'+updateId,
    valueInputOption: 'USER_ENTERED',
    resource: body
  }).then((response) => {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
    updatemodal.style.display = "none";
    readSheet();
  });
}