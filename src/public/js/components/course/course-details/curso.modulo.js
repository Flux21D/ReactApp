import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class CursoModulo extends React.Component {
  constructor(props) {
    super(props);

    this.showModule = this.showModule.bind(this);
  }

  componentDidMount() {
        
  }

  showModule() {
    this.props.showModulo();
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
    const para1Element = htmlToReactParser.parse(para1);
    const para2Element = htmlToReactParser.parse(para2);

    return (
            <div className="sub-page-modulo">

                {/* <!-- intro --> */}
                <h2 className="title-big nmt nmb"><strong>{moduleHeading}</strong></h2>
                <div className="font-big">{moduleTitle}</div>

                {/* <!-- module html content --> */}
                <div className="html">
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
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cursosDetails: state.cursosDetails,
    auth: state.auth
  };
};


export default connect(mapStateToProps)(CursoModulo);