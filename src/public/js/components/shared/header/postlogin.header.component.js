import React from 'react';
import {Link} from "react-router";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import $ from "jquery";
import ProfileNotification from "../../myprofile/profile.notification";
import { postLoginFunctionality } from "../../../utils/custom.jquery";

class PostLoginHeader extends React.Component {

    constructor (props) {
        super(props);
    }

    componentDidMount()
    {
        postLoginFunctionality();
    }

    render () {
        const {location} = this.props;
        return ( 
            <section className="section-home-logged">
                <header>
                    {/* link to user profile */}
                    <ProfileNotification />

                    <div className="content">
                        {/* site logo and responsive menu toggler */}
                        <div className="left-col">
                            <span className="aw" id="responsive-menu-toggler"><img className="svg svgW svg18  " src="img/icons/bars.svg" title="Icono"/></span>
                            <Link to="/home"><img src="img/ux/logo-aula-diabetes.png" alt="Aula Diabetes" /></Link>
                        </div>

                        {/* desktop menu */}
                        <div className="center-col">
                            <ul className="sub sub-ayuda" id="sub-ayuda">
                                <li><Link title="Preguntas frecuentes" to="/faq">Preguntas frecuentes</Link></li>
                                <li><Link title="Contactar" to="/contact">Contactar</Link></li>
                            </ul>
                            <ul className="main-menu">
                                <li><Link title="Home" to="/home" className={location.pathname === '/home' || location.pathname === '/' ? 'active' : ''}>Home</Link></li>
                                <li><Link title="Cursos" to="/cursos" className={location.pathname === '/cursos' ? 'active' : ''}>Cursos</Link></li>
                                <li><Link title="Calendario" to="/calendario" className={location.pathname === '/calendario' ? 'active' : ''}>Calendario</Link></li>
                                <li><Link title="Herramientas" to="/herramientas" className={location.pathname === '/herramientas' ? 'active' : ''}>Herramientas</Link></li>
                                <li><Link title="Ayuda" id="show-sub-ayuda" className={location.pathname === '/faq' || location.pathname === '/contact' ? 'active' : ''}>Ayuda</Link></li>
                            </ul>
                        </div>

                        {/* Lilly logo */}
                        <div className="right-col">
                            <a title="Lilly" href="http://www.lilly.es" target="_blank"><img src="img/ux/logo-lilly.png" alt="Lilly" /></a>
                        </div>
                        <div className="clear"></div>
                    </div>

                    {/* responsive submenu */}
                    <ul className="submenu-responsive">
                        <li className="close">
                            <div className="close"><span className="aw responsive-menu-toggler"><img className="svg svgW svg18  " src="img/icons/close.svg" title="Icono"/></span></div>
                        </li>
                        <li className="top">
                            <div className="top"><img src="img/ux/logo-aula-diabetes.png" alt="Aula Diabetes" /></div>
                        </li>
                        <li className="home"><Link title="Home" to="/home" className={'home' + (location.pathname === '/home' || location.pathname === '/' ? 'active' : '')}>Home</Link></li>
                        <li><Link title="Cursos" to="/cursos" className={location.pathname === '/cursos' ? 'active' : ''}>Cursos</Link></li>
                        <li><Link title="Calendario" to="/calendario" className={location.pathname === '/calendario' ? 'active' : ''}>Calendario</Link></li>
                        <li><Link title="Herramientas" to="/herramientas" className={location.pathname === '/herramientas' ? 'active' : ''}>Herramientas</Link></li>
                        <li><Link title="Preguntas frecuentes" to="/faq" className={location.pathname === '/faq' ? 'active' : ''}>Preguntas frecuentes</Link></li>
                        <li><Link title="Contactar" to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contactar</Link></li>
                        <li className="bottom">
                            <div className="bottom"><img src="img/ux/logo-lilly.png" alt="Lilly" /></div>
                        </li>
                    </ul>
                    <div className="back-submenu-responsive"></div>
                </header>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
};

export default withRouter(connect(mapStateToProps)(PostLoginHeader));