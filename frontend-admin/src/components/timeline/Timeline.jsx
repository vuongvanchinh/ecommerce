import React from "react";

import "./timeline.css";
const renderItem = (item, index, current_index, tail=false) => (
  <li key={index}>
    <div className="timeline-content">{item}</div>
    <div className={`timeline-dot-wraper ${index < current_index? 'timeline-line-complete':''}`}>
      <div className={`timeline-dot ${index <= current_index? 'timeline-dot-complete':''}`}></div>
      <div className={`timeline-line ${tail? 'timeline-line-tail':''}`}></div>
    </div>
  </li>
);
const Timeline = (props) => {
  let { timelines, current_index } = props;
  let l = timelines.length -1;

  return (
    <div className="timeline-container">
      <ul className="timeline">
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
