import React from 'react';
import { Button, Avatar, Upload, Typography } from 'antd';
import { CameraOutlined, SafetyOutlined, UploadOutlined, CrownFilled } from '@ant-design/icons';
import type { ThanhBenProps } from '@/services/KhachHang/Tài khoản/typing';
import { formatNumberViVN } from '@/utils/format';

const ThanhBen: React.FC<ThanhBenProps> = ({ nguoiDungHienTai, duongDanAnhDaiDien, laAnhDaiDien, truocKhiTaiLen, thongTinHang }) => {
    const diemThuong = Math.floor(Number(nguoiDungHienTai.points) || 0);

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

            <Typography.Title level={2} style={{ margin: 0, textAlign: 'center' }}>{nguoiDungHienTai.name}</Typography.Title>
            <Typography.Paragraph className="phong-ban-nguoi-dung" style={{ textAlign: 'center' }}>{nguoiDungHienTai.dept}</Typography.Paragraph>

            <div className="thong-tin-hang">
                <div className="tieu-de-hang" style={{ color: thongTinHang?.color || '#cd7f32' }}>
                    <CrownFilled /> Hạng {thongTinHang?.name || 'Đồng'}
                </div>
                <div className="diem-hang">
                    Điểm thưởng: <Typography.Text strong>{formatNumberViVN(diemThuong)}</Typography.Text>
                </div>
                <div className="chi-tieu-hang">
                    Đã chi tiêu: {formatNumberViVN(nguoiDungHienTai.totalSpent || 0)}đ
                </div>
            </div>

            <div className="khoi-tai-anh-dai-dien">
                <Typography.Text strong>Ảnh đại diện</Typography.Text>
                <Typography.Text style={{ fontSize: 11, color: '#666' }}>JPG, PNG tối đa 2MB</Typography.Text>
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
                <Typography.Text style={{ fontSize: 11, color: 'inherit' }}>Thông tin của bạn được bảo mật và chỉ hiển thị nội bộ.</Typography.Text>
            </div>
        </section>
    );
};

export default ThanhBen;
