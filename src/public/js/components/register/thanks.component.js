import React from "react";
import {Link} from "react-router";

import {connect} from "react-redux";

class ThanksComponent extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {

    // const {auth} = this.props;
    // const {user} = auth;
        
    return (
            <div id="congrats" className="sd-modal">
                <div className="sd-modal-content register-info-box">
                    <h3 className="title">Thank you for your registration</h3>

                    <p className="reg-confirmed">
                        We have sent a confirmation email
                        <br />
                        Please check your email and click on the link to
                        <br />
                        activate your account.
                    </p>
                </div>
            </div>
    );
  }

}

// function mapStateToProps (state) {

//   return {
//     auth: state.auth
//   };

// }

// const actionCreators = {

// };

//export default connect(mapStateToProps, actionCreators)(ThanksComponent);

export default connect(null)(ThanksComponent);