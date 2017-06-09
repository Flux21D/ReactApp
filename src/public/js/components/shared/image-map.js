import React from "react";
import {connect} from "react-redux";
import {showOverlay, hideOverlay} from "../../actions/overlay";
import createMarkup from "../../utils/html-text";

const setStyles = (position) => {

    const hotspotStyles = {
        left: position.left,
        top: position.top
    };

    return hotspotStyles;
};

class ImageMap extends React.Component {

    state = {
        activeIndex: null
    };

    constructor(props) {
        super(props);

        this.closeHotspot = this.closeHotspot.bind(this);
        this.openHotspot = this.openHotspot.bind(this);
    }

    openHotspot(key) {
        this.setState({
            activeIndex: key
        });

        if (this.props.callback) {
            this.props.callback();
        }

        this.props.showOverlay();
    }

    closeHotspot(event) {
        event.stopPropagation();

        this.setState({
            activeIndex: null
        });

        this.props.hideOverlay();
    }

    render() {
        const {img, hotspots, data} = this.props;

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        return (
            <div style={{position: 'relative'}}>

                {this.props.children}

                {hotspots.map((hotspot, key) => {

                    return <div key={key} style={setStyles(hotspot.styles)} onClick={() => {
                        return this.openHotspot(key)
                    }} className={"hotspot " + (this.state.activeIndex === key ? "active" : "")}>
                        <div className={"hotspot-circle " + (!isSafari ? "circle" : "")}>
                            <div className="hotspot-tooltip">

                                {data.title ? <h3 className="text-orange">{data.title}</h3> : null }
                                {data.description ? <p className="text-left"
                                                       dangerouslySetInnerHTML={createMarkup(data.description)}/> : null }

                                {data.img ? <div><img src={data.img}/></div> : null}

                                <span className="close-tooltip" onClick={this.closeHotspot}>
                                    <img src="svg/icons/icon_close_white.svg"/>
                                </span>
                            </div>
                        </div>
                    </div>;

                })}

            </div>
        );
    }

}

export default connect(null, {showOverlay, hideOverlay})(ImageMap);