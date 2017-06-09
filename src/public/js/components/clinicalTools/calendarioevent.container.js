import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import Pagination from "../shared/pagination/pagination.component";
import { getCalendarioInfo, sortCalenderEvents, setFavEvents, downloadICSFile } from "../../actions/calendario";
import axios from "axios";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class CalendarioEventContainer extends React.Component {
    constructor(props) {
        super(props);

        this.pageNumber = this.pageNumber.bind(this);
        this.sortEvents = this.sortEvents.bind(this);
        this.favEvents = this.favEvents.bind(this);
        this.calEvents = this.calEvents.bind(this);
    }

    state = {
        isFavouriteLocal: []
    };

    favEvents(eve) {
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        let eventId = eve.sysid;
        this.props.setFavEvents(userInfo.user.uuid, 'event', eventId);
        this.state.isFavouriteLocal.push(eve.sysid);
        this.setState({isFavouriteLocal: this.state.isFavouriteLocal});
    };

    calEvents(eve) {
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        let eventId = eve.sysid;
        this.props.downloadICSFile(userInfo.user.uuid, eve, function(err, resp) {
            if(!err) {
                var icselement = document.createElement('a');
                icselement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(resp));
                icselement.setAttribute('download', "dsds.ics");
                icselement.style.display = 'none';
                document.body.appendChild(icselement);
                icselement.click();
                document.body.removeChild(icselement);
            }
        });
    };

    pageNumber(pageNo) {
        this.refs.sortEvent.value = '';
        let queryParams = this.props.calendario.searchParams;
        this.props.getCalendarioInfo(pageNo, queryParams.keyword, queryParams.eventType, queryParams.dateFrom, queryParams.dateTo, queryParams.city, queryParams.country).then(function() {
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
    };

    sortEvents(eve) {
        this.props.sortCalenderEvents(eve.target.innerHTML, this.props.calendario.calendarEvents);
    }

    render() {
        const {calendario} = this.props;
        let locale = "en-us";
        let favEventsFunc = this.favEvents;
        let calEventsFunc = this.calEvents;
        let that = this;

        let calEvents = calendario.calendarEvents.map(function(item, i) {
            let objDate = new Date(item.startDate);
            let date = objDate.getDate();
            let month = objDate.toLocaleString(locale, { month: "short"});
            let favClass = (item.isFavourite || (that.state.isFavouriteLocal.indexOf(item.sysid) !== -1)) ? "favHeherramientas" : '';

            return (
                <div className="event" key={i}>
                    <div className="date-modalidad">
                        <div className="date">
                            <div className="day">{date}</div>
                            <div className="month">{month}</div>
                        </div>
                    </div>
                    <div className="txt">
                        <p className="place">{item.eventType}</p>
                        <h3 className="title">{item.mainTitle}</h3>
                        <p className="info">{item.description}</p>
                        <div className="buttons">
                            <a title="Descargar" onClick={() => calEventsFunc(item)}><span className="aw"><img className="svg svgG6 " src="img/icons/calendar-plus-o.svg" title="Icono"/></span> Descargar</a>
                            <a title="Guardar" className={favClass} onClick={() => favEventsFunc(item)}><span className="aw"><img className="svg svgG6 " src="img/icons/heart-o.svg" title="Icono"/></span> Guardar</a>
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
            )
        });

        return (
            <div className="results-search" id="results-search">
                <div className="content">
                    <div className="sort std-form">
                        Ordernar por:
                        <div className="input-inline">
                            <div className="select-values select-tight">
                                <div onClick={this.sortEvents}>Popularidad</div>
                                <div onClick={this.sortEvents}>Nombre</div>
                                <div onClick={this.sortEvents}>Fecha</div>
                            </div>
                            <input className="text select select-tight" type="text" placeholder="Popularidad" name="orderby" ref='sortEvent'/>
                        </div>
                    </div>
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18" src="img/icons/mortar-board.svg" title="Icono"/></span> Eventos encontrados</h2>
                    <div className="events">
                        {calEvents}
                    </div>
                    <div className="clear"></div>

                    <Pagination totalRecords={calendario.totalRecords} pageNumber={this.pageNumber} activePageNo={calendario.activePageNo} />
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getCalendarioInfo, 
    sortCalenderEvents, 
    setFavEvents,
    downloadICSFile
};

const mapStateToProps = (state) => {
    return {
        calendario: state.calendario,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(CalendarioEventContainer);