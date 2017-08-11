import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {getHomeCalendarioInfo, setHomeFavEvents, downloadICSFile} from "../../actions/home";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

class UpcomingEventContainer extends React.Component {
  constructor(props) {
    super(props);

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
    this.props.getHomeCalendarioInfo(true).then(function() {
            //svg icons
      $('img.svg').each(function () {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function (data) {
                    // Get the SVG tag, ignore the rest
          var $svg = $(data).find('svg');

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

  favEvents(eve) {
    let userInfo = JSON.parse(sessionStorage.getItem('auth'));
    let eventId = eve.sysid;
    let startDt = eve.startDate ? (new Date(eve.startDate).toISOString()) : '';
    this.props.setHomeFavEvents(userInfo.user.uuid, 'event', eventId, startDt);
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
          let filename = "calendar.ics";
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
            var icselement = document.createElement('a');
            icselement.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(resp));
            icselement.setAttribute('download', "calendar.ics");
            icselement.style.display = 'none';
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

  render() {
    const {homeInfo} = this.props;
    let locale = "en-us";
    let that = this;
    let favEventsFunc = this.favEvents;
    let calEventsFunc = this.calEvents;

    let calEventsElement = homeInfo.homeCalEvents.map(function(item, i) {
      let objDate = new Date(item.startDate);
      let date = objDate.getDate();
      let month = objDate.toLocaleString(locale, { month: "short"});
      let favClass = (item.isFavourite || (that.state.isFavouriteLocal.indexOf(item.sysid) !== -1)) ? "favHeherramientas" : '';

      return (
                <div className={'event ' + (i ===  (homeInfo.homeCalEvents.length - 1) ? 'destacat' : '')} key={i}>
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
            <div className="results-search">
                <div className="content">
                    <div className="sort std-form">
                        <Link title="Ver todos" to="/calendario" className="button tight">Ver todos <span className="aw"><img className="svg svgW" src="img/icons/angle-right.svg" title="Icono"/></span></Link>
                    </div>
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18" src="img/icons/calendar.svg" title="Icono"/></span> <Link title="Próximos eventos" to="/calendario">Próximos eventos</Link></h2>
                    <div className="events">
                        {calEventsElement}
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
    );
  }
}

const actionCreators = {
  getHomeCalendarioInfo,
  setHomeFavEvents,
  downloadICSFile
};

const mapStateToProps = (state) => {
  return {
    homeInfo: state.home,
    auth: state.auth
  };
};


export default connect(mapStateToProps, actionCreators)(UpcomingEventContainer);