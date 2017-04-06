
import React, { Component } from 'react';
import { Link } from 'react-router'
import MapBubble from './MapBubble'
import ChatBubble from './ChatBubble'
import Webcam from 'react-webcam'
import _ from 'lodash'
const io = require('socket.io-client')

const socket = io('http://localhost:3110/');
const facesocket = io('http://localhost:3111/');


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



class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      'message':'Heyo',
      'chat':[
      ],

      'time_last': '',
      'dataset':[],
      'screenshot': null,
      'verify': false,
      'num_of_times': 0

    }

    this.sendMessage = this.sendMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSpeech = this.handleSpeech.bind(this)

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.screenshot = this.screenshot.bind(this)

    this.verifyFace = this.verifyFace.bind(this)
    this.verified = this.verified.bind(this)
    this.checkVerification = this.checkVerification.bind(this)

    socket.on('message', (payload) => this.updateChat(payload,true));
    socket.on('map', (payload) => this.updateChat(payload,false));
    facesocket.on('faceverify', (payload) => this.checkVerification(payload,false));

  }


  componentDidMount() {
    window.addEventListener('text2speech',this.handleSpeech, false);
  }

  checkVerification(payload) {
    if(this.state.verify == true) {
      if(payload.acc_no != 0 || this.state.num_of_times > 3) {

        if(this.state.num_of_times > 3) {
          socket.emit('faceverify',{'acc_no':0})
        } else {
          socket.emit('faceverify',{'acc_no':payload.acc_no})
        }

        this.setState({'verify':false,'num_of_times':0})

      } else {
        var speakMessage = new SpeechSynthesisUtterance('Please try again');
        speakMessage.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google US English'; })[0];
        speechSynthesis.speak(speakMessage);
        this.setState({'num_of_times':this.state.num_of_times +1})
      }
   }
  }

  handleSpeech(e) {
    this.setState({message: e.detail})
  }

  verified() {

    this.setState({'verify': !this.state.verify})
  }

  verifyFace() {
    //this.setState({'verify': true})
  if(this.state.verify == true) {
    return(
      <div>
        <center> <Webcam ref ='webcam' height='300' audio={false} /> </center>
        <button onClick={this.screenshot}>Take Screenshot </button>
      </div>
    )
  } else {
    return (<div id="chatBox" style={{height:200+'px', 'overflow-y': 'scroll'}}>
      {this.renderChats()}
      </div>
    )
  }

  }

  updateChat(msg,chatBot){
    var chat = this.state.chat
    var final_msg = {'message': msg.message,'bot':chatBot}
    console.log(msg)
    if(msg.faceverify == 1) {
      console.log('YOOOOO')
      this.setState({'verify':true})
    }

    if(chatBot == true) {
      if(msg.message.length > 100) {
        console.log('IN it')
        var msg1 = msg.message.substring(0,100)
        console.log(msg1)
        var speakMessage = new SpeechSynthesisUtterance(msg1);
        speakMessage.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google US English'; })[0];
        speechSynthesis.speak(speakMessage);

        var msg2 = msg.message.substring(100,msg.message.length)
        console.log(msg2)
        var speakMessage2 = new SpeechSynthesisUtterance(msg2);
        speakMessage2.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google US English'; })[0];
        speechSynthesis.speak(speakMessage2);
      } else {
      var speakMessage = new SpeechSynthesisUtterance(msg.message);
      speakMessage.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google US English'; })[0];
      speechSynthesis.speak(speakMessage);
      }
    }

    if(msg.map != undefined) {
      final_msg.map = 1;
      final_msg.markers = msg.markers;
    }

    chat.push(final_msg)
    this.setState({'chat': chat,'message':''})

    var objDiv = document.getElementById("chatBox");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  sendMessage() {
    this.updateChat({"message":this.state.message},false)
    socket.emit('message',{dataset:this.state.dataset, message:this.state.message})
    this.setState({'dataset': []})
  }

  handleChange(event) {
    this.setState({'message':event.target.value})
  }

  handleKeyPress(event) {
      let time
      let time_now = Date.now()

      if(this.state.time_last == '') {
        time = 0
      } else {
        time = time_now - this.state.time_last
      }

      let keyPressed = String.fromCharCode(event.charCode)
      let dataset = this.state.dataset

      dataset.push({'key':keyPressed,'time':time})
      this.setState({'dataset':dataset,'time_last':time_now})
    }

  render() {
    var message = this.state.message
    return (
      <div>
        <h1>
          <Link to="/">Chatagram</Link>
        </h1>
        <center>
          {this.verifyFace()}
          <input type="text" value={message} onChange={this.handleChange} onKeyPress={this.handleKeyPress}></input>
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
        return <ChatBubble message={chat.message} key={index} bot={chat.bot} />
      } else {
        let markers = this.formatMapMarkers(chat.markers)
        return <MapBubble markers={markers} key={index} />
      }

    })
  }

  screenshot() {

    facesocket.emit('faceverify',{'picture':this.refs.webcam.getScreenshot()})

  }

};

export default Main;
