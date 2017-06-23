import React from "react";
import CookieComponent from "./components/shared/cookie";
import {connect} from "react-redux";
import hideCookie from "./actions/cookie";
import {withRouter} from "react-router";
import HeaderComponent from "./components/shared/header/header.component";
import FooterComponent from "./components/shared/footer/footer.component";
import {customClick} from "./utils/gtm";
import Modal from "./components/shared/modal/modal";

class AppComponent extends React.Component {

    constructor(props) {
        super(props);
    }
    componentDidMount () {
        // customClick({
        //   'test' : 'abc'
        // });
    }
    render() {
        const {modal} = this.props;
        let classes = modal.Component ? 'my-modal-open' : ' ';
        return (
            <div id="main-content" className={classes}>
                {modal.Component ? <Modal /> : null}
                <HeaderComponent showHeader={this.props.location.pathname === '/acreditacion' ? true : false}/>
                    {this.props.children}
                <FooterComponent showFooter={this.props.location.pathname === '/acreditacion' ? true : false}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth:state.auth,
        modal:state.modal
    }
};

export default withRouter(connect(mapStateToProps)(AppComponent));