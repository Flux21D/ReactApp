import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

class TopBannerImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
            <div className="section-header" style={{backgroundImage: 'url(img/backgrounds/texto-legal.jpg)'}}>
                <div className="content">
                    <h1 className="size1">Mapa Web</h1>
                </div>
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    calendario: state.calendario,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(TopBannerImage);