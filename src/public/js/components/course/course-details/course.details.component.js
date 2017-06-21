import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./coursedetail.topbanner";
import MixedCourseDetails from "./mixed.course.details";
import CourseEvaluation from "./course.evaluation";
import CourseTutorial from "./course.tutorial";
import CourseTools from "./coursedetail.tools";
import CourseMaterial from "./course.material";
import { getCursosDetailsInfo } from "../../../actions/cursos.details";
import $ from "jquery";

class CourseDetailsComponent extends React.Component {
    
    state = {
        courseType: 'mixedCourse',
        isCourseRegistered: false
    };

    constructor(props) {
        super(props);

        this.setScreen = this.setScreen.bind(this);
        this.toggleCourseRegister = this.toggleCourseRegister.bind(this);
    }

    componentDidMount () {
        //this.props.getCursosDetailsInfo();
    }

    setScreen (screen) {
        this.setState({
            courseType: screen
        });
    }

    toggleCourseRegister() {
        this.setState({isCourseRegistered: true});
    }

    render() {
        const {cursosDetails, location} = this.props;
        return (
            <div>
                <div className="page section-curso">
                    <TopBannerImage toggleCourseRegister={this.toggleCourseRegister} bannerInfo={location.state}/>
                    <div className="content curso">
                        { this.state.courseType === 'mixedCourse' ? <MixedCourseDetails courseInfo={location.state}/> : null }
                        { this.state.courseType === 'tutorial' ? <CourseTutorial courseInfo={location.state}/> : null }
                        { this.state.courseType === 'evaluation' ? <CourseEvaluation courseInfo={location.state}/> : null }
                        { this.state.courseType === 'material' ? <CourseMaterial courseInfo={location.state}/> : null }
                        <CourseTools courseType={this.state.courseType} setScreen={this.setScreen} isCourseRegistered={this.state.isCourseRegistered} courseInfo={location.state}/>
                        <div className="clear"></div>
                    </div>
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getCursosDetailsInfo
};

const mapStateToProps = (state) => {
    return {
        cursosDetails: state.cursosDetails,
        auth: state.auth
    };
};


export default connect(mapStateToProps, actionCreators)(CourseDetailsComponent);