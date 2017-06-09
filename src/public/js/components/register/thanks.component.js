import React from "react";
import {Link} from "react-router";

import {connect} from "react-redux";

class ThanksComponent extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {

    const {auth} = this.props;
    const {user} = auth;

    return (
            <div id="congrats" className="sd-modal">
                <div className="sd-modal-content register-info-box">
                    <Link to="/" className="close-sd-modal">
                        <img src="svg/icons/icon_close_white.svg" alt="Close"/>
                    </Link>

                    <h3 className="title">Thank you for your registration</h3>

                    <p className="reg-confirmed">
                        We have sent a confirmation email to {user.email}
                        <br />
                        Please check your email and click on the link to
                        <br />
                        activate your account.
                    </p>

                    <div className="wrp-btn-close">
                        <Link to="/" className="btn btn-orange btn-close">CLOSE</Link>
                    </div>
                </div>
            </div>
    );
  }

}

function mapStateToProps (state) {

  return {
    auth: state.auth
  };

}

const actionCreators = {

};

export default connect(mapStateToProps, actionCreators)(ThanksComponent);