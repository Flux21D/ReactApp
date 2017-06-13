import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

class FaqFooterImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {faq} = this.props;

        let footerImage = faq.bannerContent.footerBanner && faq.bannerContent.footerBanner.map(function(item, i) {                
                let url = 'url(' + item.imagePath + ')';
                let imageButton = item.buttonLinks && item.buttonLinks.map(function(btn, i) {
                    return (
                        <Link title={btn.hyperlinkText} to={btn.hyperlinkUrl} className="button" key={i}>{btn.hyperlinkText}</Link>
                    )
                });

                return (
                    <div className="contact" style={{backgroundImage: url}} key={i}>
                        <div className="content">
                            <p className="txt">{item.description}</p><br/>
                            {imageButton}
                        </div>
                    </div>
                )
            });
        
        return (
            <div>
                {footerImage}
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