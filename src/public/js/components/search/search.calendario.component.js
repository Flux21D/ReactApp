import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { getCalendarioInfo } from "../../actions/calendario";

class SearchPanel extends React.Component {
    constructor(props) {
        super(props);

        this.searchEvents = this.searchEvents.bind(this);
        this.keywordHandleChange = this.keywordHandleChange.bind(this);
        this.eventTypeHandleChange = this.eventTypeHandleChange.bind(this);
        this.dateFromHandleChange = this.dateFromHandleChange.bind(this);
        this.dateToHandleChange = this.dateToHandleChange.bind(this);
        this.cityHandleChange = this.cityHandleChange.bind(this);
        this.countryHandleChange = this.countryHandleChange.bind(this);
    }

    state = {
        pageNo: 1,
        keyword: '',
        eventType: '',
        dateFrom: '',
        dateTo: '',
        city: '',
        country: ''
    };

    componentDidMount() {
        //select std-form
        let sisel = 1;
        $('div.std-form input.select').click(function () {
            sisel =! sisel;
            $('div.select-values').hide();
            if(!sisel) $(this).parent().find('div.select-values').show();
            else  $(this).parent().find('div.select-values').hide();
            $(this).blur();
        });

        $('div.std-form div.select-values div').click(function () {
            $(this).parent().parent().find('input.select').val($(this).html());
            $('div.select-values').hide();
            sisel = 0;
        });
    };

    keywordHandleChange(eve) {
        this.setState({keyword: eve.target.value});
    };

    eventTypeHandleChange(eve) {
        this.setState({eventType: eve.target.innerHTML});
    };

    dateFromHandleChange(eve) {
        this.setState({dateFrom: eve.target.value});
    };

    dateToHandleChange(eve) {
        this.setState({dateTo: eve.target.value});
    };

    cityHandleChange(eve) {
        this.setState({city: eve.target.innerHTML});
    };

    countryHandleChange(eve) {
        this.setState({country: eve.target.innerHTML});
    };

    searchEvents() {
        this.props.getCalendarioInfo(this.state.pageNo, this.state.keyword, this.state.eventType, this.state.dateFrom, this.state.dateTo, this.state.city, this.state.country).then(function() {
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

    render() {
        return (
            <div className="search-cursos search-eventos">
                <div className="content">
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18" src="img/icons/mortar-board.svg" title="Icono"/></span> Buscador de eventos</h2>
                    <div className="std-form form">
                        <form>
                            <div className="input zindex1">
                                <input type="text" placeholder="Palabra clave" name="kw" className="text" onChange={this.keywordHandleChange}/>
                            </div>
                            <div className="input zindex5">
                                <div className="select-values">
                                    <div onClick={this.eventTypeHandleChange}>Congreso</div>
                                    <div onClick={this.eventTypeHandleChange}>Reunión</div>
                                    <div onClick={this.eventTypeHandleChange}>Curso presencial</div>
                                    <div onClick={this.eventTypeHandleChange}>Tipo 4</div>
                                    <div onClick={this.eventTypeHandleChange}>Tipo 5</div>
                                    <div onClick={this.eventTypeHandleChange}>Tipo 6</div>
                                    <div onClick={this.eventTypeHandleChange}>Tipo 7</div>
                                </div>
                                <input className="text select" type="text" placeholder="Tipo" name="tipo" />
                            </div>
                            <div className="input zindex1">
                                <input type="text" placeholder="Fecha desde" name="desde" className="text" onChange={this.dateFromHandleChange}/>
                            </div>
                            <div className="input zindex1">
                                <input type="text" placeholder="Fecha hasta" name="hasta" className="text" onChange={this.dateToHandleChange}/>
                            </div>
                            <div className="input zindex4">
                                <div className="select-values">
                                    <div onClick={this.cityHandleChange}>Ciudad 1</div>
                                    <div onClick={this.cityHandleChange}>Ciudad 2</div>
                                    <div onClick={this.cityHandleChange}>Ciudad 3</div>
                                    <div onClick={this.cityHandleChange}>Ciudad 4</div>
                                    <div onClick={this.cityHandleChange}>Ciudad 5</div>
                                </div>
                                <input className="text select" type="text" placeholder="Ciudad" name="tipo" />
                            </div>
                            <div className="input zindex3">
                                <div className="select-values">
                                    <div onClick={this.countryHandleChange}>País 1</div>
                                    <div onClick={this.countryHandleChange}>País 2</div>
                                    <div onClick={this.countryHandleChange}>País 3</div>
                                    <div onClick={this.countryHandleChange}>País 4</div>
                                    <div onClick={this.countryHandleChange}>País 5</div>
                                </div>
                                <input className="text select" type="text" placeholder="País" name="tipo" />
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