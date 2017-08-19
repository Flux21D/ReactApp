import React from "react";
import ReactDOM from "react-dom";
import {Link} from "react-router";

class FooterComponent extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="footer">
                <div className="copyright">
                    <p>Copyright information by Ezhil Chits</p>
                </div>
                <div className="MenuBar">

                </div>
            </div>
        )
    }

};

export default FooterComponent;