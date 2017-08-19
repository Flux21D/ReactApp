import {createStore,applyMiddleware,compose} from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers/index";

const store = createStore(
    rootReducer,
    compose (applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => {return f})
)

export default store;