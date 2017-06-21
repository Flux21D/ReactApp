import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {getCursosMaterial} from "../../../actions/cursos.details";
import {replaceSVGIcons} from "../../../utils/custom.jquery";

class CourseMaterial extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let sysIds = this.props.courseInfo.materialsUpload && this.props.courseInfo.materialsUpload.map(function(item) {
            return item.sys.id;
        });

        this.props.getCursosMaterial(sysIds).then(function() {
            replaceSVGIcons();
        });
    }

    render() {
        const {cursosDetails} = this.props;
        let materialTitle = '', materialDesc = '', materialModulesArray = [];

        cursosDetails.coursoMaterial.map(function(item) {
            if(item.identifier) {
                materialTitle = item.title;
                materialDesc = item.someLongText;
            }
            else {
                materialModulesArray.push(item);
            }
        });
        
        materialModulesArray = materialModulesArray.sort(function(a, b) {
            return a.sequence - b.sequence;
        });

        let materialModule = materialModulesArray.map(function(item, i) {
            return (
                <div className="material" key={i}>
                    <a title="descargar" className="entrar" href={item.fileAssetUpload} download><span className="cv"><span className="aw"><img className="svg svgW svg25" src="img/icons/cloud-download.svg" title="Icono"/></span>descargar</span></a>
                    <div className="num">{item.sequence}</div>
                    <div className="tipo"><span className="aw"><img className="svg svgG6 svg16" src="img/icons/file-o.svg" title="Icono"/></span><span>{item.materialType}</span></div>
                    <div className="clear"></div>
                    <div className="title">{item.materialDescription}</div>
                </div>
            )
        });

        return (
            <div className="col-left">
                {/* <!-- sub page of the course --> */}
                <div className="sub-page-material">

                    {/* <!-- intro --> */}
                    <h2 className="title-big nmt">{materialTitle}</h2>
                    <p>{materialDesc}</p>
                    
                    <h2 className="title-big">Material descargable</h2>

                    {/* <!-- list of downloads for the teacher --> */}
                    <div className="materiales">
                        {materialModule}
                        <div className="clear"></div>
                    </div>
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getCursosMaterial
};

const mapStateToProps = (state) => {
    return {
        cursosDetails: state.cursosDetails,
        auth: state.auth
    };
};


export default connect(mapStateToProps, actionCreators)(CourseMaterial);