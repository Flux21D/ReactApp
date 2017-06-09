import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class HerramientasFavorites extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {profile} = this.props;

        let favTools = '';
        if(profile.favTools.length > 0)
            profile.favTools.map(function(item) {
                let imageIcon = item.isDownload ? 'cloud-download.svg' : 'external-link-square.svg';
                favTools = favTools + '<div class="column col-2"><a title="' + item.name + '" href="' + item.url + '" target="_blank"><span class="icon aw nmt"><img class="svg svgG6" src="img/icons/' + imageIcon + '" title="Icono"/></span> ' + item.name + '</a></div>';
            });
        const favToolsElement = htmlToReactParser.parse(favTools);

        return (
            <div>
                <div className="enlaces">
                    <div className="content">
                        <div className="title-big nmt">Herramientas favoritas</div>
                        {
                            favToolsElement ? 
                            <div className="columns">
                                {favToolsElement}
                                <div className="clear"></div>
                            </div>
                            : <p>Herramientas favoritas no guardadas</p>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        auth: state.auth
    };
};

export default connect(mapStateToProps)(HerramientasFavorites);