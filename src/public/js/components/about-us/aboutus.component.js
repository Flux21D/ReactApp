import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerSlider from "./aboutus.topbanner.component";
import AboutUsContent from "./aboutus.content";
import { getAboutUsInfo } from "../../actions/aboutus";
import $ from "jquery";

class AboutUs extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        this.props.getAboutUsInfo().then(function() {
            //svg icons
            jQuery('img.svg').each(function () {
                var $img = jQuery(this);
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');

                jQuery.get(imgURL, function (data) {
                    // Get the SVG tag, ignore the rest
                    var $svg = jQuery(data).find('svg');

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
                <div className="page section-quienes-somos">
                    <TopBannerSlider />
                    <AboutUsContent />
                </div>
            </div>
        );
    }
}
const actionCreators = {
    getAboutUsInfo
};

const mapStateToProps = (state) => {
    return {
        aboutus: state.aboutus,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(AboutUs);