import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import TopBannerImage from "./webmap.topbanner.component";
import WebmapContainer from "./webmap.container";
import $ from "jquery";

class WebmapComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
            <div>
                <div className="page section-mapa-web">
                    <TopBannerImage />
                    <WebmapContainer />
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

export default connect(mapStateToProps)(WebmapComponent);