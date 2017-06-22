import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerSlider from "./aboutus.topbanner.component";
import AboutUsContent from "./aboutus.content";
import { getAboutUsInfo } from "../../actions/aboutus";
import { replaceSVGIcons, playCarousel, stopCarousel } from "../../utils/custom.jquery";
import $ from "jquery";

class AboutUs extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        this.props.getAboutUsInfo().then(function() {
            replaceSVGIcons();
            playCarousel();
        });
    }

    componentWillUnmount () {
        stopCarousel();
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