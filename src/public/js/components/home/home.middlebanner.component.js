import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { getProfileCursosDetail } from "../../actions/cursos";
import { stopSliderCarousel } from "../../utils/custom.jquery";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

class MiddleBannerSlider extends React.Component {
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
    let showDefaultBannerImage = true, middleBannerSlides = [];

    middleBannerSlides = homeInfo.bannerContent.middleBanner && homeInfo.bannerContent.middleBanner.map(function(item, i) {
      if(userInfo.user.isdelegate || item.speciality.trim().toLowerCase().split(/\s*,\s*/).indexOf((userInfo.user.professionalData_specialty).toLowerCase()) > -1) {
        let url = 'url(' + item.imagePath + ')';
        showDefaultBannerImage = false;
        return (
                    <div className="slide" style={{backgroundImage: url}} key={i}>
                        <div className="content cv">
                            <div className="size3">{item.title}</div>
                            <h2 className="size1">{item.subTitle}</h2>
                            <div className="size3">{item.description}</div>
                            <div className="button-div"><Link title="Acceder al curso" className="button" onClick={() => courseDetailsFunc(item)}>Acceder al curso</Link></div>
                        </div>
                    </div>
        )
      }
    }).filter(function(item) {return item});

    let middleBannerPaginator = homeInfo.bannerContent.middleBanner && homeInfo.bannerContent.middleBanner.map(function(item, i) {
      if(userInfo.user.isdelegate || item.speciality.toLowerCase().indexOf((userInfo.user.professionalData_specialty).toLowerCase()) > -1) {
        return (
                    <div key={i}><img className="svg svgW " src="img/icons/circle.svg" title="Icono"/></div>
        )
      }
    });

    if(homeInfo.bannerContent.middleBanner) {
      if(showDefaultBannerImage) {
        middleBannerSlides = <div className="slide" style={{backgroundImage: 'url(img/backgrounds/historia.jpg)'}}></div>
        this.stopSlider('slider-2');
      } else if(middleBannerSlides.length === 1) {
        this.stopSlider('slider-2');
      }
    }

    return (
            <div className="slider-header slider-tight" id="slider-2">
                <div className="slides">
                    {middleBannerSlides}
                </div>
                <div className="paginator aw">
                    {middleBannerPaginator}
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

MiddleBannerSlider.contextTypes = { 
  router: React.PropTypes.object.isRequired
}


export default connect(mapStateToProps, actionCreators)(MiddleBannerSlider);