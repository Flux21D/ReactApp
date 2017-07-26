import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import { getCursosInfo } from "../../actions/cursos";
import {selectDropdown} from "../../utils/custom.jquery";

class SearchPanel extends React.Component {
  constructor(props) {
    super(props);

    this.searchCourses = this.searchCourses.bind(this);
    this.accreditationHandleChange = this.accreditationHandleChange.bind(this);
  }

  componentDidMount() {
    if(this.props.component === 'course' && this.props.locState) {
      this.refs.txtKeyword.value = this.props.locState.keyword;
      this.refs.txtCourseType.value = this.props.locState.courseType;
      this.refs.txtAcreditado.value = this.props.locState.accreditation;
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchPanel !== this.props.searchPanel) {
      selectDropdown();
    }
  }

  courseTypeHandleChange(eve) {
    this.refs.txtCourseType.value = eve;
  };

  accreditationHandleChange(eve) {
    this.refs.txtAcreditado.value = eve.target.innerHTML;
  };

  searchCourses() {
    let searchObj = {
      pageNo: 1,
      keyword: this.refs.txtKeyword.value,
      courseType: this.refs.txtCourseType.value,
      accreditation: this.refs.txtAcreditado.value !== '' ? (this.refs.txtAcreditado.value === 'Si' ? 'yes' : 'no') : ''
    }

    if(this.props.component === 'home') {
      this.context.router.push({ 
        pathname: '/cursos',
        state: searchObj
      });
    } else {
      this.props.getCursosInfo(searchObj.pageNo, searchObj);
    }
  };

  render() {
    const {searchPanel} = this.props;
    let that = this;

    let courseTypeDP = searchPanel.Type && searchPanel.Type.map(function(item, i) {
      return (
                <div onClick={that.courseTypeHandleChange.bind(that, item)} key={i}>{item}</div>
      )
    });

    return (
            <div className="search-cursos">
                <div className="content">
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18 " src="img/icons/mortar-board.svg" title="Icono"/></span> <Link title="Buscador de cursos" to="/cursos">Buscador de cursos</Link></h2>
                    <div className="std-form form">
                        <form>
                            <div className="input zindex1">
                                <input type="text" placeholder="Palabra clave" name="kw" className="text" ref='txtKeyword'/>
                            </div>
                            <div className="input zindex1">
                                <div className="select-values">
                                    {courseTypeDP}
                                </div>
                                <input id="courseTypeDP" className="text select" type="text" placeholder="Formato" name="formato" ref="txtCourseType" readOnly/>
                            </div>
                            <div className="input zindex1">
                                <div className="select-values">
                                    <div onClick={this.accreditationHandleChange}>Si</div>
                                    <div onClick={this.accreditationHandleChange}>No</div>
                                </div>
                                <input className="text select" type="text" placeholder="Acreditado" name="acreditado" ref="txtAcreditado" readOnly/>
                            </div>
                            <div className="input nmr">
                                <input type="button" value="Buscar" className="submit" onClick={this.searchCourses}/>
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
  getCursosInfo
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

SearchPanel.contextTypes = { 
  router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, actionCreators)(SearchPanel);