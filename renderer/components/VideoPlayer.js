import React, { Component } from "react";
import { fileCheck } from "../service/util";
import "./VideoPlayer.css";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "videoType": "video/" + this.props.extension,
      "closeIconDisplay": "none",
      "isPlaying": false
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
    this.playErrorHandler = this.playErrorHandler.bind(this);
  }

  componentWillUnmount() {
    if (this._player) {
      this._player.pause();
      this._player.removeAttribute("controls");
      this.setState({ "isPlaying": false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source.path !== this.props.source.path) {      
      this.setState({
        "videoType": "video/" + nextProps.extension,
        "isPlaying": false
      });
    }
  }

  componentDidMount() {
    this._player = document.getElementById("videoPlayer");

    this._player.addEventListener("canplay", () => {  
      if (~~this._player.duration === 0) {
        this.playErrorHandler();
        return;
      }

      this.playVideo();
    });
  }

  playVideo() {
    const playPromise = this._player.play();
    if (!!playPromise) {
      playPromise.then(() => {
        this.setState({ "isPlaying": true });
      }).catch((err) => {
        this.playErrorHandler();
      });
    }
  }

  playErrorHandler() {
    alert(`Video file is broken and can"t be played!`);
    this.setState({ "isPlaying": false });
    if (typeof this.props.onVideoPlayFailed === "function") {
      this.props.onVideoPlayFailed();
    }
  }

  onMouseEnter(event) {
    this.setState({ "closeIconDisplay": "inline-block" });
  }

  onMouseLeave(event) {
    this.setState({ "closeIconDisplay": "none" });
  }

  clickHandler(event) {
    if (!this._player) {
      return;
    }

    try {
      if (this._player.paused) {
        this.playVideo();
      } else {
        this.setState({ "isPlaying": false });
        this._player.pause();
      }      
    } catch (error) {
      if (typeof this.props.onVideoPlayFailed === "function") {
        this.props.onVideoPlayFailed();
      }      
    }
  }
  
  dragOverHandler(event) {
    event.stopPropagation();
    event.preventDefault();

    event.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
  }    

  dropHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    
    const fileInput = event.dataTransfer.files[0];
    if (!fileCheck(fileInput)) {
      return;
    }
    
    if (typeof this.props.onVideoDropped === "function") {
      this.props.onVideoDropped(fileInput);
    }
  }

  render() {
    return (
      <div className="videoContainer"
           onMouseEnter={this.onMouseEnter}
           onMouseLeave={this.onMouseLeave}
           onDragOver={this.dragOverHandler}
           onDrop={this.dropHandler}
      >
        <div id="videoPlay" className="videoPlay" onClick={this.clickHandler}
             style={{ "display": this.state.isPlaying ? "none" : "inline-block" }}
        >
          <i className="fi-play"></i>
        </div>
        <div id="videoClose" style={{ "display": this.state.closeIconDisplay }}
             onClick={this.props.closeVideo}
             className="videoClose fi-x" />
        <video id="videoPlayer" controls className="videoPlayer"
               onClick={this.clickHandler} onError={this.playErrorHandler} 
               onAbort={this.playErrorHandler}
        >
          <p>Your browser does not support HTML5</p>
          <source src={this.props.source.path} type={this.state.videoType} />
          <track label={this.props.subLang} src={this.props.subtitle} kind="subtitles" default />
        </video>
      </div>
    );
  }
}

export default VideoPlayer;