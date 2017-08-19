import {SET_CURRENT_USER} from "./types";
import store from "../utils/store";
import extend from "lodash/extend";

export default function setCurrentUser(data) {
    return {
        type: SET_CURRENT_USER,
        data
    };
};