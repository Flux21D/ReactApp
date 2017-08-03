import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import Pagination from "../shared/pagination/pagination.component";
import { getCalendarioInfo, sortCalenderEvents, setFavEvents, downloadICSFile } from "../../actions/calendario";
import axios from "axios";
import { selectDropdown } from "../../utils/custom.jquery";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

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
    isFavouriteLocal: [],
    isCrappyIE: false
  };

  componentWillMount() {
    let isCrappyIE = false;

    if (typeof window !== "undefined" && window.navigator.msSaveOrOpenBlob && window.Blob) {
      isCrappyIE = true;
    }
    this.setState({ isCrappyIE: isCrappyIE });
  }

  componentDidMount() {
    selectDropdown();
    this.refs.txtSortEvent.value = 'Fecha';
  }

  favEvents(eve) {
    let userInfo = JSON.parse(sessionStorage.getItem('auth'));
    let eventId = eve.sysid;
    let startDt = eve.startDate ? (new Date(eve.startDate).toISOString()) : '';
    this.props.setFavEvents(userInfo.user.uuid, 'event', eventId, startDt);
    this.state.isFavouriteLocal.push(eve.sysid);
    this.setState({isFavouriteLocal: this.state.isFavouriteLocal});
  };

  calEvents(eve) {
    let userInfo = JSON.parse(sessionStorage.getItem('auth'));
    let eventId = eve.sysid;
    const that = this;
    this.props.downloadICSFile(userInfo.user.uuid, eve, function(err, resp) {
      if(!err) {
        if (encodeURIComponent(resp).startsWith("data") ||encodeURIComponent(resp).startsWith("BEGIN")){
          let filename = "dsds.ics";
          let blob = new Blob([encodeURIComponent(resp)], { type: "text/calendar;charset=utf-8" });
          if (that.state.isCrappyIE) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
          }
          else{
            /****************************************************************
            // many browsers do not properly support downloading data URIs
            // (even with "download" attribute in use) so this solution
            // ensures the event will download cross-browser
            ****************************************************************/
            let icselement = document.createElement('a');
            icselement.href = window.URL.createObjectURL(blob);
            icselement.setAttribute("download", filename);
            document.body.appendChild(icselement);
            icselement.click();
            document.body.removeChild(icselement);
          }
        }
        else{
          window.open(url, "_blank");
        }
      }
    });
  };

  pageNumber(pageNo) {
    this.refs.txtSortEvent.value = '';
    let queryParams = this.props.calendario.searchParams;
    this.props.getCalendarioInfo(pageNo, queryParams.keyword, queryParams.eventType, queryParams.dateFrom, queryParams.dateTo, queryParams.city, queryParams.country);
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
                            <input className="text select select-tight" type="text" placeholder="Popularidad" name="orderby" ref='txtSortEvent'/>
                        </div>
                    </div>
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18" src="img/icons/mortar-board.svg" title="Icono"/></span> Eventos encontrados</h2>
                    <div className="events">
                        {
                            calEvents.length > 0 ? calEvents : <div><h2>No se han encontrado resultados</h2></div>
                        }
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