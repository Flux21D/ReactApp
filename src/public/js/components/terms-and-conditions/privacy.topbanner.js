import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

class TopBannerImage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {

  }

  render() {
    return (
            <div className="section-header" style={{backgroundImage: 'url(img/backgrounds/texto-legal.jpg)'}}>
                <div className="content">
                    <h1 className="size1">Términos y condiciones</h1>
                </div>
            </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(TopBannerImage);