import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

class ThanksComponent extends React.Component {

  constructor (props) {
    super (props);
  }

  
  render () {
    document.title = 'Aula Diabetes - Verify Email';
    return (
            <div id="congrats" className="sd-modal">
                <div className="sd-modal-content register-info-box">
                    <h3 className="title">Gracias por su registro</h3>

                    <p className="reg-confirmed">
                        Hemos enviado un correo electr�nico de confirmaci�n
                        <br />
                        Por favor revise su correo electr�nico y haga clic en el enlace a
                        <br />
                        activa tu cuenta.
                    </p>
                </div>
            </div>
    );
  }

}

export default connect(null)(ThanksComponent);