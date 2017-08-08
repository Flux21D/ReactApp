import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {openModal,closeModal} from "../../actions/modal";
import {register, removeAuthErrors} from "../../actions/auth";
import ThanksComponent from './thanks.component';
import {removeNewUser} from "../../actions/auth";
import $ from "jquery";

class SuccessComponent extends React.Component {

  constructor(props) {
    super(props);
  }
  componentWillMount(){
    $('#janrainModalOverlay').css('display', 'none !important');
  }
  componentDidMount() {
    document.title = 'Registration Success';
        //Open this for custom thanks message
    this.props.openModal({
      Component: ThanksComponent,
      dialogSettings: {
        classes: "welcome-box index-modal-box"
      },
      onBeforeClose: () => {
        this.context.router.push("/");
        //this.props.removeNewUser();
      }
    });
  }

  render() {
    return (
            <div>
                
            </div>
    );
  }

}

SuccessComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const actionCreators = {
  register,
  openModal,
  closeModal,
  removeAuthErrors
};

export default connect(mapStateToProps, actionCreators)(SuccessComponent);