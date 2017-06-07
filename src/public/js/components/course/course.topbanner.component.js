import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { getProfileCursosDetail } from "../../actions/cursos";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class TopBannerSlider extends React.Component {
    constructor(props) {
        super(props);

        this.courseDetails = this.courseDetails.bind(this);
    }

    courseDetails(eve) {
        let that = this;
        this.props.getProfileCursosDetail([eve.buttonLinks[0].courseId]).then(function() {
            that.context.router.push({ 
            pathname: '/coursedetail',
            state: that.props.cursos.coursoDetailObj
          });
        });
    }

    render() {
        const {cursos} = this.props;
        let courseDetailsFunc = this.courseDetails;

        let bannerSlider = cursos.bannerContent.topBanner && cursos.bannerContent.topBanner.map(function(item, i) {
                    let url = 'url(' + item.imagePath + ')';
                    return (
                        <div className="slide" style={{backgroundImage: url}} key={i}>
                            <div className="content cv">
                                <div className="size3">{item.title}</div>
                                <h2 className="size1">{item.subTitle}</h2>
                                <div className="size3">{item.description}</div>
                                {
                                    item.buttonLinks ? 
                                    <div className="button-div"><Link title="Acceder al curso" className="button" onClick={() => courseDetailsFunc(item)}>Acceder al curso</Link></div>
                                    : null
                                }
                            </div>
                        </div>
                    )
                });

        let pagination = cursos.bannerContent.topBanner && cursos.bannerContent.topBanner.map(function(item, i) {
                    return (
                        <div key={i}><img className="svg svgW " src="img/icons/circle.svg" title="Icono"/></div>
                    )
                });

        return (
            <div className="slider-header" id="slider-1">
                <div className="slides">
                    {bannerSlider}
                </div>
                <div className="paginator aw">
                    {pagination}
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getProfileCursosDetail
};

const mapStateToProps = (state) => {
    return {
        cursos: state.cursos,
        auth: state.auth
    };
};

TopBannerSlider.contextTypes = { 
  router: React.PropTypes.object.isRequired
}


export default connect(mapStateToProps, actionCreators)(TopBannerSlider);