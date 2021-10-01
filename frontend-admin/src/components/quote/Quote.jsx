import React from "react";
import "./quote.css";

const Quote = (props) => {
  let { content, name } = props;
  return (
    <div className="quote-wraper">
      <div className="quote">
        <span class="quote-left">❝</span>
        <blockquote>{content}</blockquote>
        <span class="quote-right">❞</span>
      </div>
    </div>
  );
};

export default Quote;
