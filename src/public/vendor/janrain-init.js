/*
Janrain initializations and settings for JUMP.

For more information about these settings, see the following documents:

    http://developers.janrain.com/documentation/widgets/social-sign-in-widget/social-sign-in-widget-api/settings/
    http://developers.janrain.com/documentation/widgets/user-registration-widget/capture-widget-api/settings/
    http://developers.janrain.com/documentation/widgets/social-sharing-widget/sharing-widget-js-api/settings/
*/

(function() {
    if (typeof window.janrain !== 'object') window.janrain = {};
    window.janrain.settings = {};
    window.janrain.settings.capture = {};
    window.janrain.settings.debug={};

    janrain.settings.packages = ['login', 'capture'];

    // --- Engage Widget -------------------------------------------------------

    janrain.settings.language = 'es-ES';
    janrain.settings.appUrl = 'https://elililly-dev.rpxnow.com';
    janrain.settings.tokenUrl = 'http://localhost:8080/';
    janrain.settings.tokenAction = 'event';
    janrain.settings.borderColor = '#ffffff';
    janrain.settings.fontFamily = 'Helvetica, Lucida Grande, Verdana, sans-serif';
    janrain.settings.width = 300;
    janrain.settings.actionText = ' ';
    janrain.settings.type = 'modal';
    janrain.settings.debug.enabled=true;

    // --- Capture Widget ------------------------------------------------------

    janrain.settings.capture.appId = 'm2uqcsxt5rmhjqf7dbqxbgsbzn';
    janrain.settings.capture.captureServer = 'https://elililly-dev.janraincapture.com';
    janrain.settings.capture.redirectUri = 'http://localhost:8080/';
    janrain.settings.capture.clientId = '28pc8dxjtvsxun8b7mg95px9883hvzxg';
    janrain.settings.capture.flowName = 'lilly_pro_es';
    janrain.settings.capture.registerFlow = 'socialRegistration';
    janrain.settings.capture.setProfileCookie = true;
    janrain.settings.capture.keepProfileCookieAfterLogout = false;
    janrain.settings.capture.modalCloseHtml = '<span class="janrain-icon-16 janrain-icon-ex2"></span>';
    janrain.settings.capture.noModalBorderInlineCss = true;
    janrain.settings.capture.responseType = 'token';
    janrain.settings.capture.stylesheets = ['styles/janrain.css'];
    janrain.settings.capture.mobileStylesheets = ['styles/janrain-mobile.css'];
    janrain.settings.capture.hasSettings = false;
    janrain.settings.capture.thinRegistration = true;
        
    // --- Mobile WebView ------------------------------------------------------

    //janrain.settings.capture.redirectFlow = true;
    //janrain.settings.popup = false;
    //janrain.settings.tokenAction = 'url';
    //janrain.settings.capture.registerFlow = 'socialMobileRegistration'

    // --- Federate  -----------------------------------------------------------

    //janrain.settings.capture.federate = true;
    //janrain.settings.capture.federateServer = '';
    //janrain.settings.capture.federateXdReceiver = '';
    //janrain.settings.capture.federateLogoutUri = '';
    //janrain.settings.capture.federateLogoutCalllback = function() {};
    //janrain.settings.capture.federateEnableSafari = false;

    // --- Backplane -----------------------------------------------------------

    //janrain.settings.capture.backplane = true;
    //janrain.settings.capture.backplaneBusName = '';
    //janrain.settings.capture.backplaneVersion = 2;
    //janrain.settings.capture.backplaneBlock = 20;

    // --- Share widget --------------------------------------------------------

    //janrain.settings.share = {};
    //janrain.settings.packages.push('share');
    //janrain.settings.share.message = "";
    //janrain.settings.share.title = "";
    //janrain.settings.share.url = "";
    //janrain.settings.share.description = "";

    // --- Load URLs -----------------------------------------------------------

    var httpsLoadUrl = "https://rpxnow.com/load/elililly-dev";
    var httpLoadUrl = "http://widgets-cdn.rpxnow.com/load/elililly-dev";

    var httpsShareLoadUrl = "https://rpxnow.com/js/lib/elililly-dev/share_beta.js'";
    var httpShareLoadUrl = "http://widget-cdn.rpxnow.com/js/lib/elililly-dev/share_beta.js";

    // --- DO NOT EDIT BELOW THIS LINE -----------------------------------------

    function isReady() { janrain.ready = true; };
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", isReady, false);
    } else {
        window.attachEvent('onload', isReady);
    }

    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.id = 'janrainAuthWidget';
    if (document.location.protocol === 'https:') {
        e.src = httpsLoadUrl;
    } else {
        e.src = httpLoadUrl;
    }
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);

    if (typeof window.janrain.settings.share === 'object') {
        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.id = 'janrainWidgets';
        if (document.location.protocol === 'https:') {
            e.src = httpsShareLoadUrl;
        } else {
            e.src = httpShareLoadUrl;
        }
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(e, s);
    }
})();

/*
Custom regex for client-side password validation. Server side validation is also
enforced via Capture settings.
*/
function janrainCustomPasswordValidation(name, value) {
    return /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/.test(value);
}

function janrainCustomPostalCodeValidation(name, value) {
    return /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) {0,1}[0-9][A-Za-z]{2})$/.test(value);
}
