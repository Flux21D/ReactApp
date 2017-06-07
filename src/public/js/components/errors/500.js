import React from "react";

class Error500 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="error">
                <div className="error-500">
                    <div className="robot-image-container">
                        <img src="img/error-500.png" alt="Error 500"/>
                    </div>
                    <div className="error-content">
                        <h1>Something went wrong</h1>
                        <p>Our apologies, but this site is under maintenance and currently unavailable.</p>
                        <p>Please check back later.</p>
                    </div>
                </div>
            </div>
        );
    }

}

export default Error500;