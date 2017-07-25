import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

class CourseTools extends React.Component {
  constructor(props) {
    super(props);

    this.setCourseScreen = this.setCourseScreen.bind(this);
  }

  setCourseScreen(screen) {
    this.props.setScreen(screen);
  }

  render() {
    const {courseType, courseInfo} = this.props;
    let credit = courseInfo.credits && courseInfo.credits.split(' ');

    return (
            <div className="col-tools" id="col-tools">
                {/* <!-- tools always visible --> */}
                <a className={'tool ' + (courseType === 'mixedCourse' ? 'active' : '')} title={'Curso ' + courseInfo.courseType} onClick={() => this.setCourseScreen('mixedCourse')}><span className="aw awcircle"><img className="svg svgR svg16" src="img/icons/laptop.svg" title="Icono"/><small>+</small></span><span className="text"> Curso {courseInfo.courseType}</span></a>
                
                {
                    courseInfo.credits ? 
                    <a className={'tool ' + (courseType === 'credits' ? 'active' : '')} title="Créditos"><span className="awcircle">{credit[0]}</span><span className="text"> Créditos</span></a>
                    : null
                }
                
                {/*<!-- tools for users in course --> */}
                {
                    (courseInfo.tutorEmailId && (courseInfo.isRegistered || this.props.isCourseRegistered)) ? 
                    <a className={'tool ' + (courseType === 'tutorial' ? 'active' : '')} title="Tutoría" onClick={() => this.setCourseScreen('tutorial')}><span className="aw awcircle"><img className="svg svgR svg16" src="img/icons/question.svg" title="Icono"/></span><span className="text"> Tutoría</span></a>
                    : null
                }

                {
                    (courseInfo.courseEvaluators.length > 0 && (courseInfo.isRegistered || this.props.isCourseRegistered)) ?
                    <a className={'tool ' + (courseType === 'evaluation' ? 'active' : '')} title="Realizar evaluación" onClick={() => this.setCourseScreen('evaluation')}><span className="aw awcircle"><img className="svg svgR svg18 " src="img/icons/pencil.svg" title="Icono"/></span><span className="text"> Realizar evaluación</span></a>
                    : null
                }

                {/*<!-- tools for teachers --> */}
                {
                    courseInfo.materialsUpload ? 
                    <a className={'tool ' + (courseType === 'material' ? 'active' : '')} title="Material del curso" onClick={() => this.setCourseScreen('material')}><span className="aw awcircle"><img className="svg svgR svg18 " src="img/icons/user-md.svg" title="Icono"/></span><span className="text"> Material del curso</span></a>
                    : null
                }
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(CourseTools);