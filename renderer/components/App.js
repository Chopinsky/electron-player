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
      "message": ""
    }

    this.playHistory = [];

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

    if (this.playHistory.length > 0) {
      const index = this.playHistory.findIndex((hist) => 
                      (hist.video === newVidPlay.video) && (hist.path === newVidPlay.path));

      if (index >=0 && index < this.playHistory.length) {
        // if found in the array
        this.playHistory.splice(index, 1);
        newVidPlay["played"] = true;
      } else if (this.playHistory.length > 20) {
        // don't blow up the memeory
        const count = this.playHistory.length - 20;
        this.playHistory.splice(20, count);
      }
    } 
    
    this.playHistory = [newVidPlay, ...this.playHistory];
    ipcRenderer.send("asynchronous-message", JSON.stringify(this.playHistory));
    console.log(this.playHistory);
  }

  closeVideoHandler(obj, event, err) {
    this.setState({
      "videoSource": "",
      "videoExtension": "",
      "message": err
    });

    if (err) {
      if (!!obj && !!obj.path) {
        // if play error, don't add it to 
        const index = this.playHistory.findIndex(video => video.path === obj.path && !video.played);
        this.playHistory.splice(index, 1);

        // tell main process to update play history
        ipcRenderer.send("asynchronous-message", JSON.stringify(this.playHistory));
        console.log(this.playHistory);
      }

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