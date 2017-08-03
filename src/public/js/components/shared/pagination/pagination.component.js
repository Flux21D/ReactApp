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
    disablePrevButton: false,
    disableNextButton: false
  };

  updateState(totalRec) {
    this.setState({
      totalRecords: totalRec,
      lastPage: (Math.ceil(totalRec / this.recordsPerPage) < this.showPages) ? Math.ceil(totalRec / this.recordsPerPage) : this.showPages
    });

    if (Math.ceil(totalRec / this.recordsPerPage) < this.showPages) {
      this.setState({disableNextButton: true});
    } else {
      this.setState({disableNextButton: false});
    }
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.totalRecords !== this.props.totalRecords) {
      this.updateState(nextProps.totalRecords);
    }
  }

  componentDidMount() {
    this.updateState(this.props.totalRecords);
    for (let i = this.state.firstPage; i <= this.state.lastPage; i++) {
      let a = document.getElementById(i);
      a.addEventListener('click', this.pageValue.bind(this));
    };

    if(this.state.firstPage === 1) {
      this.setState({disablePrevButton: true});
    }
  };

  componentDidUpdate() {
    for (let i = this.state.firstPage; i <= this.state.lastPage; i++) {
      let a = document.getElementById(i);
      a.addEventListener('click', this.pageValue.bind(this));
    };
  };

  previousPage() {
    let firstPageNo = this.state.firstPage;
    if(this.state.firstPage > 1) {
      this.setState({disableNextButton: false});
      this.setState({firstPage: this.state.firstPage - 1});
      this.setState({lastPage: this.state.lastPage - 1});
      firstPageNo = this.state.firstPage - 1;
    } 

    if(firstPageNo === 1) {
      this.setState({disablePrevButton: true});
    }
  };

  nextPage() {
    let nextPageNo = this.state.lastPage;
    let lastPageNo = Math.ceil(this.state.totalRecords / this.recordsPerPage);
        
    if(this.state.lastPage < lastPageNo) {
      this.setState({disablePrevButton: false});
      this.setState({firstPage: this.state.firstPage + 1});
      this.setState({lastPage: this.state.lastPage + 1});
      nextPageNo = this.state.lastPage + 1;
    } 

    if (nextPageNo === lastPageNo) {
      this.setState({disableNextButton: true});
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
    for (let i = this.state.firstPage; i <= this.state.lastPage; i++) {
      let activeClass = this.props.activePageNo === i ? "page active" : "page";
      paginationElement = paginationElement + '<a id="' + i + '" title="Página ' + i + '" className="' + activeClass + '">' + i + '</a>';
    }
    const reactElement = htmlToReactParser.parse(paginationElement);
        
    return (
            <div className="results-paginator">
                <a title="Anterior" className={this.state.disablePrevButton ? 'aw disable-button' : 'aw'} onClick={this.previousPage}><img className="svg svgG6" src="img/icons/angle-left.svg" title="Icono"/></a>
                {reactElement}
                <a title="Siguiente" className={this.state.disableNextButton ? 'aw disable-button' : 'aw'} onClick={this.nextPage}><img className="svg svgG6" src="img/icons/angle-right.svg" title="Icono"/></a>
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