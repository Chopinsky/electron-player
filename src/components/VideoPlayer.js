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
  }

  componentWillUnmount() {
    const player = document.getElementById("videoPlayer");
    if (player) {
      player.pause();
      player.removeAttribute("controls");
    }
  }

  onMouseEnter(event) {
    this.setState({ 'closeIconDisplay': 'inline-block' });
  }

  onMouseLeave(event) {
    this.setState({ 'closeIconDisplay': 'none' });
  }

  render() {
    return (
      <div className="videoContainer"
           onMouseEnter={this.onMouseEnter}
           onMouseLeave={this.onMouseLeave}
      >
        <div id='videoClose' style={{ 'display': this.state.closeIconDisplay }}
             onClick={this.props.closeVideo}
             className='videoClose fi-x' />
        <video id='videoPlayer' autoPlay controls className='videoPlayer'
               src={this.props.source.path} type={this.state.videoType}>
          <p>Your browser doesn't support HTML5</p>
        </video>
      </div>
    );
  }
}

export default VideoPlayer;