import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import Pagination from "../shared/pagination/pagination.component";
import { getProfileNotifications, clearProfileNotifications } from "../../actions/myprofile";

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();

class ProfileNotifications extends React.Component {
  constructor(props) {
    super(props);

    this.pageNumber = this.pageNumber.bind(this);
  }

  componentDidMount() {
    this.pageNumber(1);
    this.props.clearProfileNotifications();
  }

  pageNumber(pageNo) {
    this.props.getProfileNotifications(pageNo);
  };

  render() {
    const {profile} = this.props;
    let notifications = '';
    if(profile.notifications.length > 0)
      profile.notifications.map(function(item) {
        let notificationDate = item.notification_date ? new Date(item.notification_date).toLocaleDateString() : '';
        let imageIcon = item.notification_type === 'event' ? 'laptop.svg' : (item.notification_type === 'course' ? 'mortar-board.svg' : 'comments-o.svg');
        notifications = notifications + '<div class="notification"><div class="icon aw"><span class="awcircle"><img class="svg svgR svg16" src="img/icons/' + imageIcon + '" title="Icono"/></span></div><div class="text"><span class="text-color">' + item.name + '</span> - ' + notificationDate + '<br/>' + item.notification_desc + '</div><div class="clear"></div></div>';
      });
    const notificationElement = htmlToReactParser.parse(notifications);

    return (
            <div className="notifications">
                <div className="content">
                    <div className="title-big nmt">Notificaciones</div>
                    {notificationElement}
                    
                    {
                        profile.totalRecords > 0 ?
                        <Pagination totalRecords={profile.totalRecords} pageNumber={this.pageNumber} activePageNo={profile.activePageNo} />
                        : null
                    }
                </div>
            </div>
    );
  }
}

const actionCreators = {
  getProfileNotifications,
  clearProfileNotifications
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    auth: state.auth
  };
};

export default connect(mapStateToProps, actionCreators)(ProfileNotifications);