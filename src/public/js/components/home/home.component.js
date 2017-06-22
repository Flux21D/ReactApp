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
import { replaceSVGIcons, playCarousel, stopCarousel } from "../../utils/custom.jquery";

class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        this.props.getHomePageInfo().then(function() {
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
                <div className="page section-home-logged">
                    <TopBannerSlider />
                    <UpcomingEventContainer />
                    <MiddleBannerSlider />
                    <SearchPanel component='home' searchPanel={this.props.homeInfo.searchPanel}/>
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