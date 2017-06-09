import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { sendTutorialsMail } from "../../../actions/cursos.details";

class CourseTutorial extends React.Component {
    constructor(props) {
        super(props);

        this.sendMail = this.sendMail.bind(this);
    }

    componentDidMount() {
        //svg icons
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

        //submit tutoria
        $('#submit-tutoria').click(function () {
            if(!$('#field1').val() || !$('#field2').val()) {
                $('#modal-external').fadeIn();
                return false;
            }
        });

        $('.close_window').click(function () {
            $('.modal-wrapper').fadeOut();
            $('body').removeClass('modal-on');
        });

        $(document).keyup(function (e) {
            if (e.keyCode === 27)
                $('.modal-wrapper').fadeOut();
        });
    }

    sendMail() {
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        let fromail = userInfo.user.professionalContactData_emailAddress;
        let toMail = this.props.courseInfo.tutorEmailId;
        let msgSub = this.refs.txtSub.value;
        let msgBody = this.refs.txtBody.value;
        this.props.sendTutorialsMail(fromail, toMail, msgSub, msgBody);
    };

    render() {
        const {courseInfo} = this.props;

        return (
            <div className="col-left">
                <div className="sub-page-tutoria">

                    <h2 className="title-big nmt"><strong>{courseInfo.tutorTitle}</strong></h2>
                    <p className="section-intro">{courseInfo.tutorDescription}</p>

                    <div className="std-form form">
                        <form>
                            <input id="field1" className="text" type="text" placeholder="Asunto" name="asunto" ref="txtSub"/>
                            <textarea id="field2" className="text" placeholder="Mensaje" name="mensaje" rows="10" cols="50" ref="txtBody"></textarea>
                            <input className="submit" type="button" value="Enviar" id="submit-tutoria" onClick={this.sendMail}/>
                        </form>
                    </div>

                    <div className="modal-wrapper" id="modal-external">
                        <div className="window cv">
                            <div className="close aw close_window"><img className="svg svgR  " src="img/icons/close.svg" title="Icono" /></div>
                            <div className="title">Por favor, rellene todos los campos</div>
                            <div className="links center">
                                <a title="Aceptar" className="button close_window" id="link-ok" target="_blank">Aceptar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const actionCreators = {
    sendTutorialsMail
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};


export default connect(mapStateToProps, actionCreators)(CourseTutorial);