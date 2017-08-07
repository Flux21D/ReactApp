import React from "react";

class WarningPopupModulo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
            <div className="modal-wrapper" id="modal-external">
              <div className="window cv">
                  <div className="close aw close_window"><img className="svg svgR  " src="img/icons/close.svg" title="Icono"/></div>
                  <div className="dgl-body">
                      <div className="title">Saliendo de Aula Diabetes</div>
                      <div className="intro">
                          El enlace sobre el que ha hecho clic le llevará a un sitio mantenido por un tercero, que es el único responsable de su contenido. Aula Diabetes no controla la influencia, ni aprueba este sitio y las opiniones, quejas o comentarios expresados en este sitio no deben atribuirse a Aula Diabetes. Aula Diabetes no es responsable de la política de privacidad de sitios web de terceros. Le animamos a leer las políticas de privacidad de cada sitio web que visite.
                          <br/>
                          <br/> Pulse Aceptar para ir a la otra página o Cancelar para volver a la página de Aula Diabetes.
                      </div>
                      <div className="links center">
                          <a className="button close_window" id="link-ok" target="_blank" onClick={this.openLink}>Aceptar</a>
                          <a href="#" className="button close_window">Cancelar</a>
                      </div>
                  </div>
              </div>
          </div>
    );
  }
}


export default WarningPopupModulo;