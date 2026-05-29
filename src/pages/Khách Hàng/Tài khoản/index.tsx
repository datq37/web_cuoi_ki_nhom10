import React, { useEffect } from 'react';
import { Form } from 'antd';
import { useModel } from 'umi';
import accountBackground from '@/assets/Khách Hàng/Tài khoản/Backgroud.png';
import { getPageBackground } from '../Chế độ sáng tôi/themeBackground';
import useTaiKhoanModel from '@/models/Khách Hàng/Tài Khoản';

import PhanHero from './Component/Phần Hero';
import ThanhTrai from './Component/Thanh Trái';
import BieuMau from './Component/Biểu Mẫu';
import PhanChan from './Component/Phần Chân';

import './index.less';

const TaiKhoan: React.FC = () => {
    const { currentUser: nguoiDungHienTai, updateProfile: capNhatHoSo, rankInfo: thongTinHang } = useModel('Khách Hàng.Tài Khoản.thanghang');
    const { theme: giaoDien } = useModel('Khách Hàng.GlobalState.index');
    const { duongDanAnhDaiDien, dongBoAnhDaiDien, truocKhiTaiLen, khiHoanThanh, laAnhDaiDien } = useTaiKhoanModel();

    const [bieuMau] = Form.useForm();

    useEffect(() => {
        bieuMau.setFieldsValue(nguoiDungHienTai);
        dongBoAnhDaiDien(nguoiDungHienTai.avatar);
    }, [nguoiDungHienTai, bieuMau]);

    return (
        <div
            className="trang-cai-dat-tai-khoan fade-in"
            style={{ backgroundImage: getPageBackground(accountBackground, giaoDien) }}
        >
            <PhanHero />

            <div className="bo-cuc-tai-khoan">
                <ThanhTrai
                    nguoiDungHienTai={nguoiDungHienTai}
                    duongDanAnhDaiDien={duongDanAnhDaiDien}
                    laAnhDaiDien={laAnhDaiDien}
                    truocKhiTaiLen={truocKhiTaiLen}
                    thongTinHang={thongTinHang}
                />
                <BieuMau
                    bieuMau={bieuMau}
                    khiHoanThanh={khiHoanThanh}
                    capNhatHoSo={capNhatHoSo}
                />
            </div>

            <PhanChan />
        </div>
    );
};

export default TaiKhoan;
