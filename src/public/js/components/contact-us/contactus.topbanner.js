import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class TopBannerImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let bannerImage = '';
    if(this.props.contactus.bannerContent.topBanner)
      this.props.contactus.bannerContent.topBanner.map(function(item) {
        bannerImage = bannerImage + '<div className="section-header" style="background-image: url(' + item.imagePath + ')"><div className="content"><h1 className="size1">' + item.title + '</h1><p className="size3">' + (item.description ? item.description : '') + '</p></div></div>';
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
    contactus: state.contactus,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(TopBannerImage);