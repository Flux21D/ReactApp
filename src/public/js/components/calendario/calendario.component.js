import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./calendario.topbanner.component";
import SearchPanel from "../search/search.calendario.component";
import CalendarioEventContainer from "../clinicalTools/calendarioevent.container";
import { getCalendarioInfo } from "../../actions/calendario";
import {replaceSVGIcons} from "../../utils/custom.jquery";
import $ from "jquery";

class CalendarioComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let pageNum = 1;
        this.props.getCalendarioInfo(pageNum).then(function() {
            replaceSVGIcons();
        });
    }

    render() {
        return (
            <div>
                <div className="page section-calendario">
                    <TopBannerImage />
                    <SearchPanel />
                    <CalendarioEventContainer />
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getCalendarioInfo
};

const mapStateToProps = (state) => {
    return {
        calendario: state.calendario,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(CalendarioComponent);