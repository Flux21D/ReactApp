import React from "react";
import {Link} from "react-router";
import extend from "lodash/extend";
import {connect} from "react-redux";
import {resetPassword} from "../../actions/auth";
import {janrainCustomPasswordValidation} from "../../utils/janrain-helpers";

class ResetPassword extends React.Component {

  state = {
    formData: {
      newPassword: '',
      newPasswordConfirm: '',
      code: ''
    },
    successMsg: '',
    errorMsg: '',
    screen: "forgot-password"
  };

  constructor (props) {
    super (props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();

    const code = this.props.location.query.code;

    let {formData} = this.state;

    if (formData.newPassword !== formData.newPasswordConfirm) {

      this.setState({
        errorMsg: "Passwords doesn't match"
      });

    } else if (!janrainCustomPasswordValidation(formData.newPassword)) {
      this.setState({
        errorMsg: "Passwords must contain at least 8 characters and 1 numeric digit."
      });
    } else {
      this.setState({
        errorMsg: ""
      });

      formData = extend(formData, {
        code: code
      });

      this.props.resetPassword(formData).then(resp => {

        if (resp.data.stat === 'ok') {
          this.setState({
            screen: "success"
          });
        }

      }).catch(err => {return console.log(err)});
    }

  }

  handleFormChange (event) {
    let formData = this.state.formData;
    formData[event.target.name] = event.target.value;

    this.setState({
      formData
    });
  }

  render () {
    const {errors} = this.props.auth;

    const mapErrors = (errs) => {
      return errs.map((err, key) => {return <p className="text-orange" key={key}>{err}</p>});
    };

    return (
            <div className="fixed-box">
                <div className="fix-box-inner">
                    <div className="page-box login-box">
                        <Link to="/" className="page-box-close">
                            <img src="svg/icons/icon_close_white.svg" alt="Close" />
                        </Link>

                        {this.state.screen === "success" ?
                            <div id="password-changed">
                                <h3 className="title">Your password has been changed</h3>

                                <p>Password has been successfully updated.</p>

                                <div>
                                    <Link className="btn btn-orange" to="login">LOGIN</Link>
                                </div>
                            </div> : null}

                        {this.state.screen === "forgot-password" ?
                            <form id="login" onSubmit={this.handleSubmit}>
                                <h3 className="title">Reset password</h3>

                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <img src="svg/icons/icon_lock.svg" />
                                    </span>
                                    <input name="newPassword" type="password" onChange={this.handleFormChange} defaultValue={this.state.formData.newPassword} className="form-control" placeholder="Password" />
                                </div>

                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <img src="svg/icons/icon_lock.svg" />
                                    </span>
                                    <input name="newPasswordConfirm" type="password" onChange={this.handleFormChange} defaultValue={this.state.formData.newPasswordConfirm} className="form-control" placeholder="Confirm password" />
                                </div>

                                {this.state.errorMsg ? <p className="text-orange">{this.state.errorMsg}</p> : null}
                                {errors.code ? mapErrors(errors.code) : null}

                                <div className="wrp-buttons">
                                    <div className="pull-left">
                                        <Link className="btn btn-white btn-cancel" to="/">CANCEL</Link>
                                    </div>
                                    <div className="pull-right">
                                        <input type="submit" className="btn btn-orange btn-login" value="SAVE" />
                                    </div>
                                </div>
                            </form> : null}
                    </div>
                </div>
            </div>
    );
  }

}

const mapStateTopProps = (state) => {
  return {
    auth: state.auth
  };
};

const actionCreators = {
  resetPassword
};

export default connect(mapStateTopProps, actionCreators)(ResetPassword);