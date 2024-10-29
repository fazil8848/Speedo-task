import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <img src="/speedometer.gif" alt="" className="w-32 h-32S" />
    </div>
  );
};

export default Loader;
