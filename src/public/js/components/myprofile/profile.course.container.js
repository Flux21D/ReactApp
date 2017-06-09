import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class ProfileCourseContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {profile} = this.props;
        let completedCourse = '';
        if(profile.completedCourse.length > 0)
            profile.completedCourse.map(function(item) {
                let showApprovedBox = '<div class="info tight">' + (item.status === 'pass' ? ('Aprobado <strong>'+ item.score +'%</strong>') : '<strong>NO</strong> Aprobado') + '</div>';
                let showCredits = (item.credits > 0 && item.status === 'pass') ? ('<div class="info tight"><strong>' + item.credits + '</strong> Créditos</div>') : '';
                let showCertificate = item.status === 'pass' ? ('<a title="Descargar acreditación" class="button tight" href="/acreditacion"><span class="aw"><img class="svg svgW" src="img/icons/mortar-board.svg" title="Icono"/></span> Descargar acreditación</a>') : '';
                
                completedCourse = completedCourse + '<div class="curso"><div class="text"><div class="title">' + item.name + '</div><div class="tools">' + showApprovedBox + showCredits + showCertificate + '</div></div><div class="clear"></div></div>';
            });
        const completedCourseElement = htmlToReactParser.parse(completedCourse);

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
                    {
                        completedCourseElement ? 
                        <div>
                            <div className="title-big nmt">Cursos realizados</div>
                            {completedCourseElement}
                        </div>
                        : null
                    }

                    {
                        enrolledCourseElement ?
                        <div>
                            <div className="title-big">Cursos en curso o inscritos pendientes de realización</div>
                            {enrolledCourseElement}
                        </div>
                        : null
                    }

                    {
                        favCourseElement ? 
                        <div>
                            <div className="title-big">Cursos favoritos</div>
                            {favCourseElement}
                        </div>
                        : null
                    }
                    
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

export default connect(mapStateToProps)(ProfileCourseContainer);