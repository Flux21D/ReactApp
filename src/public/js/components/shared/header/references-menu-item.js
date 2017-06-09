import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {toggleReference} from "../../../actions/reference";

class ReferencesMenu extends React.Component {

    constructor (props) {
        super (props);

        this.showReference = this.showReference.bind(this);
    }

    showReference (event) {
        event.preventDefault();
        this.props.handleToggleSidebarNav();
        this.props.toggleReference({
            showReference: true
        });
    }

    render () {
        return (
            <li>
                <Link to="/references" onClick={this.showReference}>
                    <img src="svg/icons/icon_ref.svg" /> REFERENCES
                </Link>
            </li>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        references: state.references
    };
};

const actionCreators = {
    toggleReference
};

export default connect(mapStateToProps, actionCreators)(ReferencesMenu);