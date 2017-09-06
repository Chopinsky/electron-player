import React, { Component } from 'react';
import './VideoPlayer.css';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'videoType': 'video/' + this.props.extension,
      'closeIconDisplay': 'none'
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onDropHandler = this.onDropHandler.bind(this);
  }

  componentWillUnmount() {
    if (this._player) {
      this._player.pause();
      this._player.removeAttribute("controls");
      this.setState({ 'isPlaying': false });
    }
  }

  componentDidMount() {
    this._player = document.getElementById("videoPlayer");
    this.setState({ 'isPlaying': true });
  }

  onMouseEnter(event) {
    this.setState({ 'closeIconDisplay': 'inline-block' });
  }

  onMouseLeave(event) {
    this.setState({ 'closeIconDisplay': 'none' });
  }

  onClickHandler(event) {
    if (!this._player) {
      return;
    }

    if (this._player.paused) {
      this.setState({ 'isPlaying': true });
      this._player.play();
    } else {
      this.setState({ 'isPlaying': false });
      this._player.pause();
    }
  }

  onDropHandler(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    return (
      <div className="videoContainer"
           onMouseEnter={this.onMouseEnter}
           onMouseLeave={this.onMouseLeave}
           onDrop={this.onDropHandler}
      >
        <div id='videoPlay' className='videoPlay' onClick={this.onClickHandler}
             style={{ 'display': this.state.isPlaying ? 'none' : 'inline-block' }}
        >
          <i className='fi-play'></i>
        </div>
        <div id='videoClose' style={{ 'display': this.state.closeIconDisplay }}
             onClick={this.props.closeVideo}
             className='videoClose fi-x' />
        <video id='videoPlayer' autoPlay controls className='videoPlayer'
               onClick={this.onClickHandler}
               src={this.props.source.path} type={this.state.videoType}>
          <p>Your browser doesn't support HTML5</p>
        </video>
      </div>
    );
  }
}

export default VideoPlayer;