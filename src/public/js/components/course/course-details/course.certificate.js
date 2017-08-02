import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import JSPDF from "jspdf";
import html2canvas from "html2canvas";
import {replaceSVGIcons} from "../../../utils/custom.jquery";

class CourseCertificate extends React.Component {
  constructor(props) {
    super(props);
    this.userName = '';

    this.goBackBtnHandler = this.goBackBtnHandler.bind(this);
    this.downloadCertificate = this.downloadCertificate.bind(this);
    this.createPDF = this.createPDF.bind(this);
    this.getCanvas = this.getCanvas.bind(this);
  }

  componentDidMount() {
    replaceSVGIcons();
  }

  componentWillMount() {
    let userInfo = JSON.parse(sessionStorage.getItem('auth'));
    this.userName = userInfo.user.personalData_firstName + ' ' + userInfo.user.personalData_lastName
  }

  goBackBtnHandler() {
    let courseObj = this.props.location.state; 
    let pathName = (courseObj.sourcePath && courseObj.sourcePath === 'course') ? '/coursedetail' : '/myprofile';
    this.context.router.push({ 
      pathname: pathName,
      state: courseObj
    });
  }

  downloadCertificate() {
    $('body').scrollTop(0);
    this.createPDF();
  }

  createPDF() {
    let that = this;
    let downloadArea = $('.downloadSection');
    $('.downloadSection').clone().appendTo($('.cloneArea'));
    let cloneArea = $('.cloneArea');
    let cache_width = downloadArea.width();

    this.getCanvas(cloneArea).then(function(canvas) {
      let img = canvas.toDataURL("image/png"),
        doc = new jsPDF({
                    //l => landscape, p => portroit
          orientation: 'l',
          unit: 'px',
          format: 'a4'
        });
      doc.addImage(img, 'JPEG', 20, 20);
      doc.save('certificate.pdf');
      cloneArea.width(cache_width);
    });
  }

  getCanvas(cloneArea) {
        //let a4 = [595.28, 841.89]; // for portroit mode
    let a4 = [841.89, 595.28]; // for landscape mode
    cloneArea.width((a4[0] * 1.33333) - 80).css('max-width', 'none');
    return html2canvas(cloneArea, {
      onrendered: function(canvas) {},
      timeout: 0,
      removeContainer: true
    });
  }

  render() {
    const {location} = this.props;
    let courseName = location.state.sourcePath === 'course' ? location.state.courseTitle : location.state.name;
    let courseDate = location.state.sourcePath === 'course' ? location.state.courseCompletionDate : (new Date(location.state.date_performed).toLocaleDateString());
        
    return (
            <section className="section-acreditacion">
                <div className="page section-acreditacion downloadSection" style={{zIndex: 1, position: "absolute", top: "0px", left: "0px", width: "100%", height: "600px"}}>
                    {/* <!-- user diploma --> */}
                    <div className="diploma">
                        <div className="title">Diploma</div>
                        <div className="name">{this.userName}</div>
                        <div className="superado">Ha superado el curso</div>
                        <div className="curso">"{courseName}"</div>
                        <div className="text">Realizado el dia {courseDate}
                            <br/> Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus</div>
                        <div className="logos">
                            <span className="logo1">
                            <img src="img/ux/logo-lilly-red.png" alt="Lilly"/>       
                        </span>
                            <span className="logo2">
                            <div className="firma">Firma del profesor</div>
                            <img src="img/ux/firma.png" alt="Firma" />
                        </span>
                        </div>
                        <div className="clear"></div>
                    </div>
                    <br/>
                    <br/>
                    <div className="tools center">
                        <Link title="Volver" className="button tight mt10" onClick={this.goBackBtnHandler}><span className="aw"><img className="svg svgW" src="img/icons/angle-left.svg" title="Icono"/></span> Volver</Link>
                        <a title="Descargar acreditación" className="button tight" onClick={this.downloadCertificate}>
                            <div className="aw"><img className="svg svgW" src="img/icons/external-link-square.svg" title="Icono" /></div> Descargar acreditación</a>
                        <a title="Imprimir acreditación" className="button tight" href="javascript:window.print(); void 0;"><span className="aw"><img className="svg svgW" src="img/icons/mortar-board.svg" title="Icono"/></span> Imprimir acreditación</a>
                    </div>
                </div>
                {/* <!-- Added Clone Area --> */}
                <div className="cloneArea" style={{zIndex: -1, opacity: "0", position: "absolute", top: "0px", left: "0px", width: "100%", height: "600px"}}></div>
                {/* <!-- Ended --> */}
            </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

CourseCertificate.contextTypes = { 
  router: React.PropTypes.object.isRequired
} 


export default connect(mapStateToProps)(CourseCertificate);