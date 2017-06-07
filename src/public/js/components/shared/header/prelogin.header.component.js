import React from 'react';
import {Link} from "react-router";
import $ from "jquery";

class PreLoginHeader extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <section className="section-home">
                <header>
                    <div className="content">
                        {/* site logo and responsive menu toggler */}
                        <div className="left-col">
                            <span className="aw" id="responsive-menu-toggler"><img className="svg svgW svg18  " src="img/icons/bars.svg" title="Icono"/></span>
                            <a href="home-logged.html" href="home-logged.html"><img src="img/ux/logo-aula-diabetes.png" alt="Aula Diabetes" /></a>
                        </div>

                        {/* desktop menu */}
                        <div className="center-col">
                        </div>

                        {/* Lilly logo */}
                        <div className="right-col">
                            <a title="Lilly" href="http://www.lilly.es" target="_blank"><img src="img/ux/logo-lilly.png" alt="Lilly" /></a>
                        </div>
                        <div className="clear"></div>
                    </div>
                </header>
            </section>
        );
    }
}

PreLoginHeader.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default PreLoginHeader;