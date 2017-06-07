import React from "react";
import {Link} from "react-router";

class Cookie extends React.Component {

  constructor (props) {
    super (props);

    this.hideCookie = this.hideCookie.bind(this);
  }

  hideCookie () {
    this.props.hideCookie();
  }

  render () {
    return (
            <div id="cookie">
                <p className="cookie-desc">Please be aware that this website relies on the use of cookies to function correctly and involves some cookies being downloaded onto your device. By continuing to use this website, you agree to our use of these cookies. This helps us to improve the content of the website so that it is more useful and relevant to you. For more information please see our <Link className="text-orange" to="privacy-policy">Privacy and Cookies Policy</Link>.</p>

                <div className="wrp-close-btn">
                    <span onClick={this.hideCookie} className="btn btn-transparent">CLOSE</span>
                </div>

            </div>
    );
  }

}

export default Cookie;