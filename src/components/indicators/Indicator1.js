import React from 'react';

export const Indicator1 = (props) => {

  // Helpers
  const scale = props.scale !== undefined ? props.scale : 1.0;
  const color = props.color !== undefined ? props.color : '#fff';

  return (
    <div className='indicator-container'>
      <div
        className='indicator1-root'
        style={{
          transform: `scale(${scale})`,
        }}>
        <div
          style={{
            border: `4px solid ${color}`,
          }} />
        <div
          style={{
            border: `4px solid ${color}`,
          }} />
      </div>
    </div>
  );
}
