import React, { useEffect } from 'react';
import { Form } from 'antd';
import { useModel } from 'umi';
import accountBackground from '@/assets/Khách Hàng/Tài khoản/Backgroud.png';
import { getPageBackground } from '../themeBackground';
import useTaiKhoanModel from '@/models/Khách Hàng/Tài Khoản';

// ── Components con ──────────────────────────────────────────────────────────
import PhanHero    from './Component/Phần Hero';
import ThanhTrai  from './Component/Thanh Trái';
import BieuMau    from './Component/Biểu Mẫu';
import PhanChan   from './Component/Phần Chân';

import './index.less';

const TaiKhoan: React.FC = () => {
    // ── Models ───────────────────────────────────────────────────────────────
    const { currentUser, updateProfile, rankInfo } = useModel('Khách Hàng.user');
    const { theme } = useModel('Khách Hàng.global');
    const { avatarUrl, syncAvatar, beforeUpload, onFinish, isAvatarImage } = useTaiKhoanModel();

    const [form] = Form.useForm();

    // Sync form + avatar khi currentUser thay đổi
    useEffect(() => {
        form.setFieldsValue(currentUser);
        syncAvatar(currentUser.avatar);
    }, [currentUser, form]);

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div
            className="profile-settings-page fade-in"
            style={{ backgroundImage: getPageBackground(accountBackground, theme) }}
        >
            <PhanHero />

            <div className="profile-layout">
                <ThanhTrai
                    currentUser={currentUser}
                    avatarUrl={avatarUrl}
                    isAvatarImage={isAvatarImage}
                    beforeUpload={beforeUpload}
                    rankInfo={rankInfo}
                />
                <BieuMau
                    form={form}
                    onFinish={onFinish}
                    updateProfile={updateProfile}
                />
            </div>

            <PhanChan />
        </div>
    );
};

export default TaiKhoan;
