import React from "react";
import CookieComponent from "./components/shared/cookie";
import {connect} from "react-redux";
import hideCookie from "./actions/cookie";
import {withRouter} from "react-router";
import HeaderComponent from "./components/shared/header/header.component";
import FooterComponent from "./components/shared/footer/footer.component";
import {customClick} from "./utils/gtm";
import Modal from "./components/shared/modal/modal";

const webTab = [ '/:Login:Home',
  '/home:Home',
  '/cursos:Cursos',
  '/coursedetail:Curso',
  '/calendario:Calendario',
  '/herramientas:Herramientas cl�nicas',
  '/faq:Preguntas Frecuentes',
  '/contact:Contactar',
  '/myprofile:Mi perfil',
  '/about:Qui�nes somos',
  '/webMap:Mapa Web',
  '/acreditacion:Acreditaci�n'
];

function getTitle(path, auth) {
  for(let k = 0; k < webTab.length; k++) {
    let entry = webTab[k].split(':');
    
    if(entry[0].toLowerCase() == path.toLowerCase()) {
      if(path.toLowerCase() === '/' && auth)
        return entry[2]
      else
            return entry[1];
    }
  }
}

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
  }
  componentDidMount () {
        // customClick({
        //   'test' : 'abc'
        // });
  }
  render() {
    const {modal, location, auth} = this.props;
    document.title = 'Aula Diabetes - ' + getTitle(location.pathname, auth.accessToken);
    let classes = modal.Component ? 'my-modal-open' : ' ';

    return (
            <div id="main-content" className={classes}>
                {modal.Component ? <Modal /> : null}
                <HeaderComponent showHeader={location.pathname === '/acreditacion' ? true : false}/>
                    {this.props.children}
                <FooterComponent showFooter={location.pathname === '/acreditacion' ? true : false}/>
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth:state.auth,
    modal:state.modal
  }
};

export default withRouter(connect(mapStateToProps)(AppComponent));