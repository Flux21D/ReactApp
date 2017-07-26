import React from "react";
import {connect} from "react-redux";
import ModalDialog from "./modal-dialog";
import {closeModal} from "../../../actions/modal";

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
  }

    // componentDidMount() {
    //     this.context.router.listen(this.closeModal);
    // }

  closeModal() {
    if (this.props.modal.onBeforeClose) {
      this.props.modal.onBeforeClose();
    }
    this.props.closeModal();
  }

  render() {

    const {Component, data, dialogSettings, additionalData} = this.props.modal;

    return (
            <div className="my-modal">
                {Component ?
                    <ModalDialog closeModal={this.closeModal} settings={dialogSettings}>
                        <Component {...data} {...additionalData} />
                    </ModalDialog>
                    : null}
            </div>
    );
  }
}

Modal.propTypes = {
  closeModal: React.PropTypes.func.isRequired
};

Modal.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    modal: state.modal
  };
};

export default connect(mapStateToProps, {closeModal})(Modal);