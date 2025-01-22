import React from 'react';
import './SpinnerLoader.css'; 

const SpinnerLoader = () => {
  return  (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
        </div>
        &nbsp; &nbsp;
        <h5>Loading...</h5>
      </div>
      )
};

export default SpinnerLoader;

