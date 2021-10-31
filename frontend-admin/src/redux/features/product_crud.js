import { createSlice } from "@reduxjs/toolkit"
let image = {
    id: null,
    image: null,
    order: 0,
}

let option = {
    id:null,
    option_name: "",
    order:0,
    image_indexs:""
}

let criterion = {
    id:null,
    criterion_name:"",
    order: 0,
    product: null,
    options: [
       option
    ]
}

let variant = {
    id: null,
    sku:"",
    combind_string: "",
    price: 0,
    quantity_in_stock: 0,
    order: 0
}

const initialState = {
    name:"",
    description: "",
    slug: "",
    seo_title: "",
    seo_description:"",
    price: 0,
    cost:0,
    weight: 0.0,
    rating:0.0,
    category: null,
    criterions:[
    ],
    variants: [
    ],
    images: [
    ],
    // meta state
    errors: {},
    change_image: false,
    change_classify: false,

    change_variant:false
}
const cal = (cris, start, direction) =>{
    if (cris.length === 0|| start > cris.length) {
        return 0;
    }
    let res = 1;
    let i = start;
    if(direction < 0) {
        i = start -1;
        while (i >= 0) {
            res *= cris[i].options.length;
            i --;
        }
    } else {
        while (i < cris.length) {
            res *= cris[i].options.length;
            i ++;
        }
    }
    return res;
}
const calculateNumberOfVariant = (cris, index = 0) => {
    // let res = 1;
    if(cris.length === 0) {
        return 0;
    }
    let res = 1;
    for (let i = index; i < cris.length; i++) {
        res *= cris[i].options.length;
    }
    return res;
}

export const productSlice = createSlice({
    name: 'product_crud',
    initialState,
    reducers: {
        onChange: (state, action) =>{
            let dt = action.payload;
            let name = dt.name;
            let value = dt.value;

            if((name === "price" || name === "weight") && value !== '') {
                value = parseInt(value);
                if (value < 0) {
                    value = 0;
                }
            }
            state[name] = value
        }, 
        onClear: (state, action) => {
            return initialState
        },
        addCriterion: (state, action) => {
            if(state.criterions.length < 3) {
                state.change_classify = true;
                state.criterions.push(criterion)
                // state.variants = createVariants(state.criterions);// variants
                let number_of_variant = calculateNumberOfVariant(state.criterions);
                let variants= []
                for (let i = 0; i< number_of_variant; i ++) {
                    variants.push({...variant})                    
                }
                state.variants = variants;
            }
        },
        addOption:(state, action) => {
            state.change_classify = true;
            let criterion_index = action.payload
            
            // add variants
            let start_index = cal(state.criterions, criterion_index, 1);
            let pre =  cal(state.criterions, criterion_index, -1);   // number of times insert         
            let quantity = cal(state.criterions, criterion_index + 1, 1)

            for (let i = 0; i < pre; i ++) {
                let insert_index = (i + 1)*start_index + i*quantity;
                for (let q = 0; q < quantity; q++) {
                    state.variants.splice(insert_index+q, 0, {...variant})
                }
            }
            // push option
            state.criterions[criterion_index].options.push(option)
        }, 
        deleteCriterion: (state, action) => {
            state.change_classify = true;
            let index = action.payload
            console.log("delete criterion", index)
            state.criterions.splice(index, 1)
            // variant
            let number_of_variant = calculateNumberOfVariant(state.criterions);
            let variants= []
            for (let i = 0; i < number_of_variant; i ++) {
                variants.push({...variant})                    
            }
            state.variants = variants;
        },

        deleteOption: (state, action) => {
            state.change_classify = true;
            let c_index  = action.payload.criterion_index;
            let o_index = action.payload.option_index;
            let pre = cal(state.criterions, c_index, -1);
            let quantity = cal(state.criterions, c_index +1, 1) 
            let jumb = state.criterions[c_index].options.length;
            let i = pre -1;
            while (i >= 0) {
                let from = quantity*(o_index + i * jumb);
                console.log("from", from, quantity);
                state.variants.splice(from, quantity)
                i--;
            }
            state.criterions[c_index].options.splice(o_index, 1);
        },
        onChangeCriterion: (state, action) => {
            let index = action.payload.index
            state.change_classify = true;
            state.criterions[index][action.payload.name] = action.payload.value
        },
        onChangeOption: (state, action) => {
            state.change_classify = true;
            let cri_index = action.payload.criterion_index
            let o_index = action.payload.option_index
            state.criterions[cri_index].options[o_index][action.payload.name] = action.payload.value
        },
        onChangeVariant: (state, action) => {
            state.change_variant = true
            let {index, name, value} = action.payload
            state.variants[index][name] = value;
            console.log("change variant", state.variants[index][name])
        },
        fillOutVariant: (state, action) => {
            let data = action.payload;
            const keys = Object.keys(data);
            state.change_variant = true
            for (let i = 0; i< state.variants.length; i++) {
                for (let j = 0; j < keys.length; j++) {
                    state.variants[i][keys[j]] = data[keys[j]]
                }
            }
        },
        appendImages: (state, action) => {
            let imgs = action.payload;
            // console.log(imgs)
            state.change_image = true;
            let new_list_imgs = []
            for (let i = 0; i< imgs.length; i++) {
                let new_img = {...image};
                new_img.image = imgs[i]
                new_img.order = state.images.length + new_list_imgs.length;
                new_list_imgs.push(new_img)
            }
            state.images.push(...new_list_imgs)
        }, 
        onChangeImage:(state, action) => {
            let {index, value} = action.payload;
            state.change_image = true;
            if(value === null) {
                
                state.images.splice(index, 1);
            }  else {
                state.images[index].image = value;
            }
        },
        onSetNewProduct: (state, action) => {
            let newstate = {...action.payload};
            newstate.change_image = false;
            newstate.change_classify = false;
            newstate.change_variant=false;
            newstate.errors = {}
            return newstate;
        }
    }
})

export const {
    onChange, onClear,
    addCriterion, addOption,
    deleteCriterion, deleteOption,
    onChangeCriterion,
    onChangeOption,
    onChangeVariant,
    fillOutVariant,
    appendImages,
    onChangeImage,
    handleBeforeSubmit,
    onSetNewProduct
} = productSlice.actions

export default productSlice.reducer