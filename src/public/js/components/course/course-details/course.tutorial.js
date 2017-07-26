import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { sendTutorialsMail } from "../../../actions/cursos.details";
import {replaceSVGIcons, closeModalWindow, submitTutorial, closeModalOnKeyPress} from "../../../utils/custom.jquery";

class CourseTutorial extends React.Component {
  constructor(props) {
    super(props);

    this.sendMail = this.sendMail.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }

  componentDidMount() {
    replaceSVGIcons();
    submitTutorial();
    closeModalWindow();
    closeModalOnKeyPress();
  }

  sendMail() {
    let userInfo = JSON.parse(sessionStorage.getItem('auth'));
    let fromail = userInfo.user.professionalContactData_emailAddress;
    let toMail = this.props.courseInfo.tutorEmailId;
    let msgSub = this.refs.txtSub.value;
    let msgBody = this.refs.txtBody.value;
    this.props.sendTutorialsMail(fromail, toMail, msgSub, msgBody);
    $('#modal-thanks').fadeIn();
  };

  clearFields() {
    this.refs.txtSub.value = '';
    this.refs.txtBody.value = '';
  }

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

                    <div className="modal-wrapper" id="modal-thanks">
                        <div className="window cv">
                            <div className="close aw close_window" onClick={this.clearFields}><img className="svg svgR  " src="img/icons/close.svg" title="Icono" /></div>
                            <div className="title">Gracias por la sumisión!</div>
                            <div className="links center">
                                <a title="Aceptar" className="button close_window" id="link-ok" target="_blank" onClick={this.clearFields}>Bueno</a>
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