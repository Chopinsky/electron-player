import React, { Component } from "react";
import "./Message.css";

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = { "message": this.props.message };
    
    this.onBtnClicked = this.onBtnClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
  }

  onBtnClicked(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ "message": null });
  }

  render() {
    return (
      <div className="msgWrapper msgTransition msgError" 
           style={{ "display": this.state.message ? "inline-block" : "none" }}>
        <span>{this.state.message}</span>
      </div>
    );
  }
}

export default Message;