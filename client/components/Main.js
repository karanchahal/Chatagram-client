
import React, { Component } from 'react';
import { Link } from 'react-router'
import MapBubble from './MapBubble'
import _ from 'lodash'
const io = require('socket.io-client')

const socket = io('http://localhost:3110/');


function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

var final_transcript = ''
var interim_transcript = ''
var recognising = false;
var recognition = ''
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = function() {
	recognising = true
  };
  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      console.log('No speech')
    }
    if (event.error == 'audio-capture') {
        console.log('No audio capture')
    }
    if (event.error == 'not-allowed') {
        console.log('Not allowed')
    }
  };
  recognition.onend = function() {

    if (!final_transcript) {
      return;
    }


  };
  recognition.onresult = function(event) {
    var interim_transcript = '';
    var final_transcript = ''
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    document.getElementById('textbox').value = interim_transcript
if(final_transcript != '') {
document.getElementById('textbox').value = final_transcript
}
  };
function startRecording() {

	if(recognising) {
document.getElementById('button-record').innerHTML = 'Record'
		recognising = false;
		recognition.stop()
		return;
	}
document.getElementById('button-record').innerHTML = 'Stop'
	  recognition.lang = 'en-IN'
	  recognition.start();
}

}


class ChatBubble extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <h4> {this.props.message}</h4>
    )
  }
}


class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      'message':'Heyo',
      'chat':[
        {"message":"Hello"},
        {"message":"What's up"}
      ],

    }

    this.sendMessage = this.sendMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSpeech = this.handleSpeech.bind(this)

    socket.on('message', (payload) => this.updateChat(payload));
    socket.on('map', (payload) => this.updateChat(payload));

  }

  componentDidMount() {
    window.addEventListener('text2speech',this.handleSpeech, false);
  }

  handleSpeech(e) {
    this.setState({message: e.detail})
  }

  updateChat(msg){
    var chat = this.state.chat
    chat.push(msg)
    this.setState({'chat': chat,'message':''})

    var objDiv = document.getElementById("chatBox");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  sendMessage() {
    this.updateChat({"message":this.state.message})
    socket.emit('message',{message:this.state.message})
  }

  handleChange(event) {
    this.setState({'message':event.target.value})
  }

  render() {
    var message = this.state.message
    return (
      <div>
        <h1>
          <Link to="/">Chatagram</Link>
        </h1>
        <center>
          <div id="chatBox" style={{height:200+'px', 'overflow-y': 'scroll'}}>
            {this.renderChats()}
          </div>
          <input type="text" value={message} onChange={this.handleChange} ></input>
          <button onClick={this.sendMessage} >Send</button>
        </center>

        {this.props.children}

      </div>
    )
  }
  formatMapMarkers(markers) {
    let finalmarkers = []

    _.map(markers,(marker,index) => {

      let atm = {
        position:  new google.maps.LatLng(marker.geometry.location.lat, marker.geometry.location.lng),
        showInfo: false,
        infoContent: (<div>
           <h3>{marker.name}</h3>
           <h4>{marker.vicinity}</h4>
           </div>
        ),
      }
      finalmarkers.push(atm)
    })

    return finalmarkers
  }
  renderChats() {

    return _.map(this.state.chat,(chat,index) => {

      if(chat.map == undefined) {
        return <ChatBubble message={chat.message} key={index} />
      } else {
        let markers = this.formatMapMarkers(chat.markers)
        return <MapBubble markers={markers} key={index} />
      }

    })
  }

};

export default Main;
