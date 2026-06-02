import { Result } from 'antd';
import React from 'react';

const DangCapNhat: React.FC = () => (
  <Result
    status="info"
    title="Đang cập nhật"
    subTitle="Hệ thống đang được nâng cấp, vui lòng quay lại sau."
  />
);

export default DangCapNhat;
