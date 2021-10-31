import React, { useState, useEffect, useMemo } from "react";
import TextField from "../form/textfield/TextField";
import SelectField from "../form/selectfield/SelectField";
import Checkbox from "../form/checkbox/Checkbox";
import Button from "../button/Button";
import { Link } from "react-router-dom";
import { paymentMethodListPage } from "../../utils/urls";
import { useDispatch } from "react-redux"
import Modal from "../modal/Modal"
import { useSelector } from "react-redux"
import LoadingPage from "../loadingPage/LoadingPage"
import {setNewListCoupon} from '../../redux/features/coupon_list'
import couponApi from '../../utils/api/couponApi'

const renderDeleteModalHeader = () => (
  <div>Are you sure to delete this payment method?</div>
);
const PaymentMethodForm = (props) => {
  const { data, handleChange, action, handleSubmit, errors, handleDelete } =
    props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const coupons = useSelector((state) => state.coupon_list.data);
  const coupons_options = useMemo(() => {
    return [{id:null, description:'____No select____'}, ...coupons]
  }, [coupons])

  const closeDeleteModal = () => {
    setShowModal(false);
  };

  const del = () => {
    handleDelete();
    closeDeleteModal();
  };

  useEffect(() => {
    if (coupons.length === 0) {
      ;(async () => {
        try {
          let res = await couponApi.getListCoupon()
          if (res.status === 200) {
            dispatch(setNewListCoupon(res.data))
            setLoading(false)
          }
        } catch (error) {
          setLoading(false)
        }
      })()
    } else {
      setLoading(false)
    }
  }, [])

  if(loading) {
    return <LoadingPage />
  }

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
            <div className="form-card__header">Promotion</div>
            <div className="form-card__body">
              <SelectField
                name="coupon"
                label="Coupon"
                options={coupons_options}
                content_attr="description"
                value_attr="id"
                onChange={handleChange}
                value={data.coupon}
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

export default PaymentMethodForm;
