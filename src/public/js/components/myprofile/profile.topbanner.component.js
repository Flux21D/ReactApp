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
    const {profile} = this.props;
    let bannerImage = '';
    if(profile.bannerContent.topBanner)
      profile.bannerContent.topBanner.map(function(item) {
        bannerImage = bannerImage + '<div className="section-header" style="background-image: url(' + item.imagePath + ')"><div className="content"><h1 className="size1">' + item.title + '</h1><div className="size3">' + item.description + '</div></div></div>';
      });
    const reactElement = htmlToReactParser.parse(bannerImage);

    return (
            <div className="section-header" style={{backgroundImage: 'url(img/backgrounds/perfil.jpg)'}}>
                <div className="content">
                    <h1 className="size1">Mi perfil</h1>
                    <div className="size3">Aquí encontrarás tus datos personales y todos los cursos, eventos y herramientas que
has marcado como favoritos.
</div>
                </div>
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(TopBannerImage);