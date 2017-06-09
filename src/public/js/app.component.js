import React from "react";
import CookieComponent from "./components/shared/cookie";
import {connect} from "react-redux";
import hideCookie from "./actions/cookie";
import {withRouter} from "react-router";
import HeaderComponent from "./components/shared/header/header.component";
import FooterComponent from "./components/shared/footer/footer.component";

class AppComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="main-content">
                <HeaderComponent showHeader={this.props.location.pathname === '/acreditacion' ? true : false}/>
                    {this.props.children}
                <FooterComponent showFooter={this.props.location.pathname === '/acreditacion' ? true : false}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth:state.auth
    }
};

export default withRouter(connect(mapStateToProps)(AppComponent));