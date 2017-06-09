import React from "react";
import {connect} from "react-redux";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.recordsPerPage = 3;
        this.showPages = 5;

        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.pageValue = this.pageValue.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    state = {
        totalRecords: 0,
        firstPage: 1,
        lastPage: 1,
    };

    updateState(totalRec) {
       this.setState({
        totalRecords: totalRec,
        lastPage: Math.ceil(totalRec / this.recordsPerPage) < this.showPages ? Math.ceil(totalRec / this.recordsPerPage) : this.showPages
        });
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.totalRecords !== this.props.totalRecords) {
            this.updateState(nextProps.totalRecords);
        }
    }

    componentDidMount() {
        this.updateState(this.props.totalRecords);
        for (var i = this.state.firstPage; i <= this.state.lastPage; i++) {
            var a = document.getElementById(i);
            a.addEventListener('click', this.pageValue.bind(this));
        };
    };

    componentDidUpdate() {
        for (var i = this.state.firstPage; i <= this.state.lastPage; i++) {
            var a = document.getElementById(i);
            a.addEventListener('click', this.pageValue.bind(this));
        };
    };

    previousPage() {
        if(this.state.firstPage > 1) {
            this.setState({firstPage: this.state.firstPage - 1});
            this.setState({lastPage: this.state.lastPage - 1});
        }
    };

    nextPage() {
        if(this.state.lastPage < Math.ceil(this.state.totalRecords / this.recordsPerPage)) {
            this.setState({firstPage: this.state.firstPage + 1});
            this.setState({lastPage: this.state.lastPage + 1});
        }
    };

    pageValue(eve) {
        let val = eve.target.attributes.getNamedItem('id').value;
        if(this.props.activePageNo !== Number(val)) {
            this.props.pageNumber(Number(val));
            eve.stopImmediatePropagation();
        }
    };

    render() {
        let paginationElement = '';
        for (var i = this.state.firstPage; i <= this.state.lastPage; i++) {
            let activeClass = this.props.activePageNo === i ? "page active" : "page";
            paginationElement = paginationElement + '<a id="' + i + '" title="Página ' + i + '" className="' + activeClass + '">' + i + '</a>';
        }
        const reactElement = htmlToReactParser.parse(paginationElement);
        
        return (
            <div className="results-paginator">
                <a title="Anterior" className="aw" onClick={this.previousPage}><img className="svg svgG6" src="img/icons/angle-left.svg" title="Icono"/></a>
                {reactElement}
                <a title="Siguiente" className="aw" onClick={this.nextPage}><img className="svg svgG6" src="img/icons/angle-right.svg" title="Icono"/></a>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(Pagination);