import React from 'react';
import { Button, Avatar, Upload, Progress } from 'antd';
import { CameraOutlined, SafetyOutlined, UploadOutlined, CrownFilled } from '@ant-design/icons';
import type { ThanhBenProps } from '@/services/Khách hàng/Tài khoản/typing';
import { formatNumberViVN } from '@/utils/format';

const ThanhBen: React.FC<ThanhBenProps> = ({ nguoiDungHienTai, duongDanAnhDaiDien, laAnhDaiDien, truocKhiTaiLen, thongTinHang }) => {
    const renderAvatar = () => {
        if (laAnhDaiDien()) {
            return <Avatar size={128} src={duongDanAnhDaiDien} className="anh-dai-dien-tai-khoan" />;
        }
        return (
            <Avatar size={128} className="anh-dai-dien-tai-khoan anh-dai-dien-chu">
                {duongDanAnhDaiDien || 'U'}
            </Avatar>
        );
    };

    return (
        <section className="thanh-ben-tai-khoan the-tai-khoan">
            <div className="nghe-thuat-anh-dai-dien" aria-hidden="true">
                <span className="chiec-la chiec-la-a" />
                <span className="chiec-la chiec-la-b" />
            </div>

            <div className="xem-truoc-anh-dai-dien">
                {renderAvatar()}
                <span className="huy-hieu-may-anh">
                    <CameraOutlined />
                </span>
            </div>

            <h2>{nguoiDungHienTai.name}</h2>
            <p className="phong-ban-nguoi-dung">{nguoiDungHienTai.dept}</p>

            <div className="thong-tin-hang">
                <div className="tieu-de-hang" style={{ color: thongTinHang?.color || '#cd7f32' }}>
                    <CrownFilled /> Hạng {thongTinHang?.name || 'Đồng'}
                </div>
                <div className="diem-hang">
                    Điểm thưởng: <strong>{formatNumberViVN(nguoiDungHienTai.points || 0)}</strong>
                </div>
                <div className="chi-tieu-hang">
                    Đã chi tiêu: {formatNumberViVN(nguoiDungHienTai.totalSpent || 0)}đ
                </div>
            </div>

            <div className="khoi-tai-anh-dai-dien">
                <strong>Ảnh đại diện</strong>
                <span>JPG, PNG tối đa 2MB</span>
                <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={truocKhiTaiLen}
                    accept="image/*"
                >
                    <Button icon={<UploadOutlined />} className="nut-tai-len">
                        Tải ảnh lên
                    </Button>
                </Upload>
            </div>

            <div className="ghi-chu-bao-mat">
                <SafetyOutlined />
                <span>Thông tin của bạn được bảo mật và chỉ hiển thị nội bộ.</span>
            </div>
        </section>
    );
};

export default ThanhBen;
