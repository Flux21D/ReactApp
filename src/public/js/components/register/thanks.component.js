import React from "react";
import {Link} from "react-router";

import {connect} from "react-redux";

class ThanksComponent extends React.Component {

  constructor (props) {
    super (props);
  }

  render () {

    // const {auth} = this.props;
    // const {user} = auth;
        
    return (
            <div id="congrats" className="sd-modal">
                <div className="sd-modal-content register-info-box">
                    <h3 className="title">Gracias por su registro</h3>

                    <p className="reg-confirmed">
                        Hemos enviado un correo electrónico de confirmación
                        <br />
                        Por favor revise su correo electrónico y haga clic en el enlace a
                        <br />
                        activa tu cuenta.
                    </p>
                </div>
            </div>
    );
  }

}

// function mapStateToProps (state) {

//   return {
//     auth: state.auth
//   };

// }

// const actionCreators = {

// };

//export default connect(mapStateToProps, actionCreators)(ThanksComponent);

export default connect(null)(ThanksComponent);