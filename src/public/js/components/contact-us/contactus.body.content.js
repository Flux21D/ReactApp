import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import marked from "marked";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class ContactBodyContent extends React.Component {
    constructor(props) {
        super(props);

        this.clickHandler = this.clickHandler.bind(this);
    }

    componentDidMount() {
        marked.setOptions({
          renderer: new marked.Renderer(),
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          smartypants: false
        });
    }

    clickHandler(eve) {
        if(eve.target.tagName.toLowerCase() === 'a') {
            window.open(eve.target.getAttribute("href"), '_blank');
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