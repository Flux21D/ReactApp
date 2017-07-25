import React from "react";

class VideoControls extends React.Component {

  constructor(props) {
    super(props);

    this.togglePlay = this.togglePlay.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.fullScreen = this.fullScreen.bind(this);
    this.setProgress = this.setProgress.bind(this);
  }

  togglePlay() {
    this.props.togglePlay();
  }

  fullScreen() {
    this.props.fullScreen();
  }

  getMinutes(timeInSeconds) {
    let date = new Date(null);
    date.setSeconds(timeInSeconds);

    return date.toISOString().substr(14, 5);
  }

  toggleMute() {
    this.props.toggleMute();
  }

  setVolume (e) {
    const y = e.nativeEvent.offsetY;

    const volume = (50 - y) / 50;

    this.props.setVolume(volume);
  }

  setProgress (e) {
    const x = e.nativeEvent.offsetX;
    const width = e.target.offsetWidth;

    this.props.setProgress(x, width);
  }

  render() {

    const {configs} = this.props;

    let volume = configs.volume * 100;

    if (configs.muted) {
      volume = 0;
    }

    return (
            <div>
                <div className="btn-play-pause-tablet" onClick={this.togglePlay}>
                    <img src={"svg/icons/icon_" + (configs.paused ? "play" : "pause") + ".svg"}
                         alt={configs.paused ? 'play' : 'pause'}/>
                </div>
                <div className="video-controls-container">

                    <div className="btn-play-pause" onClick={this.togglePlay}>
                        <img src={"svg/icons/icon_" + (configs.paused ? "play" : "pause") + ".svg"}
                             alt={configs.paused ? 'play' : 'pause'}/>
                    </div>

                    <div className="video-progress-container">
                        <div className="video-progress" onClick={this.setProgress}>
                            <span className="video-buffer-track" style={{width: configs.percentageBuffered + '%'}}/>
                            <span className="video-progress-track" style={{width: configs.percentagePlayed + '%'}}/>
                        </div>
                    </div>

                    <div className="video-progress-time">{this.getMinutes(configs.currentTime)}</div>

                    <div className="video-volume-container">
                    <span className={"volume-icon " + (configs.muted ? 'mute' : '')} onClick={this.toggleMute}>
                        <img src="svg/icons/icon_sound.svg" alt=""/>
                    </span>

                        <div className="volume-progress-container">
                        <span className="volume-progress" onClick={this.setVolume}>
                            <span className="volume-track" style={{height: volume + '%'}}/>
                        </span>
                        </div>
                    </div>

                    <div className="video-full-screen-container" onClick={this.fullScreen}>
                        <img src="svg/icons/icon_fullscreen.svg" alt=""/>
                    </div>
                </div>
            </div>
    );
  }
}

export default VideoControls;