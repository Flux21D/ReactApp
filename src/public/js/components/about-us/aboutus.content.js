import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class AboutUsContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let bodyText = '';
    let leftImagePath = '';
    this.props.aboutus.bodyContentRight.map(function(item) {
      bodyText = bodyText + '<h2 className="title-big nmt">' + item.title + '</h2><p>' + item.someLongText + '</p>';
    });
    leftImagePath = this.props.aboutus.bodyContentLeft? this.props.aboutus.bodyContentLeft : ''
    const reactElement = htmlToReactParser.parse(this.context.marked(bodyText));
        
    return (
            <div className="cols" style={{backgroundImage: 'url(' + leftImagePath + ')'}}>
                <div className="col-left">
                    
                </div>
                <div className="col-right">
                    {reactElement}
                </div>
                <div className="clear"></div>
            </div>
    );
  }
}

AboutUsContent.contextTypes = {
  marked: React.PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    aboutus: state.aboutus,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(AboutUsContent);