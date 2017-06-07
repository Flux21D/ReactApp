import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./calendario.topbanner.component";
import SearchPanel from "../search/search.calendario.component";
import CalendarioEventContainer from "../clinicalTools/calendarioevent.container";
import { getCalendarioInfo } from "../../actions/calendario";
import $ from "jquery";

class CalendarioComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let pageNum = 1;
        this.props.getCalendarioInfo(pageNum).then(function() {
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
                <div className="page section-calendario">
                    <TopBannerImage />
                    <SearchPanel />
                    <CalendarioEventContainer />
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getCalendarioInfo
};

const mapStateToProps = (state) => {
    return {
        calendario: state.calendario,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(CalendarioComponent);