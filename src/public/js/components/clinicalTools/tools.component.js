import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./tools.topbanner.component";
import ToolBoxContainer from "./toolbox.container";
import { getHerramientasInfo } from "../../actions/herramientas";
import $ from "jquery";

class ToolsComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        let pageNum = 1;
        this.props.getHerramientasInfo(pageNum).then(function() {
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
            
            $('.external_link').click(function() {
                $('#modal-external').fadeIn();
                let link = $(this).attr('title');
                $('#modal-external #link-ok').attr('href', link);
                $('body').addClass('disable-scroll');
            });

            $('.close_window').click(function() {
                $('.modal-wrapper').fadeOut();
                $('body').removeClass('modal-on, disable-scroll');
            });

            $(document).keyup(function(e) {
              if (e.keyCode === 27) $('.modal-wrapper').fadeOut();
              $('body').removeClass('disable-scroll');
            });
        });
    }

    render() {
        return (
            <div>
                <div className="page section-herramientas">
                    <TopBannerImage />
                    <ToolBoxContainer />
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getHerramientasInfo
};

const mapStateToProps = (state) => {
    return {
        herramientas: state.herramientas,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(ToolsComponent);