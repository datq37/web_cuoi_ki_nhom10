import React, { useState } from 'react';
import { GoogleOutlined, LoadingOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { history } from 'umi';
import { showCustomerNotification } from '@/utils/notification';

interface RegisterFormProps {
    onToggle?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
    const [ten, setTen] = useState('');
    const [taikhoan, setTaikhoan] = useState('');
    const [matkhau, setMatkhau] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!taikhoan || !matkhau) {
            message.warning('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (matkhau.length < 6) {
            message.warning('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taikhoan, matkhau, ten: ten || undefined }),
            });

            if (res.status === 201) {
                showCustomerNotification(
                    'Đăng ký thành công! 🎉',
                    'Tài khoản đã được tạo. Chuyển sang đăng nhập...',
                    'success'
                );
                setTimeout(() => {
                    if (onToggle) {
                        onToggle();
                    } else {
                        history.push('/KhachHang/dangnhap');
                    }
                }, 1500);
            } else {
                const data = await res.json();
                const errMsg =
                    data?.detail === 'Tên tài khoản đã tồn tại'
                        ? 'Tài khoản này đã được đăng ký rồi!'
                        : data?.detail || 'Đăng ký thất bại, vui lòng thử lại.';
                message.error(errMsg);
            }
        } catch {
            message.error('Không thể kết nối tới máy chủ, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form action="#" onSubmit={(e) => e.preventDefault()}>
            <h1>Tạo tài khoản</h1>
            <input
                type="text"
                placeholder="Họ và tên (không bắt buộc)"
                value={ten}
                onChange={(e) => setTen(e.target.value)}
                disabled={loading}
            />
            <input
                type="text"
                placeholder="Tên tài khoản"
                value={taikhoan}
                onChange={(e) => setTaikhoan(e.target.value)}
                disabled={loading}
            />
            <input
                type="password"
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                value={matkhau}
                onChange={(e) => setMatkhau(e.target.value)}
                disabled={loading}
            />
            <button
                className="nutXacNhan"
                type="button"
                onClick={handleRegister}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                {loading ? <><LoadingOutlined spin /> Đang đăng ký...</> : 'Đăng ký'}
            </button>
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
