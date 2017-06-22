import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./profile.topbanner.component";
import TopProfileContainer from "./profile.topcontainer";
import ProfileNotifications from "./profile.notification.component";
import ProfileCourseContainer from "./profile.course.container";
import HerramientasFavorites from "./profile.herramientas.favorites";
import HeaderComponent from "../shared/header/header.component";
import FooterComponent from "../shared/footer/footer.component";
import $ from "jquery";
import { getProfileInfo } from "../../actions/myprofile";
import { replaceSVGIcons } from "../../utils/custom.jquery";

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getProfileInfo().then(function() {
            replaceSVGIcons();
        });
    }

    render() {
        return (
            <div>
                <div className="page section-perfil">
                    <TopBannerImage />
                    <TopProfileContainer />
                    <ProfileNotifications />
                    <ProfileCourseContainer />
                    <HerramientasFavorites />
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getProfileInfo
};

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(MyProfile);