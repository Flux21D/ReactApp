import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { getProfileCursosDetail } from "../../actions/cursos";

class MiddleBannerSlider extends React.Component {
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
        let showDefaultBannerImage = true, middleBannerSlides = [];

        middleBannerSlides = homeInfo.bannerContent.middleBanner && homeInfo.bannerContent.middleBanner.map(function(item, i) {
            if(item.speciality.toLowerCase().indexOf((userInfo.user.professionalData_specialty).toLowerCase()) > -1) {
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
        });

        let middleBannerPaginator = homeInfo.bannerContent.middleBanner && homeInfo.bannerContent.middleBanner.map(function(item, i) {
            if(item.speciality.toLowerCase().indexOf((userInfo.user.professionalData_specialty).toLowerCase()) > -1) {
                return (
                    <div key={i}><img className="svg svgW " src="img/icons/circle.svg" title="Icono"/></div>
                )
            }
        });

        if(showDefaultBannerImage) {
            middleBannerSlides = <div className="slide" style={{backgroundImage: 'url(img/backgrounds/historia.jpg)'}}></div>
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