import React from 'react';
import { Link } from 'react-router-dom';

const Wrapper = ({children}) => (
  <div className="row h-100">
    <div className="col-lg-6 my-auto">
      <div className="header-content mx-auto">
        {children[0]}
      </div>
    </div>
    <div className="col-lg-6 my-auto custom-dark-bg">
      {children[1]}
    </div>
  </div>
)

export default Wrapper;
