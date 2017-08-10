import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import CursoModulo from "./curso.modulo";
import { getCursosModulo } from "../../../actions/cursos.details";
import {replaceSVGIcons} from "../../../utils/custom.jquery";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class MixedCourseDetails extends React.Component {
  constructor(props) {
    super(props);

    this.courseVisualizar = this.courseVisualizar.bind(this);
    this.toggelModule = this.toggelModule.bind(this);
  }

  state = {
    showModulo: false
  };

  componentDidMount() {
    replaceSVGIcons();
  }

  courseVisualizar(obj) {
    let that = this;
    let sysIds = obj.map(function(item) {
      return item.sys.id;
    });

    this.props.getCursosModulo(sysIds).then(function() {
      that.toggelModule();
      replaceSVGIcons();
    });
  };


  toggelModule() {
    this.setState({
      showModulo: !this.state.showModulo
    });
  };

  clickHandler(eve) {
    debugger;
    if(eve.target.tagName.toLowerCase() === 'a') {
      let isExternalLink = eve.target.getAttribute("class");
      if(!isExternalLink) {
        window.open(eve.target.getAttribute("href"), '_blank');     
      }
    }
    eve.preventDefault();
  }

  render() {
    const {courseInfo} = this.props;
    let that = this;
    let visualizarFunc = this.courseVisualizar;
    courseInfo.courseModules = courseInfo.courseModules.sort(function(a, b) {
      return a.fields.sequence - b.fields.sequence;
    });

    let courseModule = courseInfo.courseModules.map(function(item, i) {
      let moduleInfo = item.fields;
      return (
                <div className="modulo" key={i}>
                    {
                        moduleInfo.moduleDetailContent ?
                        <a title={'Módulo ' + moduleInfo.sequence} className="entrar" onClick={() => visualizarFunc(moduleInfo.moduleDetailContent)}><span className="cv"><span className="aw"><img className="svg svgW svg25" src="img/icons/file-text-o.svg" title="Icono"/></span>visualizar</span></a>
                        :
                        <a target="_blank" title={'Módulo ' + moduleInfo.sequence} className="entrar" href={moduleInfo.asset} download><span className="cv"><span className="aw"><img className="svg svgW svg25" src="img/icons/cloud-download.svg" title="Icono"/></span>descargar <br/><small>(PDF)</small></span></a>
                    }

                    <div className="num">{moduleInfo.sequence}</div>
                    
                    {
                        moduleInfo.moduleType.toLowerCase() === 'presencial' ? 
                        <div className="modalidad"><span className="aw"><img className="svg svgG6 svg16" src="img/icons/user-o.svg" title="Icono"/></span> <span> Presencial</span></div>
                        :
                        <div className="modalidad"><span className="aw"><img className="svg svgG6 svg16" src="img/icons/laptop.svg" title="Icono"/></span> <span> Online</span></div>
                    }

                    <div className="clear"></div>
                    <div className="img"><img src="img/curso/modulo-1.jpg" alt="Módulo 1" /></div>
                    <div className="title">{htmlToReactParser.parse(that.context.marked(moduleInfo.title ? moduleInfo.title : ''))}</div>
                </div>
      )
    });

    return (
            <div className="col-left">
                {/* <!-- sub page of the course --> */}
                {
                    !this.state.showModulo ? 
                    <div className="sub-page-modulos">

                        {/* <!-- intro --> */}
                        <div className="title-big nmt">Descripción del curso</div>
                        <div>{htmlToReactParser.parse(this.context.marked(courseInfo.courseDescription ? courseInfo.courseDescription : ''))}</div>
                        <div className="title-big">Módulos del curso</div>

                        {/* <!-- list of modules of the course --> */}
                        <div className="modulos">
                            {courseModule}
                            <div className="clear"></div>
                        </div>

                        {/* <!-- authors of the course --> */}
                        <div className="title-big nmt">Autores del curso</div>
                        {htmlToReactParser.parse(this.context.marked(courseInfo.authorDescription ? courseInfo.authorDescription : ''))}

                        {/* <!-- bibliography of the course --> */}
                        <div className="title-big" onClick={this.clickHandler}>{htmlToReactParser.parse(this.context.marked(courseInfo.downloadAttachment ? courseInfo.downloadAttachment : ''))}</div>

                        {/* <!-- disclaimer of the course --> */}
                        <div className="title-big">Renuncia</div>
                        <div>{htmlToReactParser.parse(this.context.marked(courseInfo.disclaimer ? courseInfo.disclaimer : ''))}</div>

                        {/* <!-- zinc code of the course --> */}
                        <div className="title-big">Código ZINC</div>
                        <div>{courseInfo.zincCode}</div>
                    </div>
                    : <CursoModulo showModulo={this.toggelModule}/>
                }
                
            </div>
    );
  }
}

MixedCourseDetails.contextTypes = {
  marked: React.PropTypes.func,
};

const actionCreators = {
  getCursosModulo
};

const mapStateToProps = (state) => {
  return {
    cursosDetails: state.cursosDetails,
    auth: state.auth
  };
};


export default connect(mapStateToProps, actionCreators)(MixedCourseDetails);