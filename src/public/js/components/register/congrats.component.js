import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {verifyEmail} from "../../actions/auth";

class Congrats extends React.Component {

    state = {
        success: null,
        title: "",
        description: ""
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        const {verification_code} = this.props.location.query;

        if (verification_code) {
            this.props.verifyEmail({
                verificationCode: verification_code
            }).then(resp => {

                if (resp.data.stat === 'ok') {
                    this.setState({
                        success: true,
                        title: "Congratulations!",
                        description: "Your registration has been confirmed and now you have a profile on buit-eucan-olum-selfdetail-dev.herokuapp.com."
                    });
                } else if (resp.data.stat === 'error') {
                    this.setState({
                        success: false,
                        title: "Error",
                        description: "Verification code not recognized."
                    });
                }
            });
        } else {
            this.setState({
                success: false,
                title: "Error",
                description: "Verification link is broken."
            });
        }
    }

    render() {
        return (
            <div id="congrats" className="sd-modal">
                <div className="sd-modal-content register-info-box">
                    <Link to="/" className="close-sd-modal">
                        <img src="svg/icons/icon_close_white.svg" alt="Close"/>
                    </Link>

                    {this.state.description ?
                        <div>
                            <h3 className="title">{this.state.title}</h3>

                            <p className="reg-confirmed">{this.state.description}</p>
                        </div> : null
                    }

                    <div>
                        <Link to="/" className="btn btn-orange btn-close">CLOSE</Link>
                    </div>
                </div>
            </div>
        );
    }

}

const actionCreators = {
    verifyEmail
};

export default connect(null, actionCreators)(Congrats);