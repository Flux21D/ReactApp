import React  from "react";
import ReactDOMServer from 'react-dom/server'
import {connect} from "react-redux";
import {Link} from "react-router";
import {login, removeAuthErrors} from "../../actions/auth";
import setAuthToken from "../../utils/set-auth-token";
import setCurrentUser from "../../actions/auth";
import $ from "jquery";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class EditForm extends React.Component {

  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    this.checkForChanges = this.checkForChanges.bind(this);
  }

  checkForChanges() {
    var that = this;
    if ($('body').find('#capture_editProfile_saveButton').length > 0 && !$('.capture_save_success').attr('style')) {
      console.log("found");
      that.saveChanges();
    } else {
      setTimeout(that.checkForChanges, 500);
    }
  }

  saveChanges(){
    var that = this;
    $.ajax({url: "/api/getuserinfo?AccessToken="+that.props.auth.accessToken, 
      method: "GET",
      success: function(result){
        var obj = JSON.parse(result);
        console.dir(obj);
        const user = {
          uuid: obj.result.uuid,
          personalData_title: obj.result.personalData.title,
          personalData_firstName: obj.result.personalData.firstName,
          personalData_lastName: obj.result.personalData.lastName,
          professionalContactData_emailAddress: obj.result.professionalContactData.emailAddress,
          professionalContactData_phone: obj.result.professionalContactData.phone,
          professionalData_professionalGroup: obj.result.professionalData.professionalGroup,
          professionalData_specialty: obj.result.professionalData.specialty,
          professionalData_postalCode: obj.result.professionalData.postalCode,
          termsAndCondition_contactConsent: obj.result.termsAndCondition.contactConsent
        };


        const authData = {
          accessToken: that.props.auth.accessToken,
          user: user
        };

        setAuthToken(that.props.auth.accessToken);
        sessionStorage.setItem('auth', JSON.stringify(authData));
        that.props.setCurrentUser(authData);
                                        
      }
    });
  }

  componentDidMount () {
    var that = this;
    that.loadJS('vendor/jquery-2.2.4.min.js',function(){}).then(function(){
      that.loadJS('vendor/janrain-init.js',function(){}).then(function(){
        setTimeout(function(){
          janrain.settings.capture.screenToRender = 'editProfile';
          janrain.settings.capture.flowName = 'lilly_pro_es';
          that.janrainCaptureWidgetOnLoad();
          that.checkForChanges();

        },2000);
      });
    });
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


  janrainCaptureWidgetOnLoad() {
    let that = this;
        // register custom client-side valididators
    janrain.capture.ui.registerFunction('passwordValidation', janrainCustomPasswordValidation);
    janrain.capture.ui.registerFunction('postalCodeValidation', janrainCustomPostalCodeValidation);
        // janrain.settings.capture.screenToRender = 'traditionalRegistration';
        // should be the last line in janrainCaptureWidgetOnLoad()
    janrain.capture.ui.start();
  }

    
  render () {
    let htmlInput = '<div class="content content-form">' + 
                        '<div class="title-big nmt">Modifique sus datos</div>' +
                        '<div style="display:none;" id="editProfile" class="content content-form">' +
                            '<div class="capture_grid_block">' +
                                
                                '<div class="capture_col_8">' +
                                    '<h3>{* page_edit_account_header *}</h3>' +
                                    '<div class="contentBoxWhiteShadow">' +
                                        '<div class="capture_grid_block">' +
                                            '<div class="capture_center_col">' +
                                                '<div class="capture_editCol">{* editProfileForm *}' +
						'<div className="column col-4">{* personalData_firstName *}</div>' +
						'<div className="column col-4">{* personalData_lastName *}</div>'+
			                        '<div className="column col-4">{* personalData_secondLastName *}</div>'+
			                        '<div className="column col-4">{* professionalData_specialty *}</div>'+
			                        '<div className="column col-4">{* professionalData_workCenterName *}</div>'+
			                        '<div className="column col-4">{* professionalData_workCenterType *}</div>'+
			                        '<div className="column col-4">{* professionalData_locality *}</div>'+
			                        '<div className="column col-4">{* professionalData_province *}</div>'+
			                        '<div className="column col-4">{* professionalContactData_email *}</div>'+
			                        '<div className="column col-4">{* professionalContactData_phone *}</div>'+
			                        '<div className="column col-4">{* professionalContactData_professionalNumber *}</div>' +
			                        '<div class="capture_form_item column col-4">{* saveButton *}{* savedProfileMessage *}</div>{* /editProfileForm *}</div>' +
                                            '</div>' +
                                            '<div class="forgot-password">' +
                                    '<h3 class="janrain_traditional_account_only">{* page_edit_password_header *}</h3>' +
                                    '<div class="janrain_traditional_account_only contentBoxWhiteShadow"><a href="#" data-capturescreen="changePassword">{* page_edit_password_change *}</a></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="note">Si desea modificar su especialidad póngase en <a title="Contacto" href="/contact">contacto con nosotros</a></div>' +
                        '</div>' +
                        '<div style="display:none;" id="changePassword">' +
                            '<div class="capture_header">' +
                                '<h1>{* page_edit_password_change *}</h1></div>{* newPasswordFormProfile *}{* oldpassword *}{* newpassword *}{* newpasswordConfirm *}' +
                            '<div class="capture_footer">{* saveButton *}</div>{* /newPasswordFormProfile *}</div>' +
                        '<div style="display:none;" id="changePasswordSuccess">' +
                            '<div class="capture_header">' +
                                '<h1>{* page_edit_password_success_header *}</h1></div>' +
                            '<p>{* page_edit_password_success_message *}</p>' +
                            '<div class="capture_footer"><a href="#" onclick="janrain.capture.ui.modal.close()" class="capture_btn capture_primary">{* page_button_close *}</a></div>' +
                        '</div>' +
                      '</div>';
    let reactElement = htmlToReactParser.parse(htmlInput);
    return (
        <div >
          {reactElement}
        </div>
    );
  }
}

EditForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const actionCreators = {
  setCurrentUser
};

export default connect(mapStateToProps,actionCreators)(EditForm);