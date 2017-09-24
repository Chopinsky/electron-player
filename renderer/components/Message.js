import React, { Component } from "react";
import "./Warnings.css";

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = { "message": null };
    
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
        <button className="msgBtn msgBtnTransition" onSubmit={this.onBtnClicked}>OK</button>
      </div>
    );
  }
}