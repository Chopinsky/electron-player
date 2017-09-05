import React, { Component } from 'react';
import './MainController.css';

const fileCheck = (fileInput) => {
  if (!fileInput || !fileInput.path) {
    alert(`Fail to read the file, try again.`);
    return false;
  } else if (!fileInput.size || ~~fileInput.size === 0) {
    alert(`Can't open empty file.`);
    return false;
  }

  return true;
}

const peekObject = (object) => {
  if (!object) {
    return;
  }

  var str = object.toString() + '\n';
  for (var prop in object) {
    var content =  !!object[prop] ? object[prop].toString() : 'null';
    if (!!prop) {
      str += `${prop} (${typeof object[prop]}): ${content} \n`;
    }
  }

  return str;
}

class MainController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'dragOverClass': ''
    };

    this.onFileSelected = this.onFileSelected.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onFileSelected(event) {
    event.stopPropagation();
    event.preventDefault();

    const control = document.getElementById('fileInput');
    const fileInput = (control && control.files[0]) ? control.files[0] : null;
    if (!fileCheck(fileInput)) {
      return;
    }

    if (typeof this.props.onVideoSelected === 'function') {
      this.props.onVideoSelected(fileInput);
    }
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();

    event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.    
    this.setState({ 'dragOverClass': ' onDragOver' });
  }

  onDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ 'dragOverClass': '' });
  }

  onDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ 'dragOverClass': '' });  
    
    const fileInput = event.dataTransfer.files[0];
    if (!fileCheck(fileInput)) {
      return;
    }
    
    if (typeof this.props.onVideoSelected === 'function') {
      this.props.onVideoSelected(fileInput);
    }
  }

  render() {
    return (
      <div id='mainController' 
           className={'mainController' + this.state.dragOverClass}
           onDragOver={this.onDragOver}
           onDragLeave={this.onDragLeave}
           onDrop={this.onDrop}
      >
        <input id='fileInput' className='fileInput' name='fileInput' 
               onChange={this.onFileSelected} type='file' />
        <div className='labelContainer'>
          <h2 className='labelDnD'>Drag and drop</h2>
          <br />
          <h2 className='labelClick'>Or select a video to play</h2>
          <br />
          <label id='fileInputIcon' htmlFor='fileInput' className='fileInputIcon' title='Open file'>
            <i className='fi-upload'></i>
          </label>
        </div>
      </div>
    );
  }
}

export default MainController;