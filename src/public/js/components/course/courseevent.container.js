import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import Pagination from "../shared/pagination/pagination.component";
import { getCursosInfo, sortCursos, setFavCursos } from "../../actions/cursos";

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

    favCourse(eve) {
        let userInfo = JSON.parse(sessionStorage.getItem('auth'));
        this.props.setFavCursos(userInfo.user.uuid, 'course', eve.sysid);
        this.state.isFavouriteLocal.push(eve.sysid);
        this.setState({isFavouriteLocal: this.state.isFavouriteLocal});
    };

    pageNumber(pageNo) {
        this.refs.sortCourse.value = '';
        let queryParams = this.props.cursos.searchParams;
        this.props.getCursosInfo(pageNo, queryParams).then(function() {
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
                                        item.courseType !== 'Presencial' ? 
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
                            <input className="text select select-tight" type="text" placeholder="Tipo de evento" name="tipo" ref='sortCourse'/>
                        </div>
                    </div>
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18 " src="img/icons/mortar-board.svg" title="Icono"/></span> Cursos encontrados</h2>
                    <div className="events">
                        {courses}
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