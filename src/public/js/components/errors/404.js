import React from "react";
import {Link} from "react-router";

class Error404 extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
            <div className="page section-404">
            
                <div className="section-header" style={{backgroundImage: 'url(img/backgrounds/404.jpg)'}}>
                    <div className="content center">
                        <h1 className="size1">404</h1>
                        <div className="size2">Página no encontrada</div>
                    </div>
                </div>
        </div>

    );
  }
}

export default Error404;