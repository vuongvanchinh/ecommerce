import React, { useState} from 'react'
import TextField from '../form/textfield/TextField'
import SelectField from '../form/selectfield/SelectField'
import Checkbox from '../form/checkbox/Checkbox'
import Button from '../button/Button'
import { Link } from 'react-router-dom'
import { couponListPage } from '../../utils/urls'
import Modal from '../modal/Modal'
const types = [
    {value: 'direct deduction', content: 'Direct deduction'},
    {value: 'percentage deduction', content: 'Percentage deduction'},
    {value: 'freeship', content: 'Freeship'},
    {value: 'promotion payment method', content: 'Promotion payment method'}
]

const renderDeleteModalHeader = () => (
    <div>
        Are you sure to delete this coupon?
    </div>
)
const CouponForm = (props) => {
    const {data, handleChange, action, handleSubmit, errors, handleDelete} = props
    const [showModal, setShowModal] = useState(false)

    const closeDeleteModal = () =>  {
        setShowModal(false)
    }

    const del = () => {
        handleDelete()
        closeDeleteModal()
    }

    return (
        <form onSubmit={handleSubmit}>

            <div className="row">
                <div className="col-7 col-sm-12">
                    <div className="form-card">
                        <div className="form-card__header">
                            General
                        </div>
                        <div className="form-card__body">
                            <TextField name='code' 
                                id='code'
                                placeholder="Code"
                                onChange = {handleChange}
                                value={data.code}
                                errors = {errors.code}
                                required={true}
                            />
                            <TextField name='description' 
                                id='description'
                                placeholder="Description"
                                onChange = {handleChange}
                                value={data.description}
                                errors = {errors.description}
                                required={true}
                            />
                        </div>
                    </div>

                    <div className="form-card">
                        <div className="form-card__header">
                            Discount Information
                        </div>
                        <div className="form-card__body">
                            <TextField name='discount' 
                                type='number'
                                id='discount'
                                placeholder="Discount"
                                onChange = {handleChange}
                                value={data.discount}
                                errors = {errors.discount}
                                required={true}

                            />
                            <TextField name='min_order_value' 
                                type='number'
                                id='min_order_value'
                                placeholder="Min order value to apply"
                                onChange = {handleChange}
                                value={data.min_order_value}
                                errors = {errors.min_order_value}
                                required={true}

                            />
                        </div>
                    </div>
                
                
                </div>
                <div className="col-5 col-sm-12">
                <div className="form-card">
                        <div className="form-card__header">
                            Type
                        </div>
                        <div className="form-card__body">
                          <SelectField 
                                name='type'
                                id='type'
                                label='Type'
                                value={data.type}
                                onChange={handleChange}
                                options={types}
                                errors = {errors.type}
                          />  
                         
                        </div>
                    </div>
                    <div className="form-card">
                        <div className="form-card__header">
                            Active information
                        </div>
                        <div className="form-card__body">
                        <div>
                            <Checkbox 
                                name='active'
                                label='Active'
                                onChange = {handleChange}
                                checked={data.active}
                            />
                        </div>
                        <TextField 
                            name='valid_from'
                            type='datetime-local'
                            placeholder='From'
                            value={data.valid_from}
                            onChange={handleChange}
                            errors = {errors.valid_from}
                            required={true}
                          />
                        <TextField 
                            name='valid_to'
                            type='datetime-local'
                            placeholder='To'
                            value={data.valid_to}
                            onChange={handleChange}
                            errors = {errors.valid_to}
                            required={true}
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
                    onHide = {() => closeDeleteModal()}
                    variant="small"
                    renderHeader = {renderDeleteModalHeader}
                >
                     <div className='flex space_between'>
                        <Button variant='light'
                            onClick = {() => closeDeleteModal()}
                        >
                            Cancel    
                        </Button>
                        <Button
                            onClick={() => del()}
                        >
                            OK
                        </Button>            
                    </div>
                </Modal>
            </div>
          ) : null}
        </div>
        <div className="actions">
          <Link to={couponListPage}>
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
    )
}

export default CouponForm
