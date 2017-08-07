import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { openHerramientasPopup, closeHerramientasPopup } from "../../../utils/custom.jquery";
import WarningPopupModulo from "../../shared/warning-popup"

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class CursoModulo extends React.Component {
  constructor(props) {
    super(props);

    this.showModule = this.showModule.bind(this);
  }

  componentDidMount() {
    openHerramientasPopup();
    closeHerramientasPopup();
  }

  showModule() {
    this.props.showModulo();
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
    const {cursosDetails} = this.props;
    let moduleHeading = '', moduleTitle = '', para1 = '', para2 = '', imagePath = '';
        
    cursosDetails.coursoModulo.map(function(item) {
      if(item.identifier === 'Content-text-only') {
        moduleHeading = item.title;
        moduleTitle = item.someShortText;
        para1 = item.someLongText;
      }
      else if(item.identifier === 'Content-text-image') {
        para2 = item.someLongText;
        imagePath = item.image;
      }
    });
    const para1Element = htmlToReactParser.parse(this.context.marked(para1));
    const para2Element = htmlToReactParser.parse(this.context.marked(para2));

    return (
            <div className="sub-page-modulo">

                {/* <!-- intro --> */}
                <h2 className="title-big nmt nmb"><strong>{moduleHeading}</strong></h2>
                <div className="font-big">{moduleTitle}</div>

                {/* <!-- module html content --> */}
                <div className="html" onClick={this.clickHandler}>
                    <p>{para1Element}</p>
                    <div className="img">
                        <div className="caption">Et harum quidem rerum facilis</div>
                        <img src={imagePath} alt="Imagen" />
                    </div>
                    <p>{para2Element}</p>
                </div>

                <div className="back">
                    <a title="Volver" className="button" onClick={this.showModule}><span className="aw"><img className="svg svgW" src="img/icons/angle-left.svg" title="Icono"/></span> Volver</a>
                </div>
                <WarningPopupModulo />
            </div>
    );
  }
}

CursoModulo.contextTypes = {
  marked: React.PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    cursosDetails: state.cursosDetails,
    auth: state.auth
  };
};


export default connect(mapStateToProps)(CursoModulo);