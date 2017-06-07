import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class ToolsTopBannerImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {herramientas} = this.props;
        let bannerImage = '';
        if(herramientas.bannerContent.topBanner)
            herramientas.bannerContent.topBanner.map(function(item) {
                bannerImage = bannerImage + '<div class="section-header" style="background-image: url(' + item.imagePath + ')"><div class="content"><h1 class="size1">' + item.title + '</h1><p class="size3">' + item.description + '</p></div></div>';
            });
        const reactElement = htmlToReactParser.parse(bannerImage);

        return (
            <div>
                {reactElement}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        herramientas: state.herramientas,
        auth: state.auth
    };
};

export default connect(mapStateToProps)(ToolsTopBannerImage);