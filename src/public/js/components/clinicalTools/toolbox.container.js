import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import Pagination from "../shared/pagination/pagination.component";
import { getHerramientasInfo, setHerramientasFav } from "../../actions/herramientas";
import { replaceSVGIcons } from "../../utils/custom.jquery";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class ToolBoxContainer extends React.Component {
  constructor(props) {
    super(props);

    this.pageNumber = this.pageNumber.bind(this);
    this.favTools = this.favTools.bind(this);
  }

  state = {
    isFavouriteLocal: []
  };

  favTools(eve) {
    let userInfo = JSON.parse(sessionStorage.getItem('auth'));
    this.props.setHerramientasFav(userInfo.user.uuid, 'tool', eve.sysid, eve.externalUrl);
    this.state.isFavouriteLocal.push(eve.sysid);
    this.setState({isFavouriteLocal: this.state.isFavouriteLocal});
  };

  pageNumber(pageNo) {
    this.props.getHerramientasInfo(pageNo).then(function() {
      replaceSVGIcons();
    });
  };

  divClickHandler(url, eve) {
    window.open(url, '_blank');     
    eve.preventDefault();
  }

  render() {
    const {herramientas} = this.props;
    let that = this;
    let favToolsFunc = this.favTools;

    let toolsElement = herramientas.herramientasEvents.length > 0 && herramientas.herramientasEvents.map(function(item, i) {
      let favClass = (item.isFavourite || (that.state.isFavouriteLocal.indexOf(item.sysid) !== -1)) ? 'favHeherramientas' : '';
      return (
                <div className="event" key={i}>
                    {
                      item.isExternal ?
                      <div className="date-modalidad external_link" title={item.externalUrl}>
                          <div className="icon aw nmt"><img className="svg svgG" src="img/icons/external-link-square.svg" title="Icono" /></div>
                      </div>
                      :
                      <div onClick={that.divClickHandler.bind(that, item.externalUrl)} className="date-modalidad" title={item.externalUrl}>
                          <div className="icon aw nmt" ><img className="svg svgG" src="img/icons/external-link-square.svg" title="Icono" /></div>
                      </div>
                    }

                    <div className="txt">
                        <h3 className="title nmt">{item.title}</h3>
                        <p className="info">{item.description}</p>
                        <div className="buttons"><a title="Guardar" className={favClass} onClick={() => favToolsFunc(item)}><span className="aw"><img className="svg svgG6 " src="img/icons/heart-o.svg" title="Icono"/></span> Guardar</a></div>
                    </div>
                    <div className="clear"></div>
                </div>
      )
    });

    return (
            <div>
                <div className="results-search">
                    <div className="content">
                        <div className="events">
                            {toolsElement}
                        </div>
                        <div className="clear"></div>

                        <Pagination totalRecords={herramientas.totalRecords} pageNumber={this.pageNumber} activePageNo={herramientas.activePageNo} />
                    </div>
                </div>

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
                                <a className="button close_window" id="link-ok" target="_blank">Aceptar</a>
                                <a href="#" className="button close_window">Cancelar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
  }
}

const actionCreators = {
  getHerramientasInfo,
  setHerramientasFav
};

const mapStateToProps = (state) => {
  return {
    herramientas: state.herramientas,
    auth: state.auth
  };
};

export default connect(mapStateToProps, actionCreators)(ToolBoxContainer);