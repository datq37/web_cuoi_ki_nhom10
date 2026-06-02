import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NotAccessible: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Bạn không có quyền truy cập trang này."
    extra={<Button type="primary" onClick={() => history.push('/')}>Về trang chủ</Button>}
  />
);

export default NotAccessible;
