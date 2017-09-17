import React, { Component } from "react";
import "./App.css";

import MainController from "./MainController";
import VideoPlayer from "./VideoPlayer";

import { ipcRenderer } from "electron";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "videoSource": "",
      "videoExtension": "",
      "playHistory": []
    }

    this.onVideoSelected = this.onVideoSelected.bind(this);
    this.closeVideoHandler = this.closeVideoHandler.bind(this);

    // ipcRenderer.on("asynchronous-reply", function(event, arg) {
    //   console.log(arg); // prints "pong"
    //   setTimeout(() => {
    //     ipcRenderer.send("asynchronous-message", "ping");    
    //   }, 1000);
    // });
  }

  onVideoSelected(fileInput, isFromFile) {
    const extension = (fileInput && fileInput.name) ? fileInput.name.split(".").pop() : "";

    if (!extension) {
      alert("Can't recognize the video type");
      this.setState({ "videoSource": "" });
      return;
    }

    if (fileInput) {
      this.setState({
        "videoSource": fileInput,
        "videoExtension": extension
      });
    }

    const newVidPlay = { "video": fileInput.name, "path": fileInput.path, "timeStamp": new Date().toString() };
    ipcRenderer.send("asynchronous-message", JSON.stringify(newVidPlay));

    const histToStay = this.state.playHistory;
    if (histToStay.length > 0) {
      let index = histToStay.findIndex((hist) => 
                      (hist.video === newVidPlay.video) && (hist.path === newVidPlay.path));
      index = (index < 0 || index > histToStay.length - 1) ? histToStay.length - 1 : index;
      histToStay.splice(index, 1);    
    } 

    this.setState({
      "playHistory": [newVidPlay, ...histToStay]
    });
  }

  closeVideoHandler() {
    this.setState({
      "videoSource": "",
      "videoExtension": ""
    });
  }

  render() {
    return (
      <div className="pageContainer">
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
    );
  }
}

export default App;