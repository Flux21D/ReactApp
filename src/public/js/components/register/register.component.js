import React from "react";
import {connect} from "react-redux";
import {openModal} from "../../actions/modal";

import RegisterForm from "./register-form.component";

class RegistrationComponent extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {
    document.title = 'Registration Page';

    return (
            <div className="fixed-box">
                <div className="fix-box-inner">
                    <RegisterForm />
                </div>
            </div>
    );
  }

}

RegistrationComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(null, {})(RegistrationComponent);