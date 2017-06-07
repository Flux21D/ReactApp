import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

class ProfileNotification extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        notificationCount: 0
    }

    componentDidMount()
    {
        //socket to show notification count
        var socket = io.connect();
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        socket.emit('uuid', userInfo.user.uuid);
        let that = this;
        socket.on('count', function(val) {
            console.log(val);
            that.setState({notificationCount: val});
        });

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
    }

    render() {
        return (
            <div className="miperfil">
                <div className="bola">{this.state.notificationCount}</div>
                <Link title="Mi perfil" to="myprofile"><span className="aw"><img className="svg svgR  " src="img/icons/user-circle-o.svg" title="Icono"/></span> Mi perfil</Link>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(ProfileNotification);