import React from "react";
import ModalContent from "./modal-content";

class ModalDialog extends React.Component {

  constructor (props) {
    super (props);

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal () {
    this.props.closeModal();
  }

  render () {
    const {settings} = this.props;
    return (
            <div className={"my-modal-dialog " + settings.classes}>
                <span className="my-modal-close" onClick={this.closeModal}>
                    <img src="svg/icons/icon_close_white.svg" alt="Close"/>
                </span>
                <ModalContent>
                    {this.props.children}
                </ModalContent>
            </div>
    );
  }
}

ModalDialog.propTypes = {
  closeModal: React.PropTypes.func.isRequired
};

export default ModalDialog;