import React from 'react';
import {Link} from "react-router";
import {connect} from "react-redux";
import $ from "jquery";
import HomeComponent from "../../home/home.component";

class PostLoginBody extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
            <div>
                <HomeComponent />
                {this.props.children}
            </div>
    );
  }
}
PostLoginBody.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
};

export default connect(mapStateToProps)(PostLoginBody);
