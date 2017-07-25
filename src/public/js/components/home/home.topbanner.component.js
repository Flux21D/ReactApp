import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { getProfileCursosDetail } from "../../actions/cursos";
import { stopSliderCarousel } from "../../utils/custom.jquery";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

class TopBannerSlider extends React.Component {
    constructor(props) {
        super(props);

        this.courseDetails = this.courseDetails.bind(this);
        this.stopSlider = this.stopSlider.bind(this);
    }

    courseDetails(eve) {
        let that = this;
        this.props.getProfileCursosDetail(['2LZi5fjMHCg022wO4aeMMC']).then(function() {
            that.context.router.push({ 
            pathname: '/coursedetail',
            state: that.props.cursos.coursoDetailObj
          });
        });
    }

    stopSlider(divId) {
        setTimeout(function() { stopSliderCarousel(divId); }, 2000);
    }

    render() {
        const {homeInfo} = this.props;
        let courseDetailsFunc = this.courseDetails;
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        let showDefaultBannerImage = true, topBannerSlides = [];

        topBannerSlides = homeInfo.bannerContent.topBanner && homeInfo.bannerContent.topBanner.map(function(item, i) {
            if(userInfo.user.isdelegate || item.speciality.trim().toLowerCase().split(/\s*,\s*/).indexOf((userInfo.user.professionalData_specialty).toLowerCase()) > -1) {
                let url = 'url(' + item.imagePath + ')';
                showDefaultBannerImage = false;
                return (
                    <div className="slide" style={{backgroundImage: url}} key={i}>
                        {
                            item.buttonLinks ? 
                            <div className="content cv">
                                <div className="size3">{item.title}</div>
                                <h2 className="size1">{item.subTitle}</h2>
                                <div className="size3">{item.description}</div>
                                <div className="button-div"><Link title="Acceder al curso" className="button" onClick={() => courseDetailsFunc(item)}>Acceder al curso</Link></div>
                            </div>
                            :
                            <div className="content cv">
                                <div className="size2">{item.title}</div>
                                <h1 className="size1">{item.subTitle}</h1>
                                <div className="size3">{item.description}</div>
                            </div>
                        }
                    </div>
                )
            }
        }).filter(function(item) {return item});

        let topBannerPaginator = homeInfo.bannerContent.topBanner && homeInfo.bannerContent.topBanner.map(function(item, i) {
            if(userInfo.user.isdelegate || item.speciality.toLowerCase().indexOf((userInfo.user.professionalData_specialty).toLowerCase()) > -1) {
                return (
                    <div key={i}><img className="svg svgW " src="img/icons/circle.svg" title="Icono"/></div>
                )
            }
        });

        if(homeInfo.bannerContent.topBanner) {
            if(showDefaultBannerImage) {
                topBannerSlides = <div className="slide" style={{backgroundImage: 'url(img/home-logged/slide.jpg)'}}></div>
                this.stopSlider('slider-1');
            } else if(topBannerSlides.length === 1) {
                this.stopSlider('slider-1');
            }
        }

        return (
            <div className="slider-header" id="slider-1">
                <div className="slides">
                    {topBannerSlides}
                </div>
                <div className="paginator aw">
                    {topBannerPaginator}
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
        homeInfo: state.home,
        cursos: state.cursos,
        auth: state.auth
    };
};

TopBannerSlider.contextTypes = { 
  router: React.PropTypes.object.isRequired
}


export default connect(mapStateToProps, actionCreators)(TopBannerSlider);