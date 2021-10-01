import React from "react";

import st from "./Timeline.module.css";

const renderItem = (item, index, current_index, tail=false) => (
  <li key={index}>
    <div className={st['timeline-content']}>{item}</div>
    <div className={`${st['timeline-dot-wraper']} ${index < current_index? st['timeline-line-complete']:''}`}>
      <div className={`${st['timeline-dot']} ${index <= current_index? st['timeline-dot-complete']:''}`}></div>
      <div className={`${st['timeline-line']} ${tail? st['timeline-line-tail']:''}`}></div>
    </div>
  </li>
);
const Timeline = (props) => {
  let { timelines, current_index } = props;
  let l = timelines.length -1;

  return (
    <div className={st['timeline-container']}>
      <ul className={st.timeline}>
        {
          timelines.map((item, index) => renderItem(item, index, current_index, index === l))
        }
      </ul>
    </div>
  );
};
Timeline.defaultProps = {
  timelines: [],
  current_index: 0
}
export default Timeline;
