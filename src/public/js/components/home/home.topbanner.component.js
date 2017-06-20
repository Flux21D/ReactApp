import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { getProfileCursosDetail } from "../../actions/cursos";

class TopBannerSlider extends React.Component {
    constructor(props) {
        super(props);

        this.courseDetails = this.courseDetails.bind(this);
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

    render() {
        const {homeInfo} = this.props;
        let courseDetailsFunc = this.courseDetails;
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        let showDefaultBannerImage = true, topBannerSlides = [];

        topBannerSlides = homeInfo.bannerContent.topBanner && homeInfo.bannerContent.topBanner.map(function(item, i) {
            if(item.speciality.trim().toLowerCase().split(/\s*,\s*/).indexOf((userInfo.user.professionalData_specialty).toLowerCase()) > -1) {
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
        });

        let topBannerPaginator = homeInfo.bannerContent.topBanner && homeInfo.bannerContent.topBanner.map(function(item, i) {
            if(item.speciality.toLowerCase().indexOf((userInfo.user.professionalData_specialty).toLowerCase()) > -1) {
                return (
                    <div key={i}><img className="svg svgW " src="img/icons/circle.svg" title="Icono"/></div>
                )
            }
        });

        if(showDefaultBannerImage) {
            topBannerSlides = <div className="slide" style={{backgroundImage: 'url(img/home-logged/slide.jpg)'}}></div>
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