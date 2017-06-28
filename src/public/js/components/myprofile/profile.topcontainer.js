import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { getProfileCursosDetail } from "../../actions/cursos";
import {logout} from "../../actions/auth";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class TopProfileContainer extends React.Component {
    constructor(props) {
        super(props);

        this.courseDetails = this.courseDetails.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    courseDetails(eve) {
        let that = this;
        this.props.getProfileCursosDetail([eve.id]).then(function() {
            that.context.router.push({ 
            pathname: '/coursedetail',
            state: that.props.cursos.coursoDetailObj
          });
        });
    }

    handleLogout () {
    janrain.capture.ui.endCaptureSession();
        this.props.logout();
        this.context.router.push("/");
        window.location.reload();
    }

    render() {
        const {profile} = this.props;
        let courseDetailsFunc = this.courseDetails;
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        let userName = userInfo.user.personalData_firstName + ' ' + userInfo.user.personalData_lastName;

        let myCourses;
        if(profile.specialityCourses.length > 0)
            myCourses = profile.specialityCourses.map(function(item, i) {
                return (
                    <Link id={i} title={item.name} className="curso"  onClick={() => courseDetailsFunc(item)} key={i}>{item.name}</Link>
                )
            });
        else
            myCourses = [<p key='msg'>Todavía no has completado ningún curso</p>];

        let myCalender = '';
        let locale = "en-us";
        if(profile.userCalender.length > 0)
            profile.userCalender.map(function(item) {
                let objDate = new Date(item.start_date);
                let dateMonth = objDate.getDate() + ' ' + objDate.toLocaleString(locale, { month: "short"});

                myCalender = myCalender + '<div class="event"><div class="date">' + dateMonth + '</div><div class="title">' + item.name + '</div><div class="clear"></div></div>';
            });
        else
            myCalender = '<a href="/calendario" class="title">Calendario</a>';

        const myCalenderElement = htmlToReactParser.parse(myCalender);

        return (
            <div className="content">
                <div className="columns">
                    <div className="column col-3">
                        <div className="bloc bloc-datos">
                            <div className="title-big nmt">Mis datos</div>
                            <div className="info">
                                <div className="aw"><img className="svg svgG  " src="img/icons/user-circle-o.svg" title="Icono" /></div>
                                <div className="nombre"> {userName} <br /> <a title="Modificar" className="button tight" onClick={this.props.setEditProfile}>Modificar</a> <a title="Salir" className="button tight" onClick={this.handleLogout}>Salir</a></div>
                                <div className="clear"></div>
                            </div>
                        </div>
                    </div>
                    <div className="column col-3">
                        <div className="bloc bloc-cursos">
                            <div className="title-big nmt">Mis cursos</div>
                            {myCourses}
                        </div>
                    </div>
                    <div className="column col-3">
                        <div className="bloc bloc-calendario">
                            <div className="title-big nmt">Mi calendario</div>
                            {myCalenderElement}
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        );
    }

}

const actionCreators = {
    getProfileCursosDetail,
    logout
};

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        cursos: state.cursos,
        auth: state.auth
    };
};

TopProfileContainer.contextTypes = { 
  router: React.PropTypes.object.isRequired
}


export default connect(mapStateToProps, actionCreators)(TopProfileContainer);