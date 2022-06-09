import { OpenVidu } from 'openvidu-browser';
import React, { useState } from 'react';
const util = require('util');


function App() {
  const [participantName, setParticipantName] = useState("participant1");
  const [sessionName, setSessionName] = useState("sessionA");
  const [userNameState, setUserNameState] = useState("publisher1");
  const [passwordState, setPassword] = useState("pass");
  const [showLogin, setShowLogin] = useState(true);
  const [showJoinSession, setShowJoinSession] = useState(false);
  const asyncGetToken = util.promisify(getToken);
  var token;
  var OV;
  var session;

  const handleParticipantChange = (event) => {
    setParticipantName(event.target.value);

  }

  const handleSessionNameChange = (event) => {
    setSessionName(event.target.value);
  }

  const handleUserNameChange = (event) => {
    setUserNameState(event.target.value);
  }

  const handlePassChange = (event) => {
    setPassword(event.target.value);
  }

  async function joinSession() {
    document.getElementById("join-btn").disabled = true;
    document.getElementById("join-btn").innerHTML = "Joining...";

    var response = await asyncGetToken();
    token = response[0];

    console.log("joinSssion retreived token:", token);

    OV = new OpenVidu();

    session = OV.initSession();

    session.on('streamCreated', (event) => {

      console.log("Stream created");

      var subscriber = session.subscribe(event.stream, 'video-container');
      

      subscriber.on('videElementCreated', (event) => {
        console.log("video element created");

        appendUserData(event.element, subscriber.stream.connection);

      });

    });

    

    
  }
	

  async function getToken(callback) {
    
    console.log("attemping to get token");
    var token;
    await httpPostRequest(
      'https://localhost:5000/api-sessions/get-token',
      {sessionName: sessionName},
      'Request of TOKEN gone WRONG:',
      (response) => {
        token = response;
        callback(null, token);
      }
    )

  }

  function httpPostRequest(url, body, errorMsg, callback) {
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.addEventListener('readystatechange', processRequest, false);
    http.send(JSON.stringify(body));
  
    function processRequest() {
      if (http.readyState == 4) {
        if (http.status == 200) {
          try {
            var response = JSON.parse(http.responseText);
            console.log("Successfully retreived token", response )
            callback(response);
          } catch (e) {
            callback();
          }
        } else {
          console.warn(errorMsg);
          console.warn(http.responseText);
        }
      }
    }
  }

  async function logIn() {
    console.log("attempting to log in");
    var user = userNameState; // Username
    var pass = passwordState; // Password


    httpPostRequest(
      'https://localhost:5000/api-login/login',
      {user: user, pass: pass},
      'Login WRONG',
      (response) => {
        // document.getElementById("#not-logged").style.display="none";
        // document.getElementById("#logged").style.display="show";
        // Random nickName and session
        // $("#sessionName").val("Session " + Math.floor(Math.random() * 10));
        // $("#nickName").val("Participant " + Math.floor(Math.random() * 100));
      }
    );

    console.log("successful log in");

    setShowLogin(false);
    setShowJoinSession(true);

  }

  function appendUserData(videoElement, connection) {
    var clientData;
	  var serverData;
	  var nodeId;
    if (connection.nickName) {
    clientData = connection.nickName;
    serverData = connection.userName;
    nodeId = 'main-videodata';
    } else {
      clientData = JSON.parse(connection.data.split('%/%')[0]).clientData;
		  serverData = JSON.parse(connection.data.split('%/%')[1]).serverData;
      nodeId = connection.connectionId;
    }

    var dataNode = document.createElement('div');
    dataNode.className = "data-node";
    dataNode.id = "data-" + nodeId;
	  dataNode.innerHTML = "<p class='nickName'>" + clientData + "</p><p class='userName'>" + serverData + "</p>";
    videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);

    // addClickListener(videoElement, clientData, serverData);

  }
 



  return (
    <>
      
      {showLogin ? 
        
        <div id="not-logged" >
          <h1>Log In</h1>
          <form>
            <label>
              User:
              <input type="text" id="user" value={userNameState} onChange={handleUserNameChange} required />
            </label>
            <br/>
            <label>
              Pass:
              <input type="text" id="pass" value={passwordState} onChange={handlePassChange} required />
            </label> 
            <br />
          </form>
          <button onClick={() => logIn()}>Log in</button>

          <table >
            <thead>
              <tr>
                <th>User</th>
                <th>Pass</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>publisher1</td>
                <td>pass</td>
                <td>PUBLISHER</td>
              </tr>
              <tr>
                <td>publisher2</td>
                <td>pass</td>
                <td>PUBLISHER</td>
              </tr>
              <tr>
                <td>subscriber</td>
                <td>pass</td>
                <td>SUBSCRIBER</td>
              </tr>
            </tbody>
            
          </table>
        </div>
      
      : null}


      {showJoinSession ? 
        <div id="join">
          <div>
            <h1>Join a video session</h1>
            <form >
              <label>
                Participant:
                <input type="text" name="nickName" value={participantName} onChange={handleParticipantChange.bind(this)} required/>
              </label>
              <br/>
              <label>
                Session:
                <input type="text" name="sessionName" value={sessionName} onChange={handleSessionNameChange.bind(this)} />
              </label>
              <br/>
              <button id="join-btn" onClick={() => joinSession()}>Join!</button>
            </form>
          </div>
          <br />
          <div>Logged as <span id="name-user">{userNameState}</span></div>
          {/* <button id="logout-btn" onClick={() => logOut()}>Log out</button> */}
          
        </div>

      : null }

      <div id="session" style={{display: "none"}}>
				<div id="session-header">
					<h1 id="session-title"></h1>
					<input className="btn btn-large btn-danger" type="button" id="buttonLeaveSession" value="Leave session" />
				</div>
				<div id="main-video" className="col-md-6">
					<p className="nickName"></p>
					<p className="userName"></p>
					<video autoPlay playsInline={true}></video>
				</div>
				<div id="video-container" className="col-md-6"></div>
			</div>

    </>
  );
}

export default App;
