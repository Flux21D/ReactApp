import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { getCalendarioInfo } from "../../actions/calendario";
import {selectDropdown, replaceSVGIcons} from "../../utils/custom.jquery";

class SearchPanel extends React.Component {
    constructor(props) {
        super(props);

        this.searchEvents = this.searchEvents.bind(this);
        this.toggleDP = this.toggleDP.bind(this);
    }

    state = {
        pageNo: 1,
        openEventDP: false,
        openCityDP: false,
        openCountryDP: false
    };

    componentDidMount() { };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.calendario.searchPanel !== this.props.calendario.searchPanel) {
            //datapicker code
            $("#dateFrom, #dateTo").datepicker();
            selectDropdown();
        }
    }

    eventTypeHandleChange(eve) {
        this.refs.txtEventType.value = eve;
    };

    cityHandleChange(eve) {
        this.refs.txtCity.value = eve;
    };

    countryHandleChange(eve) {
        this.refs.txtCountry.value = eve;
    };

    toggleDP(eve) {
        this.setState({[eve]: !this.state[eve]});
    };

    searchEvents() {
        this.props.getCalendarioInfo(this.state.pageNo, this.refs.txtKeyword.value, this.refs.txtEventType.value, this.refs.datePicFrom.value, this.refs.datePicTo.value, this.refs.txtCity.value, this.refs.txtCountry.value).then(function() {
            replaceSVGIcons();
        });
    };

    render() {
        const {calendario} = this.props;
        let that = this;

        let eventTypeDP = calendario.searchPanel.Type && calendario.searchPanel.Type.map(function(item, i) {
            return (
                <div onClick={that.eventTypeHandleChange.bind(that, item)} key={i}>{item}</div>
            )
        });

        let cityTypeDP = calendario.searchPanel.city && calendario.searchPanel.city.map(function(item, i) {
            return (
                <div onClick={that.cityHandleChange.bind(that, item)} key={i}>{item}</div>
            )
        });

        let countryTypeDP = calendario.searchPanel.country && calendario.searchPanel.country.map(function(item, i) {
            return (
                <div onClick={that.countryHandleChange.bind(that, item)} key={i}>{item}</div>
            )
        });

        return (
            <div className="search-cursos search-eventos">
                <div className="content">
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18" src="img/icons/mortar-board.svg" title="Icono"/></span> Buscador de eventos</h2>
                    <div className="std-form form">
                        <form>
                            <div className="input zindex1">
                                <input type="text" placeholder="Palabra clave" name="kw" className="text" ref="txtKeyword"/>
                            </div>
                            <div className="input zindex5" onClick={() => this.toggleDP('openEventDP')}>
                                <div className="select-values" style={{display: (this.state.openEventDP ? 'block' : 'none')}}>
                                    {eventTypeDP}
                                </div>
                                <input className="text select" type="text" placeholder="Tipo" name="tipo" ref="txtEventType" readOnly/>
                            </div>
                            <div className="input zindex1">
                                <input id="dateFrom" type="text" placeholder="Fecha desde" name="desde" className="text" ref="datePicFrom" readOnly/>
                            </div>
                            <div className="input zindex1">
                                <input id="dateTo" type="text" placeholder="Fecha hasta" name="hasta" className="text" ref="datePicTo" readOnly/>
                            </div>
                            <div className="input zindex4" onClick={() => this.toggleDP('openCityDP')}>
                                <div className="select-values" style={{display: (this.state.openCityDP ? 'block' : 'none')}}>
                                    {cityTypeDP}
                                </div>
                                <input className="text select" type="text" placeholder="Ciudad" name="tipo" ref="txtCity" readOnly/>
                            </div>
                            <div className="input zindex3" onClick={() => this.toggleDP('openCountryDP')}>
                                <div className="select-values" style={{display: (this.state.openCountryDP ? 'block' : 'none')}}>
                                    {countryTypeDP}
                                </div>
                                <input className="text select" type="text" placeholder="País" name="tipo" ref="txtCountry" readOnly/>
                            </div>
                            <div className="input nmr">
                                <input type="button" value="Buscar" className="submit" onClick={this.searchEvents}/>
                            </div>
                            <div className="clear"></div>
                        </form>
                    </div>
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

export default connect(mapStateToProps, actionCreators)(SearchPanel);