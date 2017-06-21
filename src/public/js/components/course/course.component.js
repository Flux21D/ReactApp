import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerSlider from "./course.topbanner.component";
import SearchPanel from "../search/search.home.component";
import CourseEventContainer from "./courseevent.container";
import { getCursosInfo } from "../../actions/cursos";
import {replaceSVGIcons, playCarousel, stopCarousel} from "../../utils/custom.jquery";
import $ from "jquery";

class CourseComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        let pageNum = 1;
        this.props.getCursosInfo(pageNum, this.props.location.state).then(function() {
            replaceSVGIcons();
            playCarousel();
        });
    }

    componentWillUnmount () {
        stopCarousel();
    }

    render() {
        return (
            <div>
                <div className="page section-cursos">
                    <TopBannerSlider />
                    <SearchPanel component='course' locState={this.props.location.state} searchPanel={this.props.cursos.searchPanel}/>
                    <CourseEventContainer />
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getCursosInfo
};

const mapStateToProps = (state) => {
    return {
        cursos: state.cursos,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(CourseComponent);