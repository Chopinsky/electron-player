import React, { Component } from "react";
import { fileCheck } from "../service/util";
import "./MainController.css";

class MainController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "dragOverClass": "",
      "fieldIsEmpty": true
    };

    this.onFileSelected = this.onFileSelected.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onBtnClickHanlder = this.onBtnClickHanlder.bind(this);
    this.onInputKeyUp = this.onInputKeyUp.bind(this);
    this.onClearFieldHandler = this.onClearFieldHandler.bind(this);
  }

  onFileSelected(event) {
    event.stopPropagation();
    event.preventDefault();

    const control = document.getElementById("fileInput");
    const fileInput = (control && control.files[0]) ? control.files[0] : null;
    if (!fileCheck(fileInput)) {
      return;
    }

    if (typeof this.props.onVideoSelected === "function") {
      this.props.onVideoSelected(fileInput, true);
    }
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();

    event.dataTransfer.dropEffect = "Play"; // Explicitly show this is a copy.    
    this.setState({ "dragOverClass": " onDragOver" });
  }

  onDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ "dragOverClass": "" });
  }

  onDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ "dragOverClass": "" });  
    
    const fileInput = event.dataTransfer.files[0];
    if (!fileCheck(fileInput)) {
      return;
    }
    
    if (typeof this.props.onVideoSelected === "function") {
      this.props.onVideoSelected(fileInput, true);
    }
  }

  onBtnClickHanlder(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.state.fieldIsEmpty) {
      // don't act if input field is empty
      return;
    }

    if (typeof this.props.onVideoSelected === "function") {
      this.props.onVideoSelected(event.target.value, false);
    }
  }

  onInputKeyUp(event) {
    event.stopPropagation();
    event.preventDefault();

    const emptyInput = !event.target.value;
    if (this.state.fieldIsEmpty !== emptyInput) {
      this.setState({
        "fieldIsEmpty": emptyInput
      });
    }

    if (event.keyCode == 13) {
      if (typeof this.props.onVideoSelected === "function") {
        this.props.onVideoSelected(event.target.value, false);
      }
    }
  }

  onClearFieldHandler(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.state.fieldIsEmpty) {
      document.getElementById("linkInput").value = "";
      this.setState({ "fieldIsEmpty": true });
    }
  }

  playBtnClass() {
    const defaultClasses = "btn btn-block btn-success playButton ";
    const controlClass = this.state.fieldIsEmpty ? "disabled" : "active";
    return defaultClasses + controlClass;
  }

  render() {
    return (
      <div id="mainController" className="mainController">
        <div id="mainContainer" className={"mainContainer" + this.state.dragOverClass}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
        >
          <input id="fileInput" className="fileInput" name="fileInput" 
                 onChange={this.onFileSelected} type="file" />
          <div className="labelContainer">
            <h2 className="labelDnD">Drag and drop</h2><br />
            <h2 className="labelClick">Or select a video to play</h2><br />
            <label id="fileInputIcon" htmlFor="fileInput" className="fileInputIcon" title="Open file">
              <i className="fi-upload"></i>
            </label>
          </div>
          <div className="labelField">
            <h2 className="labelLink">Or enter a link to the video</h2><br />
            <form className="linkForm">
              <input id="linkInput" className="form-control linkInput" 
                     name="linkInput" type="text" onKeyUp={this.onInputKeyUp}/>
              <span className="fi-x closeIcon" 
                    style={{ "display": this.state.fieldIsEmpty ? "none" : "inline-block" }} 
                    onClick={this.onClearFieldHandler}></span>
              <button onClick={this.onBtnClickHanlder} className={this.playBtnClass()}>
                <span className="glyphicon glyphicon-play"></span> Play Link
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default MainController;