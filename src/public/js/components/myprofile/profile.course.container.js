import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class ProfileCourseContainer extends React.Component {
    constructor(props) {
        super(props);

        this.downloadCertificate = this.downloadCertificate.bind(this);
    }

    downloadCertificate(eve) {
        eve.sourcePath = 'acreditacion';
        this.context.router.push({ 
            pathname: '/acreditacion',
            state: eve
        });
    }

    render() {
        const {profile} = this.props;
        let downloadCertiFunc = this.downloadCertificate;

        let completedCourseElement = profile.completedCourse.length > 0 && profile.completedCourse.map(function(item, i) {
            return (
                <div className="curso" key={i}>
                    <div className="text">
                        <div className="title">{item.name}</div>
                        <div className="tools">
                        {
                            item.status === 'pass' ? 
                            <div className="info tight">
                                Aprobado <strong>{item.score}%</strong> 
                            </div>
                            :
                            <div className="info tight">
                                <strong>NO</strong> Aprobado
                            </div>
                        }

                        {
                            (item.credits > 0 && item.status === 'pass') ? 
                            <div className="info tight"><strong>{item.credits}</strong> Créditos</div>
                            : null
                        }

                        {
                            item.status === 'pass' ? 
                            <a title="Descargar acreditación" className="button tight" onClick={() => downloadCertiFunc(item)}><span className="aw"><img className="svg svgW" src="img/icons/mortar-board.svg" title="Icono"/></span> Descargar acreditación</a>
                            : null
                        }
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
            )
        });

        let enrolledCourse = '';
        if(profile.ongoingEnrolled.length > 0)
            profile.ongoingEnrolled.map(function(item) {
                enrolledCourse = enrolledCourse + '<div class="curso"><div class="text"><div class="title w100">' + item.name + '</div></div><div class="clear"></div></div>';
            });
        const enrolledCourseElement = htmlToReactParser.parse(enrolledCourse);

        let favouriteCourse = '';
        if(profile.favCourse.length > 0)
            profile.favCourse.map(function(item) {
                favouriteCourse = favouriteCourse + '<div class="curso"><div class="text"><div class="title w100">' + item.name + '</div></div><div class="clear"></div></div>';
            });
        const favCourseElement = htmlToReactParser.parse(favouriteCourse);
        
        return (
            <div className="mis-cursos">
                <div className="content"> 
                    <div>
                        <div className="title-big nmt">Cursos realizados</div>
                        {
                            completedCourseElement ? <div>{completedCourseElement}</div> : <p>Todavía no has completado ningún curso</p>
                        }
                    </div>

                    <div>
                        <div className="title-big">Cursos en curso o inscritos pendientes de realización</div>
                        {
                            enrolledCourseElement ? <div>{enrolledCourseElement}</div> : <p>No se ha inscrito en ningún curso</p>
                        }
                    </div>

                    <div>
                        <div className="title-big">Cursos favoritos</div>
                        {
                            favCourseElement ? <div>{favCourseElement}</div> : <p>No has guardado ningún curso</p>
                        }
                    </div>
                    
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        auth: state.auth
    };
};

ProfileCourseContainer.contextTypes = { 
  router: React.PropTypes.object.isRequired
} 


export default connect(mapStateToProps)(ProfileCourseContainer);