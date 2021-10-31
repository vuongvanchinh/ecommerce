import React, { useState, useEffect, useMemo } from "react";
import TextField from "../form/textfield/TextField";
import Checkbox from "../form/checkbox/Checkbox";
import Button from "../button/Button";
import { Link } from "react-router-dom";
import { paymentMethodListPage } from "../../utils/urls";
import Modal from "../modal/Modal";

const renderDeleteModalHeader = () => (
  <div>Are you sure to delete this shipping method?</div>
);

const ShippingMethodForm = (props) => {
  const { data, handleChange, action, handleSubmit, errors, handleDelete } =
    props;
  const [showModal, setShowModal] = useState(false);

  const closeDeleteModal = () => {
    setShowModal(false);
  };

  const del = () => {
    handleDelete();
    closeDeleteModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-7 col-sm-12">
          <div className="form-card">
            <div className="form-card__header">General</div>
            <div className="form-card__body">
              <TextField
                placeholder="Name"
                name="name"
                onChange={handleChange}
                errors={errors.name}
                required={true}
                value={data.name}
              />
            </div>
          </div>
          <div className="form-card">
            <div className="form-card__header">Cost</div>
            <div className="form-card__body">
              <TextField 
                name='fee'
                value={data.fee}
                placeholder="Fee"
                type='number'
                required={true}
                onChange={handleChange}
                errors={errors.fee}
              />
            </div>
          </div>
        </div>

        <div className="col-5 col-sm-12">
          <div className="form-card">
            <div className="form-card__header">Active infomation</div>
            <div className="form-card__body">
              <Checkbox
                checked={data.active}
                name="active"
                onChange={handleChange}
                label="Active"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="form__actions">
        <div>
          {action !== "add" ? (
            <div>
              <Button
                type="button"
                variant="danger"
                onClick={() => setShowModal(true)}
              >
                Delete
              </Button>
              <Modal
                show={showModal}
                onHide={() => closeDeleteModal()}
                variant="small"
                renderHeader={renderDeleteModalHeader}
              >
                <div className="flex space_between">
                  <Button variant="light" onClick={() => closeDeleteModal()}>
                    Cancel
                  </Button>
                  <Button onClick={() => del()}>OK</Button>
                </div>
              </Modal>
            </div>
          ) : null}
        </div>
        <div className="actions">
          <Link to={paymentMethodListPage}>
            <Button variant="light">Cancel</Button>
          </Link>
          <Button
            type="submit"
            //   disabled={data.email.trim() ===""}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ShippingMethodForm;
