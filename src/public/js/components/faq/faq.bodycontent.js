import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class FaqBodyContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var faqContent = '';
    var count = Math.round(this.props.faq.questions.length/2);
    this.props.faq.questions.map(function(item, index) {
      if(index === 0) 
        faqContent = '<div className="col-left">';
      if(index === count)
        faqContent = faqContent + '</div><div className="col-right">';
      if(index < count) 
        faqContent = faqContent + '<div className="qa"><p className="q"><span className="number">' + item.sequence + '.' + '</span>' + item.question + '</p><p className="a">' + item.answer + '</p></div>';
      else 
                faqContent = faqContent + '<div className="qa"><p className="q"><span className="number">' + item.sequence + '.' + '</span>' + item.question + '</p><p className="a">' + item.answer + '</p></div>';
    });
    faqContent = faqContent + '</div>';
    const reactElement = htmlToReactParser.parse(faqContent);

    return (
            <div className="content">
                <div className="cols">
                    {reactElement}
                    <div className="clear"></div>
                </div>
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

export default connect(mapStateToProps)(FaqBodyContent);