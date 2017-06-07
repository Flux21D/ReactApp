import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class TopBannerSlider extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let bannerSlider = '';
        let pagination = '';
        const {aboutus} = this.props;
        if(aboutus.bannerContent.topBanner)
            aboutus.bannerContent.topBanner.map(function(item) {
                bannerSlider = bannerSlider + '<div className="slide" style="background-image: url(' + item.imagePath + ')"><div className="content cv"><div className="size2"><img src="img/ux/logo-lilly.png" alt="Lilly" /></div><h1 className="size1">' + item.title + '</h1><div className="size3">' + item.description +'</div></div></div>';
                pagination = pagination + '<div><img className="svg svgW " src="img/icons/circle.svg" title="Icono"/></div>';
            });
        const bannerElement = htmlToReactParser.parse(bannerSlider);
        const paginationElement = htmlToReactParser.parse(pagination);
        
        return (
            <div className="slider-header" id="slider-1">
                <div className="slides">
                    {bannerElement}
                </div>
                <div className="paginator aw">
                    {paginationElement}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        aboutus: state.aboutus,
        auth: state.auth
    };
};

export default connect(mapStateToProps)(TopBannerSlider);