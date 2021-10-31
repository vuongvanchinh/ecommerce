import React, {useRef, useEffect, useMemo, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TextField from "../form/textfield/TextField";
import TextEditor from "../form/texteditor/TextEditor";
import SelectImageItem from "../form/selectimage/selectImageItem/SelectImageItem";
import SelectItemListButton from "../form/selectimage/selectImageList/SelectItemListButton";
import Checkbox from "../form/checkbox/Checkbox";
import SelectField from "../form/selectfield/SelectField";
import Button from "../button/Button";
import categoryApi from '../../utils/api/categoryApi';
import {setNewListCategory } from '../../redux/features/category_list';
import SelectGallery from "../selectgallery/SelectGallery";
// import TableVariant from "../table/TableVariant";
import { addCriterion, addOption,
  deleteCriterion, deleteOption,
  onChangeCriterion, onChangeOption,
  onChangeVariant, fillOutVariant,
  appendImages, onChangeImage
} from "../../redux/features/product_crud";
import Modal from '..//modal/Modal'

import "./productform.css";

import { stringToListInt } from "../../utils/stringToListInt";

const MODEL_WRAPER_ID = 'model_wraper_id'
const variant_head = [
  'Price',
  'Stock',
  'Sku'
]

const MAX_CLASSIFY_LAYER = 3
const ProductForm = (props) => {

  let { action, data, handleChange, handleSubmit, errors } = props;
  const categories = useSelector((state) => state.category_list.data);
  
  const dispatch = useDispatch()
  let sku = useRef(null);
  let stock = useRef(null);
  let price = useRef(null);
  let truncate_content = useRef(null);
  let option = useRef(0)
  let option_image_indexs = useRef([]) // list int index of select images

  const [show_modal, setShowModal] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      const getCategories = async () => {
        try {
          // const params = {limit:10}
          let res = await categoryApi.getListCategory()
          if (res.status === 200) {
            dispatch(setNewListCategory(res.data))
          }
        } catch (error) {
          console.log(error)
        }
      }
      getCategories()
    }
    // focus to name field after render
    document.getElementById('product_name').focus();
    return () => {

    }
  }, [])
  
  const additionTd = (index) => (
    <>
      <td key={1} >
        <input type="number" 
          value={data.variants[index].price}
          onChange = {(e) => dispatch(onChangeVariant({
            index: index, name: "price", value:parseInt(e.target.value)
          }))}
        />
      
      </td>
      <td key={2}> 
        <input type="number" 
          value={data.variants[index].quantity_in_stock}
          onChange = {(e) => dispatch(onChangeVariant({
            index: index, name: "quantity_in_stock", value:e.target.value !==''? parseInt(e.target.value):''
          }))}
        />
      </td>
      <td  key={3}>
        <input type="text" 
          value={data.variants[index].sku}
          onChange = {(e) => dispatch(onChangeVariant({
            index: index, name: "sku", value:e.target.value
          }))}
        />
      </td>
    </>
  )

  const renderBodyVariant = useMemo(() => {
    let criterions = data.criterions;
    let l = criterions.length;
    let rows = []
    let c1, c2, c3;
    console.log('cal variants')
    switch (l) {
      case 1:
        c1 = criterions[0].options.length;
        for (let i = 0; i< c1; i++) {
          let option_name= criterions[0].options[i].option_name
          rows.push((
            <tr key={rows.length}>
              <td className="variant_option">{option_name? option_name:"Option"}</td>
              {additionTd(rows.length)}
            </tr>
          ))
        }
        break;
      case 2:
        c1 = criterions[0].options.length;
        c2 = criterions[1].options.length;
        for (let i = 0; i< c1; i++) {
          for(let j = 0; j < c2; j++) {
            rows.push((
              <tr key={rows.length}>
                {rows.length % c2 ===0? (
                  <td rowSpan={c2} className="variant_option">
                    {criterions[0].options[i].option_name? criterions[0].options[i].option_name: "Option" }
                  </td>
                ):null }
                <td className="variant_option">
                  {criterions[1].options[j].option_name? criterions[1].options[j].option_name:"Option"}
                </td>
                {additionTd(rows.length)}
              </tr>
            ))
          }
        }
        break;
      case 3:
        c1 = criterions[0].options.length;
        c2 = criterions[1].options.length;
        c3 = criterions[2].options.length;
        
        for (let i = 0; i< c1; i++) {
          for(let j = 0; j < c2; j++) {
            for (let z = 0; z < c3; z++) {
              rows.push((
                <tr key={rows.length}>
                  {rows.length % (c2*c3) ===0? (
                    <td rowSpan={c2*c3} className="variant_option">
                      {criterions[0].options[i].option_name}
                    </td>
                  ):null }
                  {rows.length % (c3) ===0? (
                    <td rowSpan={c3} className="variant_option">
                      {criterions[1].options[j].option_name}
                    </td>
                  ):null }
                  <td className="variant_option">
                    {criterions[2].options[z].option_name}
                  </td>
                  {additionTd(rows.length)}
                </tr>
              ))
            }
          }
        }
      
        break;
      default:
        break;
    }
    return rows;
  }, [data.criterions, data.variants])

  const fastFillOut = () => {
    console.log("fillout")
    if(
        price.current && price.current.value !=='' && price.current.value >= 0 
        && stock.current && stock.current.value !== '' && stock.current.value >= 0
        && sku.current && sku.current.value !== '') {
      let data = {
        price: parseFloat(price.current.value),
        quantity_in_stock: parseInt(stock.current.value),
        sku: sku.current.value
      }
      console.log(data)
      dispatch(fillOutVariant(data))
    }
  }

  const handleOpenModal = (select_option) => {
    option.current = select_option
    option_image_indexs.current = stringToListInt(data.criterions[0].options[select_option].image_indexs)
    
    setShowModal(true)
  }
  const handleSelectOptionImages = (selected_list) => {    
    console.log("selected list", selected_list)
    dispatch(onChangeOption({
      criterion_index: 0, option_index: option.current, name:"image_indexs", value:selected_list.join(" ")
    }))
    setShowModal(false)
  }
  
  console.log("rerender product form")
  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12 col-8">
          <div className="form-card">
            <div className="form-card__header">General Information</div>
            <div className="form-card__body">
              <TextField
                placeholder="Name"
                onChange={handleChange}
                name="name"
                id="product_name"
                value={data.name}
                errors={errors.name}
              />
              <TextEditor
                placeholder="Discription"
                onChange={handleChange}
                name="description"
                id="product_description"
                content={data.description}
              />
            </div>
          </div>
          <div className="form-card">
            <div className="form-card__header flex-space-between">
              <p>Images</p>
              <SelectItemListButton 
                onChange = {(dt) => dispatch(appendImages(dt.value))}
              />
              {/* <SelectImageList /> */}
              {/* <Button variant="link">
                Add image
              </Button> */}
            </div>
            <div className="form-card__body">
              <div className="images_list">
                {data && data.images && data.images.length > 0
                  ? data.images.map((img, index) => (
                      <SelectImageItem
                        key={index}
                        image={img.image}
                        name={`images_${img.id}`}
                        id={`category_background_image-${index}`}
                        onChange={(dt) => dispatch(onChangeImage({index: index, value:dt.value}))}
                      />
                    ))
                  : "There is no image yet!"}
              </div>
            </div>
          </div>
          <div className="form-card">
            <div className="form-card__header">Seo Information</div>
            <div className="form-card__body">
              <TextField
                placeholder="slug"
                name="slug"
                id="category_slug"
                value={data.slug}
                onChange={handleChange}
                errors={errors.slug}
              />
              <TextField
                placeholder="Seo title"
                name="seo_title"
                id="category_seo_title"
                value={data.seo_title}
                onChange={handleChange}
              />

              <TextEditor
                placeholder="Seo description"
                content={data.seo_description}
                name="seo_description"
                id="category_seo_description"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-card">
            <div className="form-card__header">Classify</div>
            <div className="form-card__body">
              {/* Errors display */}
              {data.errors.criterions? (<p className="error-message">{data.errors.criterions}</p>):null}
              
              {data.criterions
                ? data.criterions.map((cri, index) => (
                    <div className="criterion_wraper" key={index}>
                      <div className="criterion" >
                        <input
                          value={cri.criterion_name}
                          onChange={(e) => 
                            dispatch(onChangeCriterion({
                              index: index, name:"criterion_name", value: e.target.value
                            }))}
                          type="text"
                          name={`criterion_name-${index}`}
                          placeholder="Size/Color..."
                        />
                        <div className="option-wrap">
                          <div>Options</div>
                          <ul>
                            {cri.options
                              ? cri.options.map((o, i) => (
                                  <li key={i}>
                                    <input
                                      type="text"
                                      value={o.option_name}
                                      onChange={(e) => dispatch(onChangeOption({
                                        criterion_index: index, option_index: i, name:"option_name", value:e.target.value
                                      }))}
                                      
                                      name={`option_name_${index}_${i}`}
                                      placeholder="S/M/Red/Green... max length: 50"
                                    />
                                    {
                                      cri.options.length === 1? null: (
                                        <i className="bx bx-x criterion__close-icon" onClick={
                                          () =>dispatch(deleteOption({
                                            criterion_index: index, option_index: i
                                          }))}></i>
                                      )
                                    }
                                  </li>
                                ))
                              : null}
                            <Button variant="dash" onClick={() =>{ dispatch(addOption(index))}}>Add option</Button>
                          </ul>
                        </div>
                      </div>
                      <i className="bx bx-x criterion__close-icon" onClick={() =>dispatch(deleteCriterion(index))}></i>
                    </div>
                  ))
                : null}

              {data.criterions.length < MAX_CLASSIFY_LAYER? (
                <Button variant="dash"  onClick={() =>{dispatch(addCriterion())}}>Add criterion group</Button>
              ):null}
              {data.variants.length === 0? null:(
                <div className="table-variant-wraper">
                 
                 <div className="fast-fill-out">
                  <h4>Fast fill out</h4>
                  <input ref={price} type="number" placeholder="price"/>
                  <input ref={stock} type="text" placeholder="stock"/>
                  <input ref={sku} type="text" placeholder="sku max length: 30"/>
                  <Button type="button" onClick={() => fastFillOut()}>Aplly</Button>
                 </div>
                 {/* Errors message */}
                 {data.errors.variants? (
                   data.errors.variants.map((item, index) => (
                     <p className="error-message" key={index}>{item}</p>
                   ))
                 ):null}

                 Variant Table
                 <div className="full-width overflow-scroll">
                   <table className="table-variant">
                    <thead>
                     <tr>
                      { data.criterions.map((item, index) => (
                          <th key={index} className="variant_option">{item.criterion_name? item.criterion_name:"Criterion"}</th>
                        ))}
                        {
                          variant_head.map((item, index) => (
                            <th key={index} >{item}</th>
                          ))
                        }
                     </tr>
                    </thead>
                    <tbody>
                      {
                        renderBodyVariant
                      }
                    </tbody>
                    </table>
                 </div>
                </div>
              )}

              {
                data.criterions.length > 0? (
                  data.criterions[0].options.map((o, index) => (
                    <div key={index} className="option_images">
                      <p >
                        <span>{o.option_name} </span>
                        <Button 
                          variant="light"
                          onClick={() => handleOpenModal(index)}
                        >Change</Button>
                      </p>
                      <div className="images_list">
                        {
                          o.image_indexs.trim() !==''? (
                            stringToListInt(o.image_indexs).map((img, index) => (
                              <SelectImageItem image={data.images[img].image}
                                key={index}
                                viewOnly={true}
                                variant="medium"
                              />
                            ))
                          ):null
                        }
                      </div>
                    </div>
                  ))
                ):null
              }

              
            </div>

          </div>
        </div>
        <div className="col-md-12 col-4">
          <div className="form-card">
            <div className="form-card__header">Group</div>
            <div className="form-card__body">
              <SelectField
                name="category"
                id="product_category"
                value={data.category}
                value_attr="id"
                content_attr="name"
                options={categories}
                onChange={handleChange}
                label="Category"
              />
            </div>
          </div>
          <div className="form-card">
            <div className="form-card__header">Sell Information</div>
            <div className="form-card__body">
            <TextField 
                type="number"
                name="cost"
                id="product_cost"
                placeholder="cost"
                onChange={handleChange}
                value={data.cost}
              />
              <TextField 
                type="number"
                name="price"
                id="product_price"
                placeholder="price"
                onChange={handleChange}
                value={data.price}
              />
            </div>
          </div>
          <div className="form-card">
            <div className="form-card__header">Shipping Information</div>
            <div className="form-card__body">
              <TextField 
                type="number"
                name="weight"
                id="product_weight"
                placeholder="weight"
                onChange={handleChange}
                value={data.weight}
              />
            </div>
          </div>
          <div className="form-card">
            <div className="form-card__header">Publish</div>
            <div className="form-card__body">
              <Checkbox 
                label="Publish"
                name= "is_published"
                checked ={data.is_published}
                onChange={handleChange}
              />
              {data.is_published ? null:(
                <div className="truncate">
                  <p className="truncate_label" onClick={() =>{
                    if (truncate_content && truncate_content.current) {
                      truncate_content.current.classList.toggle('truncate-content-show')
                    }
                  }}>Set publish date..</p>
                  <div ref={truncate_content} className="truncate_content">
                    <input className="select-date" type="datetime-local"
                      // onChange = {ha}
                    />

                  </div>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

      <div className="form__actions">
        <div>
          {action !== "add" ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => props.handleDelete(data.id)}
            >
              Delete
            </Button>
          ) : null}
        </div>
        <div className="actions">
          <Link to="/dashboard/products">
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
    <Modal
      show={show_modal}
      onHide={() => setShowModal(false)}
      renderHeader = {() => (<p>Select images</p>)}
    >
      {
        data.criterions.length > 0? (
          <SelectGallery 
            images={data.images}
            selected_items = {option_image_indexs.current}
            handleCancel ={() => setShowModal(false)}    
            exportSelectedList = {handleSelectOptionImages}    
          />
        ):null
      }
    </Modal>
    </>
  );
};

ProductForm.defaultProps = {
  action: "add",
  data: {
    name: "",
    description: "",
    seo_descriotion: ""
  },
  errors: {},
};
export default ProductForm;
