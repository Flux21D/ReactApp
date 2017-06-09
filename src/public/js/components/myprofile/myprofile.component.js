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

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getProfileInfo().then(function() {
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