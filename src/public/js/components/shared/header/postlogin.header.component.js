import React from 'react';
import {Link} from "react-router";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import $ from "jquery";
import ProfileNotification from "../../myprofile/profile.notification";

class PostLoginHeader extends React.Component {

    constructor (props) {
        super(props);
    }

    componentDidMount()
    {
        //submenu
        $('#show-sub-ayuda').click(function() {
            $('#sub-ayuda').fadeToggle();
            return false;
        });

        //hide sub-menu on outside click
        $(document).mouseup(function (e) {
            var container = $('div.select-values, #sub-ayuda');

            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.hide();
            }
        });

        //responsive-menu
        $('#responsive-menu-toggler, .responsive-menu-toggler, div.back-submenu-responsive').click(function () {
            $('ul.submenu-responsive').toggleClass('on');
            $('div.back-submenu-responsive').fadeToggle();
            if($('.submenu-responsive').hasClass('on'))
            {
                $('.input.zindex3, .input.zindex4, .input.zindex5').css('z-index','1');
            }
            else
            {
                $('.input.zindex3').css('z-index','3');
                $('.input.zindex4').css('z-index','4');
                $('.input.zindex5').css('z-index','5');
            }
            $('body').toggleClass('disable-scroll');
        });

        //menu selection
        var selector1 = '.main-menu a';
        $(selector1).on('click', function() {            
            if(!$(this).parent().is(':last-child'))
            {
                $(selector1).removeClass('active');
                $(this).addClass('active');
            }
            
        });

        //responsive-menu selection
        var selector = '.submenu-responsive a';
        $(selector).on('click', function() {
            $(selector).removeClass('active');
            $(this).addClass('active');
            $('ul.submenu-responsive').toggleClass('on');
            $('div.back-submenu-responsive').fadeToggle();
            $('body').removeClass('disable-scroll');
        });

        $('.sub-ayuda a').click(function(){
            $('#sub-ayuda').fadeToggle();
            $(selector1).removeClass('active');
            $('#show-sub-ayuda').toggleClass('active');
        });
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