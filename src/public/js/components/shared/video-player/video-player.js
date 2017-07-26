import React from "react";
import VideoControls from "./video-controls";
import throttle from "lodash/throttle";

class VideoPlayer extends React.Component {

  state = {
    duration: 0,
    currentTime: 0,
    paused: true,
    muted: false,
    volume: 1.0
  };

  constructor(props) {
    super(props);

    this.togglePlay = this.togglePlay.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.setProgress = this.setProgress.bind(this);
    this.fullScreen = this.fullScreen.bind(this);
    this.updateStateFromVideo = this.updateStateFromVideo.bind(this);
    this.vidEnd = this.vidEnd.bind(this);
    this.vidStart = this.vidStart.bind(this);
  }

  componentWillUnmount() {
    this._updateStateFromVideo.cancel();

    this.videoEl.removeEventListener('timeupdate', this.updateStateFromVideo);
    this.videoEl.removeEventListener('progress', this.updateStateFromVideo);

    if(typeof this.props.notGuide != undefined)
      if(this.props.notGuide === false)
            {   console.log('Inside WEWEWEWE');
        this.videoEl.pause();
      }
  }

  componentDidMount() {
    const {videoAttrs} = this.props;

    if (videoAttrs && videoAttrs.autoPlay) {
      this.togglePlay();
    }
    else if(this.props.notGuide === false)
        {   console.log('Inside GEGEGEGEGE');
      this.videoEl.pause();
    }

    this._updateStateFromVideo = throttle(this.updateStateFromVideo, 100);

    this.videoEl.addEventListener('timeupdate', this.updateStateFromVideo);
    this.videoEl.addEventListener('progress', this.updateStateFromVideo);



  }

  componentWillReceiveProps (nextProps) {
    const {videoAttrs} = this.props;

    if (videoAttrs && videoAttrs.autoPlay !== nextProps.videoAttrs.autoPlay) {
      this.togglePlay();
    }
  }

  componentWillUpdate (nextProps) {

    const {poster} = this.props;

    if (poster !== nextProps.poster) {
      var that = this;
      setTimeout(function(){
        that.videoEl.pause();
        that.videoEl.currentTime = 0;
	            that.videoEl.load();
      },1000);
    }
  }

  updateStateFromVideo() {

    this.setState({
            // Standard video properties
      duration: this.videoEl.duration,
      currentTime: this.videoEl.currentTime,
      buffered: this.videoEl.buffered,
      paused: this.videoEl.paused,
      muted: this.videoEl.muted,
      volume: this.videoEl.volume,
      playbackRate: this.videoEl.playbackRate,
      readyState: this.videoEl.readyState,
            // Non-standard state computed from properties
      percentageBuffered: this.videoEl.buffered.length && this.videoEl.buffered.end(this.videoEl.buffered.length - 1) / this.videoEl.duration * 100,
      percentagePlayed: this.videoEl.currentTime / this.videoEl.duration * 100,
      error: this.videoEl.networkState === this.videoEl.NETWORK_NO_SOURCE,
      loading: this.videoEl.readyState < this.videoEl.HAVE_ENOUGH_DATA
    });

    if (this.props.videoStateChange) {
      this.props.videoStateChange(this.state);
    }
  }

  fullScreen() {
    if (this.videoEl.requestFullscreen) {
      this.videoEl.requestFullscreen();
    } else if (this.videoEl.msRequestFullscreen) {
      this.videoEl.msRequestFullscreen();
    } else if (this.videoEl.mozRequestFullScreen) {
      this.videoEl.mozRequestFullScreen();
    } else if (this.videoEl.webkitRequestFullscreen) {
      this.videoEl.webkitRequestFullscreen();
    }
  }

  togglePlay () {
    this.videoEl.paused ? this.videoEl.play() : this.videoEl.pause();
    this.updateStateFromVideo();
  }

  pause () {
    this.videoEl.pause();
    this.updateStateFromVideo();
  }

  toggleMute () {
    this.videoEl.muted = !this.state.muted;
    this.updateStateFromVideo();
  }

  setVolume (volume) {
    this.videoEl.volume = volume;
    this.updateStateFromVideo();
  }

  setProgress (progress, width) {
    this.videoEl.currentTime = this.state.duration * progress / width;
  }

  vidEnd(){
    this.props.myEnd();
  }

  vidStart(){
    this.props.onPlay();
  }

  render() {

    const {videos, poster, myEnd, onPlay, notGuide = true } = this.props;

    return (
            <div className="video-player">
                <video ref={el => {
                  return this.videoEl = el
                }} poster={poster} preload="none" autoPlay="true" onEnded={this.vidEnd} onPlay={this.vidStart}>
                    {videos.map((video, key) => {
                      return <source key={key} src={video.src} type={video.type}/>;
                    })}
                    Your browser does not support the video tag.
                </video>
                { notGuide?
                <VideoControls configs={this.state} fullScreen={this.fullScreen} togglePlay={this.togglePlay}
                               toggleMute={this.toggleMute} setVolume={this.setVolume} setProgress={this.setProgress}/>:null
                }
            </div>
    );
  }
}

export default VideoPlayer;