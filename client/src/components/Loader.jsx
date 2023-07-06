import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="loader">
      <FaSpinner className="spinner" />
      <span>Loading...</span>
    </div>
  );
};

export default Loader;
