import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {getFooterInfo, getTermsInfo} from "../../../actions/footer";

class FooterComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getFooterInfo();
    this.props.getTermsInfo();
  }

  render() {  
    return (
            <footer style={{display: this.props.showFooter ? 'none' : 'block'}}>
                <div className="content">
                    <div className="left-col">
		    	{/* {this.props.footer.copyrightText} */}
                        <p><a title="Copyright" href="https://pages.mc.lilly.com/page.aspx?QS=472529ec60bdf32adf3e609c506a0c8d78e1d52968acc1a11c588d3915564c01" target="_blank">Copyright &copy; 2017 Eli Lilly and Company</a>. Todos los derechos reservados.
                            <br className="only-desktop" /> Esta p&#225;gina Web ha sido publicada por Lilly, S.A.U. Enero de 2017 &#8211; ESXXXXXXXX</p>
                    </div>
                    <div className="right-col">
                        <span className="nobreak"><a target="_blank" title="T�rminos y condiciones" href="https://pages.mc.lilly.com/page.aspx?QS=472529ec60bdf32a0b05d7aed00dc392aad7b41b0f5a85bccd5b72cc006e0ded">T&#233;rminos y condiciones</a></span> |
                        <span className="nobreak"><a target="_blank" title="Pol�tica de privacidad" href="https://pages.mc.lilly.com/page.aspx?QS=472529ec60bdf32a6b7c20d354e562edbb0aaee1b1b2bd088d2337a7429c1be1"> Pol&#237;tica de privacidad</a></span> |
                        <span className="nobreak"><a target="_blank" title="Pol�tica de cookies" href="https://pages.mc.lilly.com/page.aspx?QS=472529ec60bdf32a93981243b38aec88fd2b25d88a5743cb6a319f6361880642"> Pol&#237;tica de cookies</a></span>
                        { this.props.auth.accessToken ? (<span className="nobreak"><Link to="/webMap"> | Mapa web</Link></span> ) : '' } 
                        { this.props.auth.accessToken ? <span className="nobreak"><Link to="/about"> | Qui&#233;nes somos</Link></span> : '' }
                    </div>
                    <div className="clear"></div>
                </div>
            </footer> 
    );
  }
}

const actionCreators = {
  getFooterInfo,
  getTermsInfo
};

const mapStateToProps = (state) => {
  return {
    footer: state.footer,
    terms: state.terms,
    auth: state.auth
  };
};

export default connect(mapStateToProps, actionCreators)(FooterComponent);