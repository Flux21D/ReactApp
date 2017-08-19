import React from "react";
import ReactDOM from "react-dom";
import {Link} from "react-router";

class HeaderComponent extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="header">
                <div className="LogoContainer">
                    <h1> Ezhil Chits </h1>
                </div>
                <div className="MenuBar">

                </div>
            </div>
        )
    }

};

export default HeaderComponent;