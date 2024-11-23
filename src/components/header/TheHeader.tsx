import React from "react";
import { Link } from "react-router-dom";

const TheHeader = () => {
  return (
    <div>
      <Link to="/">Nu1</Link>
      <Link to="/Nu2">Nu2</Link>
      <Link to="/Nu3">Nu3</Link>
    </div>
  );
};

export default TheHeader;
