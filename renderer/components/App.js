import React, { Component } from 'react';
import './App.css';

import MainController from './MainController';
import VideoPlayer from './VideoPlayer';

import { ipcRenderer } from 'electron';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'videoSource': '',
      'videoExtension': ''
    }

    this.onVideoSelected = this.onVideoSelected.bind(this);
    this.closeVideoHandler = this.closeVideoHandler.bind(this);

    // console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
    ipcRenderer.on('asynchronous-reply', function(event, arg) {
      console.log(arg); // prints "pong"
      setTimeout(() => {
        ipcRenderer.send('asynchronous-message', 'ping');    
      }, 1000);
    });

    ipcRenderer.send('asynchronous-message', 'ping');
  }

  onVideoSelected(fileInput) {
    const extension = (fileInput && fileInput.name) ? fileInput.name.split('.').pop() : "";

    if (!extension) {
      alert("Can't recognize the video type");
      this.setState({ 'videoSource': '' });
      return;
    }

    if (fileInput) {
      this.setState({
        'videoSource': fileInput,
        'videoExtension': extension
      });
    }
  }

  closeVideoHandler() {
    this.setState({
      'videoSource': '',
      'videoExtension': ''
    });
  }

  render() {
    return (
      <div className='pageContainer'>
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