import React from 'react';
import {Link} from "react-router";
import {connect} from "react-redux";
import $ from "jquery";
import PostLoginHeader from "./postlogin.header.component";
import PreLoginHeader from "./prelogin.header.component";

class HeaderComponent extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
            <div id="login-header" style={{display: this.props.showHeader ? 'none' : 'block'}}>
            {
                !this.props.auth.accessToken ?
                <PreLoginHeader /> :
                <PostLoginHeader />
            }
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
};

export default connect(mapStateToProps)(HeaderComponent);
