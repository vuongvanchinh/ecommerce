import React from "react";
import st from "./Footer.module.css";
import Link from "next/link";
// import logo from '/second_logo.png'
const logo = '/second_logo.png'
const footerAboutLinks = [
  {
    display: "Giới thiệu",
    path: "/about",
  },
  {
    display: "Liên hệ",
    path: "/about",
  },
  {
    display: "Tuyển dụng",
    path: "/about",
  },
  {
    display: "Tin tức",
    path: "/about",
  },
  {
    display: "Hệ thống cửa hàng",
    path: "/about",
  },
];

const footerCustomerLinks = [
  {
    display: "Chính sách đổi trả",
    path: "/about",
  },
  {
    display: "Chính sách bảo hành",
    path: "/about",
  },
  {
    display: "Chính sách hoàn tiền",
    path: "/about",
  },
];

const Footer = (props) => {
  
  return (
    <footer className={st.footer} style={props}>
      <div className="grid grid-col-4 grid-col-md-2 grid-col-sm-1">
        <div>
          <div className={st.title}>support switchboard</div>
          <div className={st.content}>
            <p>
            Contact to order<strong>0123456789</strong>
            </p>
            <p>
              Check your order<strong>0123456789</strong>
            </p>
            <p>
              Suggestions, complaints<strong>0123456789</strong>
            </p>
          </div>
        </div>
        <div>
          <div className={st.title}>About Hello World</div>
          <div className={st.content}>
            {footerAboutLinks.map((item, index) => (
              <p key={index}>
                <Link href={item.path}>{item.display}</Link>
              </p>
            ))}
          </div>
        </div>
        <div>
          <div className={st.title}>Customer care</div>
          <div className={st.content}>
            {footerCustomerLinks.map((item, index) => (
              <p key={index}>
                <Link href={item.path}>{item.display}</Link>
              </p>
            ))}
          </div>
        </div>
        <div className={st.about}>
          <p>
            <Link href="/">
              <img src={logo} className={st.logo} alt="" />
            </Link>
          </p>
          <p>
            Hướng đến mục tiêu mang lại niềm vui ăn mặc mới mỗi ngày cho hàng
            triệu người tiêu dùng Việt. Hãy cùng Yolo hướng đến một cuộc sống
            năng động, tích cực hơn.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
