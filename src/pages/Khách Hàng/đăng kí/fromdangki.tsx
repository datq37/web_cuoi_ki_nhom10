import React, { useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { history } from 'umi';

interface RegisterFormProps {
    onToggle?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        if (!phone || !password) {
            message.warning('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        message.success('Tạo tài khoản thành công! Bạn có thể đăng nhập ngay.');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    return (
        <form action="#" onSubmit={(e) => e.preventDefault()}>
            <h1>Tạo tài khoản</h1>
            <input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="nutXacNhan" type="button" onClick={handleRegister}>Đăng ký</button>
            <div className="dangNhapMangXaHoi">
                <span>Hoặc đăng ký bằng</span>
                <div className="khungMangXaHoi">
                    <a href="#" className="nutMangXaHoi google" onClick={(e) => e.preventDefault()}>
                        <GoogleOutlined className="bieuTuong" />
                        <span className="vanBan">Google</span>
                    </a>
                </div>
            </div>
            <div className="chuyenDoi">
                Đã có tài khoản? <span onClick={onToggle}>Đăng nhập ngay</span>
            </div>
        </form>
    );
};

export default RegisterForm;
