import React from 'react';
import { Button } from 'antd';
import { history } from 'umi';
import './topbar.less';

const Topbar: React.FC = () => {
  return (
    <div className="topbar-container">
      <div className="topbar-left" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
        <div className="brand-wrapper">
          <img src="/logo.webp" alt="Logo" className="topbar-logo" />
          <div className="brand-text">
            <span className="brand-name">Căng tin</span>
            <span className="brand-slogan">Doanh nghiệp</span>
          </div>
        </div>
      </div>
      <div className="topbar-right">
        <Button
          className="btn-login"
          type="text"
          onClick={() => history.push('/dang-nhap')}
        >
          Đăng nhập
        </Button>
        <Button
          className="btn-register"
          type="primary"
          onClick={() => history.push('/dang-ky')}
        >
          Đăng kí
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
