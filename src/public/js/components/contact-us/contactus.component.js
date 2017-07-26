import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./contactus.topbanner";
import ContactBodyContent from "./contactus.body.content";
import { getContactUsInfo } from "../../actions/contactus";
import { replaceSVGIcons } from "../../utils/custom.jquery";
import $ from "jquery";

class ContactUs extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getContactUsInfo().then(function() {
      replaceSVGIcons();
    });
  }

  render() {
    return (
            <div>
                <div className="page section-contactar">
                    <TopBannerImage />
                    <ContactBodyContent />
                </div>
            </div>
    );
  }
}

const actionCreators = {
  getContactUsInfo
};

const mapStateToProps = (state) => {
  return {
    contactus: state.contactus,
    auth: state.auth
  };
};

export default connect(mapStateToProps, actionCreators)(ContactUs);