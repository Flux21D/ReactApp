import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerSlider from "./home.topbanner.component";
import UpcomingEventContainer from "../events/upcoming.event.component";
import MiddleBannerSlider from "./home.middlebanner.component";
import SearchPanel from "../search/search.home.component";
import UpcomingClinicalToolContainer from "../clinicalTools/upcoming.ct.component";
import HeaderComponent from "../shared/header/header.component";
import FooterComponent from "../shared/footer/footer.component";
import $ from "jquery";
import {getHomePageInfo} from "../../actions/home";

class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        this.props.getHomePageInfo().then(function() {
            //svg icons
            $('img.svg').each(function () {
                var $img = $(this);
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');

                $.get(imgURL, function (data) {
                    // Get the SVG tag, ignore the rest
                    var $svg = $(data).find('svg');

                    // Add replaced image's ID to the new SVG
                    if (typeof imgID !== 'undefined') {
                        $svg = $svg.attr('id', imgID);
                    }
                    // Add replaced image's classes to the new SVG
                    if (typeof imgClass !== 'undefined') {
                        $svg = $svg.attr('class', imgClass + ' replaced-svg');
                    }

                    // Remove any invalid XML tags as per http://validator.w3.org
                    $svg = $svg.removeAttr('xmlns:a');

                    // Replace image with new SVG
                    $img.replaceWith($svg);

                }, 'xml');
            });

            $("div.slider-header").each(function(i) {
                let idSlider = $(this).attr('id');
                let slider = new Slider('#'+idSlider, 5000);
                slider.play();
            });
        });
    }

    componentWillUnmount () {
        $("div.slider-header").each(function(i) {
            let idSlider = $(this).attr('id');
            let slider = new Slider('#'+idSlider, 5000);
            slider.stop();
        });
    }

    render() {
        return (
            <div>
                <div className="page section-home-logged">
                    <TopBannerSlider />
                    <UpcomingEventContainer />
                    <MiddleBannerSlider />
                    <SearchPanel component='home'/>
                    <UpcomingClinicalToolContainer/>
                </div>
            </div>
        );
    }

}

const actionCreators = {
    getHomePageInfo
};

const mapStateToProps = (state) => {
    return {
        homeInfo: state.home,
        auth: state.auth
    };
};


export default connect(mapStateToProps, actionCreators)(HomeComponent);