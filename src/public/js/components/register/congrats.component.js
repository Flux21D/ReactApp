import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

class Congrats extends React.Component {

  state = {
    success: null,
    title: "",
    description: ""
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      success: true,
      title: "Felicitaciones!",
      description: "Tu registro se ha confirmado y ahora tienes un perfil."
    });
  }

  render() {
    document.title = "Aula Diabetes - Registered successfully";
    return (
            <div id="congrats" className="sd-modal">
                <div className="sd-modal-content register-info-box">
                    {this.state.description ?
                        <div>
                            <h3 className="title">{this.state.title}</h3>

                            <p className="reg-confirmed">{this.state.description}</p>
                        </div> : null
                    }

                    <div>
                        <Link to="/" className="btn btn-orange btn-close">CLOSE</Link>
                    </div>
                </div>
            </div>
    );
  }

}


export default Congrats;