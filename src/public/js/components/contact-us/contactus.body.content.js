import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class ContactBodyContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var contentLeft = '';
        var contentRight = '';
        this.props.contactus.bodyContentLeft.map(function(item) {
            contentLeft = contentLeft + '<h2 className="title-big nmt">' + item.someShortText + '</h2><p>' + item.someLongText+ '</p>';
        });
        this.props.contactus.bodyContentRight.map(function(item) {
            contentRight = contentRight + '<h2 className="title-big nmt">' + item.someShortText + '</h2><p>' + item.someLongText + '</p>';
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
                <div className="col-right">
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