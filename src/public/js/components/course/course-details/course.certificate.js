import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

class CourseCertificate extends React.Component {
    constructor(props) {
        super(props);
        this.userName = '';
    }

    componentDidMount() {
        jQuery('img.svg').each(function () {
                var $img = jQuery(this);
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');

                jQuery.get(imgURL, function (data) {
                    // Get the SVG tag, ignore the rest
                    var $svg = jQuery(data).find('svg');

                    // Add replaced image's ID to the new SVG
                    if (typeof imgID !== 'undefined') {
                        $svg = $svg.attr('id', imgID);
                    }
                    // Add replaced image's classes to the new SVG
                    if (typeof imgClass !== 'undefined') {
                        $svg = $svg.attr('class', imgClass + ' replaced-svg');
                    }

                    // Remove any invalid XML tags as per http://validator.w3.org
                    $svg = $svg.removeAttr('xmlns:a');

                    // Replace image with new SVG
                    $img.replaceWith($svg);

                }, 'xml');
            });
    }

    componentWillMount() {
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        this.userName = userInfo.user.personalData_firstName + ' ' + userInfo.user.personalData_lastName
    }

    render() {
        return (
            <section className="section-acreditacion">
                <div className="page section-acreditacion">
                    {/*<!-- user diploma -->*/}
                    <div className="diploma">
                        <div className="title">Diploma</div>
                        <div className="name">{this.userName}</div>
                        <div className="superado">Ha superado el curso</div>
                        <div className="curso">"{this.props.location.state.firstLine}"</div>
                        <div className="text">Realizado el dia 30/5/2017
                            <br/> Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus</div>
                        <div className="logos">
                            <span className="logo1">
                            <img src="img/ux/logo-lilly-red.png" alt="Lilly" />       
                        </span>
                            <span className="logo2">
                            <div className="firma">Firma del profesor</div>
                            <img src="img/ux/firma.png" alt="Firma" />
                        </span>
                        </div>
                        <div className="clear"></div>
                    </div>
                    <br/>
                    <br/>
                    <div className="tools center">
                        <Link title="Volver" to={{pathname: '/coursedetail', state: this.props.location.state}} className="button tight mt10"><span className="aw"><img className="svg svgW" src="img/icons/angle-left.svg" title="Icono"/></span> Volver</Link>
                        <a title="Descargar acreditación" className="button tight" href="#" download>
                            <div className="aw"><img className="svg svgW" src="img/icons/external-link-square.svg" title="Icono" /></div> Descargar acreditación</a>
                        <a title="Imprimir acreditación" className="button tight" href="javascript:window.print(); void 0;"><span className="aw"><img className="svg svgW" src="img/icons/mortar-board.svg" title="Icono"/></span> Imprimir acreditación</a>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(CourseCertificate);