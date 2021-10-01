import React from 'react'
import st from '../../styles/Product.module.css'
import Head from 'next/head'
import Catalog from '../../components/catalog/Catalog'
import Slider from '../../components/slide/Slider'
const SliderData = [
    {
        title: "Polo nữ Pima cao cấp",
        description: "Nhắc đến sự đẳng cấp là không thể không nhắc đến dòng vải pima. Nó tạo nên chất lượng tốt nhất cho bất kỳ sản phẩm thời trang nào. Sợi vải pima dài và dày hơn sợi cotton thông thường gấp đôi nhờ công nghệ dệt tân tiến. Điều đó làm cho kết cấu áo polo chắc chắn, bền chặt, hạn chế tối đa xù lông, mềm mượt, bền màu, vô cùng đảm bảo sức khoẻ người dùng",
        img: '/slider1.png',
        color: "blue",
        path: "/"
    },
    {
        title: "Polo Nữ Dáng Suông Modal",
        description: "Polo nữ dáng suông Modal sử dụng công nghệ vải cao cấp thân thiện với môi trường sản xuất độc quyền chống co rút vải, áo polo nữ vải modal là sản phẩm thích hợp cho các bạn có môi trường làm việc năng động như hiện nay",
        img: '/slider2.png',
        path: "/",
        color: "pink"
    },
    {
        title: "Polo Nữ Coolmax Lacoste",
        description: "Mẫu áo polo nữ được làm bằng chất liệu coolmax đem lại cảm giác mát lạnh khi mặc. Thiết kế mẫu áo polo coolmax này có kiểu dáng cực kỳ thoải mái. Tạo sự gọn gàng hứa hẹn sẽ là mẫu áo polo vô cùng hot trong thời điểm sắp tới",
        img: '/slider3.png',
        path: "/",
        color: "orange"
    }
  ]
  
const Product = (props) => {
    console.log('render product page')
    return (
        <div className={st.product_page}>
            <Head>
                <title>Products</title>
            </Head>
            <div className="section" style={{height: "50vh"}}>
                <Slider 
                    data={SliderData}
                    control = {true}
                    auto={true}
                    timeOut={10000}
                    min_height='50vh'
                />
            </div>
            <Catalog />
        </div>
    )
}
export default Product
