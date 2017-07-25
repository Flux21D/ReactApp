import React from "react";

class ModalContent extends React.Component {

  render () {
    return (
            <div className="my-modal-content">{this.props.children}</div>
    );
  }

}

export default ModalContent;