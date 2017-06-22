import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./tools.topbanner.component";
import ToolBoxContainer from "./toolbox.container";
import { getHerramientasInfo } from "../../actions/herramientas";
import { replaceSVGIcons, openHerramientasPopup, closeHerramientasPopup } from "../../utils/custom.jquery";
import $ from "jquery";

class ToolsComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        let pageNum = 1;
        this.props.getHerramientasInfo(pageNum).then(function() {
            replaceSVGIcons();
            openHerramientasPopup();
            closeHerramientasPopup();
        });
    }

    render() {
        return (
            <div>
                <div className="page section-herramientas">
                    <TopBannerImage />
                    <ToolBoxContainer />
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getHerramientasInfo
};

const mapStateToProps = (state) => {
    return {
        herramientas: state.herramientas,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(ToolsComponent);