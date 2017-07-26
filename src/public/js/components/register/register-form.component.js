import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {closeModal} from "../../actions/modal";
import {register, removeAuthErrors} from "../../actions/auth";
import setAuthToken from "../../utils/set-auth-token";
import setCurrentUser from "../../actions/auth";
import registerValues from "../../utils/register-values";
import {openModal} from "../../actions/modal";
import ThanksComponent from './thanks.component';
import {removeNewUser} from "../../actions/auth";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class RegisterFormComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        registration_password: '',
        registration_passwordConfirm: '',
        personalData_lastName: '',
        personalData_firstName: '',
        displayName: '',
        registration_emailAddress: '',
        registration_emailAddressConfirm: '',
        professionalData_postalCode: '',
        professionalContactData_phone: '',
        personalData_title: '',
        professionalData_position: '',
        professionalData_specialty: '',
        termsAndCondition_contactConsent: null,
        termsAndCondition_termsAndConditions: null
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  dp(f){
    this.props.dispatch(f);
  }

  onSubmit() {
        //event.preventDefault();
    let formData = this.state.formData;
    this.context.router.push("/");

        //Open this for custom thanks message
    this.props.openModal({
      Component: ThanksComponent,
      dialogSettings: {
        classes: "welcome-box index-modal-box"
      },
      onBeforeClose: () => {
                //this.props.removeNewUser();
      }
    });
  }

  componentWillUnmount() {
    console.log('registeeteter');
        // this.props.removeAuthErrors();
  }

  componentWillMount() {
        
  }

  loadJS(src, callback) {
    let promise = new Promise(function(resolve,reject){
      var script = document.createElement('script');
      let loaded;
      script.setAttribute('src', src);
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('async', true);
      script.onerror = function() {
        callback()
        script.onerror = null;
      };
      script.onload = script.onreadystatechange = function() {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
          callback();
          resolve({});
          script.onload = script.onreadystatechange = null;
        }
      };
      document.getElementsByTagName('head')[0].appendChild(script);
            
    });
    return promise;
  }

  componentDidMount () {
        
    var that = this;
    that.loadJS('vendor/jquery-2.2.4.min.js',function(){}).then(function(){
      that.loadJS('vendor/janrain-init.js',function(){}).then(function(){
        setTimeout(function(){
          janrain.settings.capture.screenToRender = 'traditionalRegistration';
          that.janrainCaptureWidgetOnLoad();
                    
                    // Time out has been added to fix flickering issue returned by Dinesh/Pramod
          setTimeout(function(){
            document.getElementById("register-panel").className = 'show';
            document.getElementById("reg-close-btn").className += ' show';

          },2000);
        },2000);
      });
    });
        //this.janrainCaptureWidgetOnLoad();
        
        
  }

  janrainCaptureWidgetOnLoad() {
    var that = this;
    janrain.events.onCaptureRegistrationSuccess.addHandler(function(res){
            // const accessToken = res.accessToken;
            //     const capture_user = res.userData;
            //     const user = {
            //         uuid: capture_user.uuid,
            //         // personalData_title: capture_user.personalData.title,
            //         // personalData_firstName: capture_user.personalData.firstName,
            //         // personalData_lastName: capture_user.personalData.lastName,
            //         professionalContactData_emailAddress: capture_user.professionalContactData.emailAddress,
            //         // displayName: capture_user.displayName
            //         // professionalContactData_phone: capture_user.professionalContactData.phone,
            //         // professionalData_professionalGroup: capture_user.professionalData.professionalGroup,
            //         // professionalData_specialty: capture_user.professionalData.specialty,
            //         // professionalData_postalCode: capture_user.professionalData.postalCode,
            //         // termsAndConditions_contactConsent: capture_user.termsAndCondition.contactConsent
            //     };

                // const authData = {
                //     accessToken: accessToken,
                //     user: user
                // };
      const authData = {
        isNew: true
      };

            //     setAuthToken(accessToken);

      sessionStorage.setItem('auth', JSON.stringify(authData));
                //that.dp(setCurrentUser(authData));
      that.onSubmit();
            
    });
    janrain.capture.ui.start();
  }

  closepopup(){
    var divClasses1 = document.getElementById("register-panel").classList;
    divClasses1.remove("show");
  }

  render() {
        //'<h1>{* page_register_verification_header *}</h1></div>' +
        //'<p>{* page_register_verification_message *}</p>' +
        //'<div class="capture_footer"><a href="#" onclick="" class="capture_btn capture_primary">Close</a></div>' +
        
    let htmlInput = '<div id="register-panel">' +
                            '<a href="/" class="janrain_modal_closebutton" id="reg-close-btn" onclick="{this.regclosePopup.bind(this)}">' +
                                '<span class="janrain-icon-16 janrain-icon-ex2"></span>' +
                            '</a>' +
                            '<div class="object-container">' +
                                '<div style="display:none;" id="registrationNewVerification">' +
                                    '<div class="capture_header">' +
                                        '<h1>{* page_register_verification_header *}</h1></div>' +
                                '</div>' +
                                '<div style="display:block;" id="traditionalRegistration">' +
                                    '<div class="capture_header">' +
                                        '<h1>{* page_register_traditional_header *}</h1></div>' +
                                    '<p>{* page_register_traditional_message *} <a href="sign-in.html">{* page_register_signin *}</a></p>{* #registrationForm *}' +
                                    '<div class="col-2 form-control-row">' +
                                        '<div class="col">{* personalData_firstName *}</div>' +
                                        '<div class="col">{* personalData_lastName *}</div>' +
                                        '<div class="col">{* personalData_secondLastName *}</div>' +
                                        '<div class="col">{* professionalData_specialty *}</div>' +
                                        '<div class="col">{* professionalData_workCenterName *}</div>' +
                                        '<div class="col">{* professionalData_workCenterType *}</div>' +
                                        '<div class="col">{* professionalData_locality *}</div>' +
                                        '<div class="col">{* professionalData_province *}</div>' +
                                        '<div class="col">{* registration_emailAddress *}</div>' +
                                        '<div class="col">{* registration_emailAddressConfirm *}</div>' +
                                        '<div class="col">{* professionalContactData_phone *}</div>' +
                                        '<div class="col">{* professionalContactData_professionalNumber *}</div>' +
                                        '<div class="col">{* registration_password *}</div>' +
                                        '<div class="col">{* registration_passwordConfirm *}</div>' +
                                        '<div class="accept-sec">{* termsAndCondition_termsAndConditions *}' +
                                            '<span id="registration_termsAndConditionsLabel">' +
                                                'He leído y acepto los <a target="_blank" href="https://www.lillypro.es/privacy"> Términos y Condiciones de Uso</a>, la <a target="_blank" href="https://www.lillypro.es/propiedad-interlectual">Política de Privacidad de datos</a>, la <a target="_blank" href="https://www.lillypro.es/cookies">Política de cookies</a> y el <a target="_blank" href="https://www.lillypro.es/aviso-legal">Copyright</a> .</br>El Usuario responde de la veracidad de los datos facilitados, reservándose LILLY, S.A. el derecho a excluirlos, caso de constatar la falsedad de los mismos.' +
                                            '</span>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="capture_footer">' +
                                        '<div class="capture_left">{* backButton *}</div>' +
                                        '<div class="capture_right">{* createAccountButton *}</div>' +
                                    '</div>' +
                                    '{* /registrationForm *}</div>' +
                                '<div style="display:none;" id="userStatusPostLogin">{* page_access_not_active *}</div>' +
                                '<div style="display:none;" id="countryPostLogin">{* page_access_wrong_country *}</div>' +
                                '<div style="display:none;" id="professionalGroupPostLogin">{* page_access_wrong_group *}</div>' +
                            '</div>' +
                        '</div>';
    let reactElement = htmlToReactParser.parse(htmlInput);
    return (
            <div>
                {reactElement}
            </div>
    );
  }

}

RegisterFormComponent.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const actionCreators = {
  register,
  openModal,
  closeModal,
  removeAuthErrors
};

export default connect(mapStateToProps, actionCreators)(RegisterFormComponent);