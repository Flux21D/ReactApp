import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

class WebmapContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="content html-text padding-sides-responsive">
                <ul>
                    <li><Link title="Home" to="/home">Home</Link>        
                        <ul>
                            <li><Link title="Cursos" to="/cursos">Cursos</Link></li>
                            <li><Link title="Calendario" to="/calendario">Calendario</Link></li>
                            <li><Link title="Herramientas" to="/herramientas">Herramientas</Link></li>
                            <li>Ayuda
                                <ul>
                                    <li><Link title="Preguntas frecuentes" to="/faq">Preguntas frecuentes</Link></li>
                                    <li><Link title="Contactar" to="/contact">Contactar</Link></li>
                                </ul>
                            </li>
                            <li><a title="Términos y condiciones de uso" href="https://pages.mc.lilly.com/page.aspx?QS=472529ec60bdf32a0b05d7aed00dc392aad7b41b0f5a85bccd5b72cc006e0ded" target="_blank">Términos y condiciones de uso</a></li>
                            <li><a title="Política de privacidad de datos" href="https://pages.mc.lilly.com/page.aspx?QS=472529ec60bdf32a6b7c20d354e562edbb0aaee1b1b2bd088d2337a7429c1be1" target="_blank">Política de privacidad de datos</a></li>
                            <li><a title="Política de cookies" href="https://pages.mc.lilly.com/page.aspx?QS=472529ec60bdf32a93981243b38aec88fd2b25d88a5743cb6a319f6361880642" target="_blank">Política de cookies</a></li>
                            <li><Link title="Quienes somos" to="/about">Quienes somos</Link></li>
                        </ul>
                    </li>
                </ul>
                
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        calendario: state.calendario,
        auth: state.auth
    };
};

export default connect(mapStateToProps)(WebmapContainer);