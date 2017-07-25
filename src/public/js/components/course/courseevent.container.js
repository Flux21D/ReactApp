import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import Pagination from "../shared/pagination/pagination.component";
import { getCursosInfo, sortCursos, setFavCursos } from "../../actions/cursos";
import {replaceSVGIcons} from "../../utils/custom.jquery";
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
/* eslint-env es6 */

class CourseEventContainer extends React.Component {
  constructor(props) {
    super(props);

    this.pageNumber = this.pageNumber.bind(this);
    this.sortCourses = this.sortCourses.bind(this);
    this.favCourse = this.favCourse.bind(this);
  }

  state = {
    isFavouriteLocal: []
  };

  componentDidMount() {
    this.refs.txtSortCourse.value = 'Popularidad';
  }

  favCourse(eve) {
    let userInfo = JSON.parse(sessionStorage.getItem('auth'));
    this.props.setFavCursos(userInfo.user.uuid, 'course', eve.sysid);
    this.state.isFavouriteLocal.push(eve.sysid);
    this.setState({isFavouriteLocal: this.state.isFavouriteLocal});
  };

  pageNumber(pageNo) {
    this.refs.txtSortCourse.value = '';
    let queryParams = this.props.cursos.searchParams;
    this.props.getCursosInfo(pageNo, queryParams).then(function() {
      replaceSVGIcons();
    });
  };

  sortCourses(eve) {
    this.props.sortCursos(eve.target.innerHTML, this.props.cursos.courses);
  }

  render() {
    const {cursos} = this.props;
    let locale = "en-us";
    let that = this;
    let favCourseFunc = this.favCourse;

    let courses = cursos.courses.map(function(item, i) {
      let objDate = new Date(item.startDate);
      let date = objDate.getDate();
      let month = objDate.toLocaleString(locale, { month: "short"});
      let favClass = (item.isFavourite || (that.state.isFavouriteLocal.indexOf(item.sysid) !== -1)) ? 'favoritos favCourses' : 'favoritos';

      return (
                            <div className="event" key={i}>
                                <div className="date-modalidad">
                                    {
                                        (item.startDate && item.endDate) ? 
                                        <div className="date">
                                            <div className="day">{date}</div>
                                            <div className="month">{month}</div>
                                        </div>
                                        : null
                                    }
                                    {
                                        item.credits ? 
                                        <div className="creditos">{item.credits}</div>
                                        : null
                                    }
                                    <div className="modalidad">{item.courseType}</div>
                                    <div className={favClass}>
                                        <Link title="Guardar" onClick={() => favCourseFunc(item)}>
                                            <span className="aw">
                                                <img className="svg svgG6" src="img/icons/heart-o.svg" title="Icono"/>
                                            </span> Guardar
                                        </Link>
                                    </div>
                                </div>
                                <div className="txt">
                                    <div className="place"><Link title="Curso" to={{ pathname: '/coursedetail', state: item }}>{item.firstLine}</Link></div>
                                    <h3 className="title"><Link title={item.courseTitle} to={{ pathname: '/coursedetail', state: item }}>{item.courseTitle}</Link></h3>
                                    <p className="info"><Link title={item.courseTitle} to={{ pathname: '/coursedetail', state: item }}>{item.courseDescription}</Link></p>
                                    <div className="more"><Link title="Ver más" to={{ pathname: '/coursedetail', state: item }}>Ver más <span className="aw"><img className="svg svgR" src="img/icons/angle-right.svg" title="Icono"/></span></Link></div>
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
                                <div onClick={this.sortCourses}>Popularidad</div>
                                <div onClick={this.sortCourses}>Nombre</div>
                                <div onClick={this.sortCourses}>Fecha</div>
                            </div>
                            <input className="text select select-tight" type="text" placeholder="Tipo de evento" name="tipo" ref='txtSortCourse'/>
                        </div>
                    </div>
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18 " src="img/icons/mortar-board.svg" title="Icono"/></span> Cursos encontrados</h2>
                    <div className="events">
                        {
                            courses.length > 0 ? courses : <div><h2>No se han encontrado resultados</h2></div>
                        }
                    </div>
                    <div className="clear"></div>

                    <Pagination totalRecords={cursos.totalCoursesCount} pageNumber={this.pageNumber} activePageNo={cursos.activePageNo} />
                </div>
            </div>
    );
  }

}

const actionCreators = {
  getCursosInfo,
  sortCursos,
  setFavCursos
};

const mapStateToProps = (state) => {
  return {
    cursos: state.cursos,
    auth: state.auth
  };
};

export default connect(mapStateToProps, actionCreators)(CourseEventContainer);