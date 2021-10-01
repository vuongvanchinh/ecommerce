import React, { useState, useCallback, useEffect } from "react";
import st from "./Slider.module.css";
import Link from "next/link";
import Button from "../button/Button";

const Slider = (props) => {
  const { data, timeOut, control, auto, min_height } = props;

  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    const index = activeSlide + 1 === data.length ? 0 : activeSlide + 1;
    setActiveSlide(index);
  }, [activeSlide, data]);

  const prevSlide = () => {
    console.log("Pre");
    const index = activeSlide - 1 < 0 ? data.length - 1 : activeSlide - 1;
    setActiveSlide(index);
  };

  useEffect(() => {
    let slideAuto = () => {};
    if (auto) {
      slideAuto = setInterval(() => {
        nextSlide();
      }, timeOut);
    }
    return () => {
      clearInterval(slideAuto);
    };
  }, [nextSlide, timeOut, data, auto]);

  return (
    <div className={st.slider}>
      {data.map((item, index) => (
        <SliderItem key={index} item={item} active={index === activeSlide} />
      ))}
      {control ? (
        <div className={st.slider_control}>
          <div className={st.control_item} onClick={() => prevSlide()}>
            <i className="bx bx-chevron-left"></i>
          </div>
          <div className="">
            <div className={st.index}>
              {activeSlide + 1} / {data.length}
            </div>
          </div>
          <div className={st.control_item} onClick={() => nextSlide()}>
            <i className="bx bx-chevron-right"></i>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const SliderItem = (props) => {
  let { active, item } = props;

  return (
    <div className={`${st.item} ${active ? st.item_active : ""}`}>
      <div className={st.item_info}>
        <div>
          <div className={`${st.item_info_title} ${st["color_" + item.color]}`}>
            <h1>{props.item.title}</h1>
          </div>
          <div className={`${st.item_info_description}`}>
            <span>{item.description}</span>
          </div>
          <div className={`${st.item_info_btn}`}>
            <Button variant="light">
              <Link href={item.path}>View now</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className={st.item_image}>
        <div className={st.shape + " " + st[item.color]}></div>
        <img src={item.img} alt="" />
      </div>
    </div>
  );
};
SliderItem.defaultProps = {
  active: false,
  item: {},
};
Slider.defaultProps = {
  data: [],
  timeOut: 3000,
  control: false,
  min_height: '95vh'
};
export default Slider;
