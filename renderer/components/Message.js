import React, { Component } from "react";
import "./Message.css";

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      "message": this.props.message,
      "wrapperClass": "msgWrapper msgFadeIn msgError"
    };
    
    this.onBtnClicked = this.onBtnClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      "wrapperClass": "msgWrapper msgFadeIn msgError"
    });
  }

  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      this.setState({"wrapperClass": "msgWrapper msgError"});
    }, 500);
  }

  onBtnClicked(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ "message": null });
  }

  render() {
    return (
      <div className={this.state.wrapperClass}
           style={{ "display": this.state.message ? "inline-block" : "none" }}>
        <span>{this.state.message}</span>
      </div>
    );
  }
}

export default Message;