import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class FaqFooterImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let footerImage = '', imageButton = '';
        if(this.props.faq.bannerContent.footerBanner)
            this.props.faq.bannerContent.footerBanner.map(function(item) {                
                if(item.buttonLinks)
                    item.buttonLinks.forEach(function(butn) {
                        imageButton = imageButton + '<a title="' + butn.hyperlinkText + '" href="' + butn.hyperlinkUrl + '" className="button">' + butn.hyperlinkText + '</a>';
                    });
                footerImage = '<div className="contact" style="background-image: url(' + item.imagePath +')"><div className="content"><p className="txt">' + item.description + '</p><br/>'+ imageButton +'</div></div>';
            });

        const reactElement = htmlToReactParser.parse(footerImage);
        
        return (
            <div>
                {reactElement}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        faq: state.faq,
        auth: state.auth
    };
};

export default connect(mapStateToProps)(FaqFooterImage); 