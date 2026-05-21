import React from 'react';
import { history } from 'umi';
import { useEffect } from 'react';

const TrangChu: React.FC = () => {
  useEffect(() => {
    history.replace('/quan-tri/tong-quan');
  }, []);
  return null;
};

export default TrangChu;
