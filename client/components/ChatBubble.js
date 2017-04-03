import React, { Component } from 'react'
import { Link } from 'react-router'



class ChatBubble extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if(this.props.bot == true){
      return (
        <div className="chat-bubble" style={{color:'#125688'}}> <b>{this.props.message} </b></div>
      )
    } else {
    return (
      <div className="chat-bubble"> <b>{this.props.message} </b></div>
    )
    }
  }
}

export default ChatBubble
