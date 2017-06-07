import React from "react";
import 'babel-polyfill';
import {Link} from "react-router";
import {connect} from "react-redux";
import HeaderComponent from "../shared/header/header.component";
import FooterComponent from "../shared/footer/footer.component";
import PreLoginBody from "../shared/header/preLoginBody.component";
import PostLoginBody from "../shared/header/postLoginBody.component";
import RegisterComponent from '../register/register.component';
import Modal from "../shared/modal/modal";
import {openModal} from "../../actions/modal";

class IndexComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        const {modal} = this.props;
        let classes = modal.Component ? 'my-modal-open' : ' ';

        return (
            <div>
                {
                 this.props.auth.accessToken ?
                 <PostLoginBody /> :
                 <PreLoginBody />
                }
                { this.props.children }                
           </div>
        );
    }
}

IndexComponent.contextTypes = {
    router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        auth:state.auth,
        modal: state.modal
    }
};

const actionCreators = {
    openModal
};

export default connect(mapStateToProps,actionCreators)(IndexComponent);