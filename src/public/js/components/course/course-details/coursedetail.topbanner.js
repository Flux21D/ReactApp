import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {setCursoRegister} from "../../../actions/cursos.details";
import {replaceSVGIcons, closeModalWindow} from "../../../utils/custom.jquery";

class TopBannerImage extends React.Component {
    constructor(props) {
        super(props);

        this.registerCourse = this.registerCourse.bind(this);
    }

    state = {
        isCourseRegistered: false
    };

    componentDidMount() {
        let that = this;
        //course-register ok window
        $('a.inscribirse').click(function () {
            if (confirm('¿Seguro que deseas inscribirte a este curso?')) {
                that.registerCourse();
                $('#modal-ok').fadeIn();
            }
        });
        closeModalWindow();
        replaceSVGIcons();
    }

    registerCourse() {
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        let dateNow = new Date();
        this.props.bannerInfo.isRegistered = true;
        this.setState({isCourseRegistered: true});
        this.props.toggleCourseRegister();
        this.props.setCursoRegister(userInfo.user.uuid, dateNow, this.props.bannerInfo.sysid).then(function() {
            replaceSVGIcons();
        });
    }

    render() {
        const {bannerInfo} = this.props;
        let url = 'url(' + bannerInfo.couserMainBannerImage + ')';
        let startDate = new Date(bannerInfo.startDate).toLocaleDateString();
        let endDate = new Date(bannerInfo.endDate).toLocaleDateString();

        return (
                <div className="section-header" style={{backgroundImage: url}}>
                    <div className="content">
                        <h1 className="size1">{bannerInfo.courseTitle}</h1>
                        <p className="size3">{bannerInfo.courseOnBannerDescription}</p>
                        <div className="tools">
                            <div className="grey"><span className="aw"><img className="svg svgW svg16" src="img/icons/laptop.svg" title="Icono"/><small>+</small></span> {bannerInfo.courseType}</div>
                            {
                                bannerInfo.credits ?
                                <div className="grey">{bannerInfo.credits}</div>
                                : null
                            }

                            {
                                (bannerInfo.startDate && bannerInfo.endDate) ? 
                                <div className="grey">Del {startDate} al {endDate}</div>
                                : null
                            }

                            {
                                (bannerInfo.isRegistered || this.state.isCourseRegistered) ? 
                                <div className="grey"><span className="aw"><img className="svg svgW svg16" src="img/icons/check-circle.svg" title="Icono"/></span> Inscrito <span className="hidden-mobile">al curso</span></div>
                                : <a title="Inscribirse" className="red inscribirse">Inscribirse <span className="hidden-mobile">al curso</span></a>
                            }
                        </div>
                        <Link title="Volver a cursos" to="/cursos" className="button tight mt10"><span className="aw"><img className="svg svgW" src="img/icons/angle-left.svg" title="Icono"/></span> Volver a cursos</Link>
                    </div>
                    {/* <!-- thanks modal window --> */}
                    <div className="modal-wrapper" id="modal-ok">
                        <div className="window cv">
                            <div className="close aw close_window"><img className="svg svgR  " src="img/icons/close.svg" title="Icono"/></div>
                            <div className="title">¡Felicidades!</div>
                            <div className="intro center">Te has inscrito correctamente al curso <strong>"Etiam purus tortor, vehicula nec turpis vel, dictum scelerisque leo"</strong>. Te hemos enviado un email con los datos de tu inscripción.</div>
                        </div>
                    </div> 
                </div>
        );
    }

}

const actionCreators = {
    setCursoRegister
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(TopBannerImage);