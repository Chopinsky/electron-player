import React, { Component } from "react";
import "./App.css";

import MainController from "./MainController";
import VideoPlayer from "./VideoPlayer";
import Message from './Message';

import { ipcRenderer } from "electron";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "videoSource": "",
      "videoExtension": "",
      "playHistory": [],
      "message": ""
    }

    this.onVideoSelected = this.onVideoSelected.bind(this);
    this.closeVideoHandler = this.closeVideoHandler.bind(this);
  }

  onVideoSelected(fileInput, isFromFile) {
    const extension = (fileInput && fileInput.name) ? fileInput.name.split(".").pop() : "";

    if (!extension) {
      alert("Can't recognize the video type");
      this.setState({ 
        "videoSource": "",
        "message": "Can't recognize the video type"
      });

      return;
    }

    if (fileInput) {
      this.setState({
        "videoSource": fileInput,
        "videoExtension": extension,
        "message": ""
      });
    }

    const newVidPlay = { "video": fileInput.name, "path": fileInput.path, "timeStamp": new Date().toString() };
    const histToStay = this.state.playHistory;

    if (histToStay.length > 0) {
      let index = histToStay.findIndex((hist) => 
                      (hist.video === newVidPlay.video) && (hist.path === newVidPlay.path));
      index = (index < 0 || index > histToStay.length - 1) ? histToStay.length - 1 : index;
      histToStay.splice(index, 1);    
    } 

    ipcRenderer.send("asynchronous-message", JSON.stringify([newVidPlay, ...histToStay]));
    this.setState({ "playHistory": [newVidPlay, ...histToStay] });
  }

  closeVideoHandler(obj, event, err) {
    this.setState({
      "videoSource": "",
      "videoExtension": "",
      "message": err
    });

    if (err) {
      setTimeout(() => {
        this.setState({ "message": "" });
      }, 2500);
    }
  }

  render() {
    return (
      <div className="pageContainer">
        <div>
        { 
          this.state.videoSource ?
            <VideoPlayer source={this.state.videoSource} 
                         extension={this.state.videoExtension} 
                         closeVideo={this.closeVideoHandler} 
                         onVideoPlayFailed={this.closeVideoHandler}
                         onVideoDropped={this.onVideoSelected} /> :
            <MainController onVideoSelected={this.onVideoSelected} />
        }
        </div>
        <div className="messageContainer">
          { this.state.message ? <Message message={this.state.message} /> : null }
        </div>
      </div>
    );
  }
}

export default App;