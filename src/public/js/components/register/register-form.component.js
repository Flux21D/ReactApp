import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {closeModal} from "../../actions/modal";
import {register, removeAuthErrors} from "../../actions/auth";
import setAuthToken from "../../utils/set-auth-token";
import setCurrentUser from "../../actions/auth";
import registerValues from "../../utils/register-values";

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
        this.context.router.push("register/thanks");
        
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
        janrain.events.onCaptureRegistrationSuccess.addHandler(function(result){
            const accessToken = res.accessToken;
                const capture_user = res.userData;
                const user = {
                    uuid: capture_user.uuid,
                    // personalData_title: capture_user.personalData.title,
                    // personalData_firstName: capture_user.personalData.firstName,
                    // personalData_lastName: capture_user.personalData.lastName,
                    professionalContactData_emailAddress: capture_user.professionalContactData.emailAddress,
                    // displayName: capture_user.displayName
                    // professionalContactData_phone: capture_user.professionalContactData.phone,
                    // professionalData_professionalGroup: capture_user.professionalData.professionalGroup,
                    // professionalData_specialty: capture_user.professionalData.specialty,
                    // professionalData_postalCode: capture_user.professionalData.postalCode,
                    // termsAndConditions_contactConsent: capture_user.termsAndCondition.contactConsent
                };

                const authData = {
                    accessToken: accessToken,
                    user: user
                };

                setAuthToken(accessToken);


                sessionStorage.setItem('auth', JSON.stringify(authData));
                that.dp(setCurrentUser(authData));
                that.onSubmit();
            
        });
        janrain.capture.ui.start();
    }

    closepopup(){
        var divClasses1 = document.getElementById("register-panel").classList;
        divClasses1.remove("show");
    }

    render() {

        let htmlInput = '<div style="display:none;" id="signIn"><div class="capture_header signin-title"><h1>{* page_signin_signin_header *}</h1></div><div class="capture_signin">{* #userInformationForm *}{* traditionalSignIn_emailAddress *}{* traditionalSignIn_password *}<div class="capture_form_item forgotpwd"><a href="#" data-capturescreen="forgotPassword" id="forgotpwd-link" onclick="{this.forgotPasswordClick.bind(this)}">{* page_signin_signin_forgot *}</a></div><div class="capture_footer"><div class="capture_left"><a href="#" id="back-btn" onclick="{this.backBtnFunc.bind(this)}"> Cancel </a></div><div class="capture_right">{* traditionalSignIn_signInButton *}</div></div>{* /userInformationForm *}</div><p class="register">Not a member yet? <a class="text-orange" href="/register" id="reg-btn" onClick="{this.loadPage}">Register now</a></p><a href="#" class="janrain_modal_closebutton" id="close-btn" onclick="{this.closePopup.bind(this)}"><span class="janrain-icon-16 janrain-icon-ex2"></span></a></div></div><div id="login-overlay"> </div><div style="display:none;" id="returnSocial"><div class="capture_header"><h1>{* page_signin_returnSocial_header *}</h1></div><div class="capture_signin"><h2>{* page_signin_returnSocial_header2 *} {* welcomeName *}!</h2>{* loginWidget *}<div class="capture_centerText switchLink"><a href="#" data-cancelcapturereturnexperience="true">{* page_signin_returnSocial_useAnother *}</a></div></div></div><div style="display:none;" id="returnTraditional"><div class="capture_header"><h1>{* page_signin_returnTraditional_header *}</h1></div><h2 class="capture_centerText"><span id="traditionalWelcomeName">{* page_signin_returnTraditional_header2 *}</span></h2><div class="capture_backgroundColor">{* #userInformationForm *}{* traditionalSignIn_emailAddress *}{* traditionalSignIn_password *}<div class="capture_form_item capture_rightText">{* traditionalSignIn_signInButton *}</div>{* /userInformationForm *}<div class="capture_centerText switchLink"><a href="#" data-cancelcapturereturnexperience="true">{* page_signin_returnTraditional_useAnother *}</a></div></div></div><div style="display:none;" id="socialRegistration"><div class="capture_header"><h1>{* page_signin_socialRegistration_header *}</h1></div><h2>{* page_signin_socialRegistration_header2 *}</h2>{* #socialRegistrationForm *}{* socialRegistration_firstName *}{* socialRegistration_lastName *}{* socialRegistration_emailAddress *}{* page_signin_socialRegistration_terms_label_1 *} <a href="#">{* page_signin_socialRegistration_terms_link *}</a> {* page_signin_socialRegistration_terms_label_2 *} <a href="#">{* page_signin_socialRegistration_privacy_link *}</a>.<div class="capture_footer"><div class="capture_left">{* backButton *}</div><div class="capture_right">{* socialRegistration_signInButton *}</div></div>{* /socialRegistrationForm *}</div><div style="display:none;" id="forgotPassword"><div class="capture_header"><h1>{* page_signin_forgotPassword_header *}</h1></div><h2>{* page_signin_forgotPassword_header2 *}</h2>{* #forgotPasswordForm *}{* traditionalSignIn_emailAddress *}<div class="capture_footer"><div class="capture_right">{* forgotPassword_sendButton *}</div></div>{* /forgotPasswordForm *}</div><div style="display:none;" id="forgotPasswordSuccess"><div class="capture_header"><h1>{* page_signin_forgotPasswordSuccess_header *}</h1></div><p>{* page_signin_forgotPasswordSuccess_message *}</p><div class="capture_footer"><a href="#" data-capturescreen="signIn" class="capture_btn capture_primary">{* page_signin_forgotPasswordSuccess_signin *}</a></div></div><div style="display:none;" id="mergeAccounts">{* mergeAccounts *}</div><div style="display:none;" id="traditionalAuthenticateMerge"><div class="capture_header"><h1>{* page_signin_traditionalAuthenticateMerge_header *}</h1></div><div class="capture_signin">{* #tradAuthenticateMergeForm *}{* traditionalSignIn_emailAddress *}{* mergePassword *}<div class="capture_footer"><div class="capture_left">{* backButton *}</div><div class="capture_right">{* traditionalSignIn_signInButton *}</div></div>{* /tradAuthenticateMergeForm *}</div></div><div style="display:none;" id="userStatusPostLogin">{* page_access_not_active *}</div><div style="display:none;" id="countryPostLogin">{* page_access_wrong_country *}</div><div style="display:none;" id="professionalGroupPostLogin">{* page_access_wrong_group *}</div><div id="register-panel"><a href="/" class="janrain_modal_closebutton" id="reg-close-btn" onclick="{this.regclosePopup.bind(this)}"><span class="janrain-icon-16 janrain-icon-ex2"></span>    </a><div class="object-container"><div style="display:none;" id="registrationNewVerification"><div class="capture_header"><h1>{* page_register_verification_header *}</h1></div><p>{* page_register_verification_message *}</p><div class="capture_footer"><a href="#" onclick="" class="capture_btn capture_primary">Close</a></div></div><div style="display:block;" id="traditionalRegistration"><div class="capture_header"><h1>{* page_register_traditional_header *}</h1></div><p>{* page_register_traditional_message *} <a href="sign-in.html">{* page_register_signin *}</a></p>{* #registrationForm *}<div class="col-2 form-control-row"><div class="col">{* personalData_title *}</div><div class="col">{* professionalData_position *}</div></div><div class="col-2 form-control-row"><div class="col">{* personalData_firstName *}</div><div class="col">{* professionalData_specialty *}</div></div><div class="col-2 form-control-row"><div class="col">{* personalData_lastName *}</div><div class="col">{* professionalData_postalCode *}</div></div><div class="col-2 form-control-row"><div class="col">{* registration_emailAddress *}</div><div class="col">{* registration_password *}</div></div><div class="col-2 form-control-row"><div class="col">{* registration_emailAddressConfirm *}</div><div class="col">{* registration_passwordConfirm *}</div></div><div class="col-2 form-control-row"><div class="col">{* professionalContactData_phone *}</div><div class="col">{* termsAndCondition_termsAndConditions *}<span id="registration_termsAndConditionsLabel">{* page_register_terms_label_1 *} <a href="/terms-and-conditions">{* page_register_terms_link *}</a> {* page_register_terms_label_2 *} <a href="/privacy-policy">{* page_register_privacy_link *}</a>.</span></div></div><div class="contact-text">{* page_register_contactConsent_message *}</div>{* termsAndCondition_contactConsent *}<div class="capture_footer"><div class="capture_right">{* createAccountButton *}</div></div>{* /registrationForm *}</div><div style="display:none;" id="userStatusPostLogin">{* page_access_not_active *}</div><div style="display:none;" id="countryPostLogin">{* page_access_wrong_country *}</div><div style="display:none;" id="professionalGroupPostLogin">{* page_access_wrong_group *}</div></div></div>';
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
    closeModal,
    removeAuthErrors
};

export default connect(mapStateToProps)(RegisterFormComponent);