import React, { CSSProperties } from 'react';
import AntSpin from 'antd/lib/spin';

const spinnerStyles: CSSProperties = {
  display: 'flex',
};

export const Spinner: React.FC = () => (
  <AntSpin style={spinnerStyles} size="small" />
);
