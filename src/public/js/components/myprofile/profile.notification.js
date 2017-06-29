import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { replaceSVGIcons } from "../../utils/custom.jquery";

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

        replaceSVGIcons();
    }

    render() {
        return (
            <div className="miperfil">
                <div className="bola">{this.state.notificationCount}</div>
                <Link title="Mi perfil" to="/myprofile"><span className="aw"><img className="svg svgR  " src="img/icons/user-circle-o.svg" title="Icono"/></span> Mi perfil</Link>
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