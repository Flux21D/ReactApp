import {SET_CURRENT_USER, REMOVE_CURRENT_USER, SET_AUTH_ERRORS, REMOVE_AUTH_ERRORS, REMOVE_NEW_USER, UPDATE_CURRENT_USER} from "./types";
import store from "../utils/store";
import axios from "axios";
import setAuthToken from "../utils/set-auth-token";
import extend from "lodash/extend";

export default function setCurrentUser(data) {
    return {
        type: SET_CURRENT_USER,
        data
    };
};

export function updateCurrentUser (data) {
    return {
        type: UPDATE_CURRENT_USER,
        data
    };
}

export function setAuthErrors(errors) {
    return {
        type: SET_AUTH_ERRORS,
        errors
    };
}

export function removeNewUser() {
    return {
        type: REMOVE_NEW_USER
    };
}

export function removeAuthErrors() {
    return {
        type: REMOVE_AUTH_ERRORS
    };
}

export function removeCurrentUser() {
    return {
        type: REMOVE_CURRENT_USER
    };
}

export function logout() {
    sessionStorage.removeItem("auth");
    const request = axios.get('/logout');
    
    return dispatch => {
        dispatch(removeCurrentUser());
    };

}

export function setAuthData() {
    let authData = sessionStorage.getItem("auth");

    if (authData) {
        authData = JSON.parse(authData);

        setAuthToken(authData.accessToken);

        store.dispatch(setCurrentUser(authData));
    }
}

export function forgotPassword(data) {
    return dispatch => {
        const request = axios.post('/api/forgot-password', data);

        request.then(res => {

            if (res.data.stat === "ok") {
                dispatch(setAuthErrors({
                    errors: {}
                }));
            } else {
                dispatch(setAuthErrors({
                    errors: res.data.invalid_fields
                }));
            }

        }).catch(error => {
            return console.log(error)
        });

        return request;
    };
}

export function resetPassword(data) {
    return dispatch => {
        const request = axios.post('/api/reset-password', data);

        request.then(res => {

            if (res.data.stat === "ok") {
                dispatch(setAuthErrors({
                    errors: {}
                }));
            } else {
                dispatch(setAuthErrors({
                    errors: res.data.invalid_fields
                }));
            }

        }).catch(err => {

        });

        return request;
    };
}

export function verifyEmail(data) {
    return dispatch => {
        const request = axios.post('/api/verify-email', data);

        request.then(res => {
        }).catch(err => {
        });

        return request;
    };
}

export function login(data) {

    return dispatch => {
        const request = axios.post('/api/login', data);

        request.then(res => {

            if (res.data.stat === "ok") {
                const accessToken = res.data.access_token;
                const capture_user = res.data.capture_user;
                const user = {
                    uuid: capture_user.uuid,
                    personalData_title: capture_user.personalData.title,
                    personalData_firstName: capture_user.personalData.firstName,
                    personalData_lastName: capture_user.personalData.lastName,
                    professionalContactData_emailAddress: capture_user.professionalContactData.emailAddress,
                    professionalContactData_phone: capture_user.professionalContactData.phone,
                    professionalData_professionalGroup: capture_user.professionalData.professionalGroup,
                    professionalData_specialty: capture_user.professionalData.specialty,
                    professionalData_postalCode: capture_user.professionalData.postalCode,
                    termsAndCondition_contactConsent: capture_user.termsAndCondition.contactConsent
                };

                const authData = {
                    accessToken: accessToken,
                    user: user
                };

                setAuthToken(accessToken);

                sessionStorage.setItem('auth', JSON.stringify(authData));

                dispatch(setCurrentUser(authData));
            } else {
                dispatch(setAuthErrors({
                    errors: res.data.invalid_fields
                }));
            }

        }).catch(error => {
            return console.log(error)
        });

        return request;
    };

}

export function register(userData) {

    return dispatch => {
        const request = axios.post("api/register", userData);
        request.then(res => {

            if (res.data.stat === 'ok') {
                const accessToken = res.data.access_token;
                const capture_user = res.data.capture_user;
                const user = {
                    uuid: capture_user.uuid,
                    personalData_title: capture_user.personalData.title,
                    personalData_firstName: capture_user.personalData.firstName,
                    personalData_lastName: capture_user.personalData.lastName,
                    professionalContactData_emailAddress: capture_user.professionalContactData.emailAddress,
                    professionalContactData_phone: capture_user.professionalContactData.phone,
                    professionalData_professionalGroup: capture_user.professionalData.professionalGroup,
                    professionalData_specialty: capture_user.professionalData.specialty,
                    professionalData_postalCode: capture_user.professionalData.postalCode,
                    termsAndCondition_contactConsent: capture_user.termsAndCondition.contactConsent
                };

                const authData = {
                    accessToken: accessToken,
                    user: user,
                    isNew: true
                };

                setAuthToken(accessToken);

                sessionStorage.setItem('auth', JSON.stringify(authData));

                dispatch(setCurrentUser(authData));
            } else {
                dispatch(setAuthErrors({
                    errors: res.data.invalid_fields
                }));
            }

        }).catch(error => {
        });
        return request;
    };

}

export function updateUser (data) {
    return dispatch => {
        const request = axios.put("api/update-user", data);

        request.then(res => {

            if (res.data.stat === "ok") {

                let auth = JSON.parse(sessionStorage.getItem('auth'));

                let {user} = auth;

                user = extend(user, data);

                auth.user = user;

                sessionStorage.setItem("auth", JSON.stringify(auth));

                dispatch(updateCurrentUser(data));
            }

        }).catch(err => {

        });

        return request;
    }
}