import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./privacy.topbanner";
import PrivacyPolicy from "./privacypolicy";
import HeaderComponent from "../shared/header/header.component";
import FooterComponent from "../shared/footer/footer.component";
import $ from "jquery";

class TermsConditions extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {

  }

  render() {
    return (
            <div className="page section-texto-legal">
                <TopBannerImage />
                <PrivacyPolicy />
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(TermsConditions);