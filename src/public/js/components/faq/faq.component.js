import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import TopBannerImage from "./faq.topbanner";
import FaqBodyContent from "./faq.bodycontent";
import FaqFooterImage from "./faq.footerimage";
import { getFAQInfo } from "../../actions/faq";
import $ from "jquery";

class Questions extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getFAQInfo();
    }

    render() {
        return (
            <div>
                <div className="page section-faq">
                    <TopBannerImage />
                    <FaqBodyContent />
                    <FaqFooterImage />
                </div>
            </div>
        );
    }
}

const actionCreators = {
    getFAQInfo
};

const mapStateToProps = (state) => {
    return {
        faq: state.faq,
        auth: state.auth
    };
};

export default connect(mapStateToProps, actionCreators)(Questions);