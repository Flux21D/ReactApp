import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {forgotPassword, removeAuthErrors} from "../../actions/auth";

class ForgotPassword extends React.Component {

  state = {
    formData: {
      traditionalSignIn_emailAddress: ''
    },
    successMsg: ''
  };

  constructor (props) {
    super (props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();

    this.props.forgotPassword(this.state.formData).then(resp => {
      if (resp.data.stat === 'ok') {
        this.setState({
          successMsg: "An email has been sent to the email with a reset link."
        });
      }

    }).catch(err => {return console.log(err)});

  }

  handleFormChange (event) {
    let formData = this.state.formData;
    formData[event.target.name] = event.target.value;

    this.setState({
      formData
    });
  }

  componentWillUnmount () {
    this.props.removeAuthErrors();
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
                            <span className="janrain-icon-16 janrain-icon-ex2"></span>
                        </Link>
                        <form id="login" onSubmit={this.handleSubmit}>
                            <h3 className="title">Forgot password</h3>

                            <p className="desc">Enter your email address below and a new <br />password will be send to your mailbox.</p>

                            <div className="input-group">
                                <span className="input-group-addon">
                                    <img src="svg/icons/icon_mail.svg" />
                                </span>
                                <input name="traditionalSignIn_emailAddress" type="email" onChange={this.handleFormChange} value={this.state.formData.traditionalSignIn_emailAddress} className="form-control" placeholder="Email" />
                            </div>

                            {errors.traditionalSignIn_emailAddress ? mapErrors(errors.traditionalSignIn_emailAddress) : null}
                            {errors.forgotPasswordForm ? mapErrors(errors.forgotPasswordForm) : null}

                            {this.state.successMsg ? <p className="text-orange">{this.state.successMsg}</p> : null}

                            <div className="wrp-buttons">
                                <div className="pull-left">
                                    <Link className="btn btn-white btn-cancel" to="/login">CANCEL</Link>
                                </div>
                                <div className="pull-right">
                                    <input type="submit" className="btn btn-orange btn-login" value="RESEND PASSWORD" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    );

  }

}

ForgotPassword.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const actionCreators = {
  forgotPassword,
  removeAuthErrors
};

export default connect(mapStateToProps, actionCreators)(ForgotPassword);