import React from "react";
import st from  "./Quote.module.css";

const Quote = (props) => {
  let { content, name } = props;
  return (
    <div className={st['quote-wraper']}>
      <div className={st.quote}>
        <span class={st['quote-left']}>❝</span>
        <blockquote>{content}</blockquote>
        <span class={st['quote-right']}>❞</span>
      </div>
    </div>
  );
};

export default Quote;
