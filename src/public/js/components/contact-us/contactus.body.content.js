import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import marked from "marked";
import { openHerramientasPopup, closeHerramientasPopup } from "../../utils/custom.jquery";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class ContactBodyContent extends React.Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  componentWillMount() {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });
  }

  componentDidUpdate(){
    openHerramientasPopup();
    closeHerramientasPopup();
  }

  clickHandler(eve) {
    if(eve.target.tagName.toLowerCase() === 'a') {
      let isExternalLink = eve.target.getAttribute("class");
      if(!isExternalLink) {
        window.open(eve.target.getAttribute("href"), '_blank');     
      }
    }
    eve.preventDefault();
  }

  render() {
    var contentLeft = '';
    var contentRight = '';
    this.props.contactus.bodyContentLeft.map(function(item) {
      contentLeft = contentLeft + '<h2 className="title-big nmt">' + item.someShortText + '</h2><p>' + item.someLongText+ '</p>';
    });
    this.props.contactus.bodyContentRight.map(function(item) {
      contentRight = contentRight + '<h2 className="title-big nmt">' + item.someShortText + '</h2><p>' + marked(item.someLongText) + '</p>';
    });
        
    const leftElement = htmlToReactParser.parse(contentLeft);
    const rightElement = htmlToReactParser.parse(contentRight);

    return (
            <div className="cols">
                <div className="col-left">
                    <div className="half-content">
                        {leftElement}
                        <p className="al-right"><a title="Realizar consulta" className="button" href="mailto:ejemplo@ejemplo.com"><span className="aw"><img className="svg svgW  " src="img/icons/envelope.svg" title="Icono"/></span> Realizar consulta</a></p>
                    </div>
                </div>
                <div className="col-right" onClick={this.clickHandler}>
                    <div className="half-content">
                        {rightElement}
                    </div>
                </div>
                <div className="clear"></div>

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
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contactus: state.contactus,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(ContactBodyContent);