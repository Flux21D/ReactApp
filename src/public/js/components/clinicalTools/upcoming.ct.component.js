import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

class UpcomingClinicalToolContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {homeInfo} = this.props;
        
    let herramientasInfo = homeInfo.herramientasContent.map(function(item, i) {
      let listItem = item.list.map(function(item, i) {
        return(
                    <li key={i}>{item}</li>
        )
      });
            
      return (
                <div className={i === 0 ? 'col-left' : 'col-right'} key={i}>
                    <h3 className="sub-title">{item.title}</h3>
                    <ul>
                        {listItem}
                    </ul>
                </div>
      )
    });

    return (
            <div className="list-herramientas">
                <div className="content">
                    <h2 className="title-big-grey"><span className="aw"><img className="svg svgR svg18 " src="img/icons/pencil.svg" title="Icono"/></span> <Link title="Herramientas clínicas" to="/herramientas">Herramientas clínicas</Link></h2>
                        {herramientasInfo}
                    <div className="clear"></div>
                </div>
            </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    homeInfo: state.home,
    auth: state.auth
  };
};


export default connect(mapStateToProps)(UpcomingClinicalToolContainer);