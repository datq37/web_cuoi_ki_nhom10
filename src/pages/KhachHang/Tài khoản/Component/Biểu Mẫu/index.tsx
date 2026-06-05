import React from 'react';
import { Form, Input, Select, Button, Typography } from 'antd';
import {
    HomeOutlined,
    MailOutlined,
    PhoneOutlined,
    SaveOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { BieuMauProps } from '@/services/KhachHang/Tài khoản/typing';

const { Option } = Select;

const BieuMau: React.FC<BieuMauProps> = ({ bieuMau, khiHoanThanh, capNhatHoSo }) => {
    return (
        <section className="noi-dung-tai-khoan the-tai-khoan">
            <Form
                form={bieuMau}
                layout="vertical"
                onFinish={(values) => khiHoanThanh(values, capNhatHoSo)}
                className="bieu-mau-tai-khoan"
            >
                <div className="tieu-de-phan-bieu-mau">
                    <span><UserOutlined /></span>
                    <Typography.Title level={3} style={{ margin: 0 }}>Thông tin cơ bản</Typography.Title>
                </div>

                <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" size="large" />
                </Form.Item>

                <div className="hang-bieu-mau">
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="0987654321" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email công việc"
                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="email@company.com" size="large" />
                    </Form.Item>
                </div>

                <div className="duong-chia-bieu-mau" />
                <div className="tieu-de-phan-bieu-mau">
                    <span><HomeOutlined /></span>
                    <Typography.Title level={3} style={{ margin: 0 }}>Thông tin giao hàng nội bộ</Typography.Title>
                </div>

                <div className="hang-bieu-mau">
                    <Form.Item
                        name="dept"
                        label="Phòng ban"
                        rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
                    >
                        <Select size="large" placeholder="Chọn phòng ban">
                            <Option value="IT / Engineering">IT / Engineering</Option>
                            <Option value="Marketing">Marketing</Option>
                            <Option value="Nhân sự">Nhân sự</Option>
                            <Option value="Kế toán">Kế toán</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="building"
                        label="Tòa nhà"
                        rules={[{ required: true, message: 'Vui lòng chọn tòa nhà!' }]}
                    >
                        <Select size="large" placeholder="Chọn tòa nhà">
                            <Option value="Tòa nhà A">Tòa nhà A</Option>
                            <Option value="Tòa nhà B">Tòa nhà B</Option>
                            <Option value="Tòa nhà C">Tòa nhà C</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="hang-bieu-mau">
                    <Form.Item
                        name="floor"
                        label="Tầng"
                        rules={[{ required: true, message: 'Vui lòng chọn tầng!' }]}
                    >
                        <Select size="large" placeholder="Chọn tầng">
                            <Option value="Tầng 1">Tầng 1</Option>
                            <Option value="Tầng 3">Tầng 3</Option>
                            <Option value="Tầng 5">Tầng 5</Option>
                            <Option value="Tầng 7">Tầng 7</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="desk"
                        label="Vị trí / Chỗ ngồi"
                        rules={[{ required: true, message: 'Vui lòng nhập vị trí chỗ ngồi!' }]}
                    >
                        <Input prefix={<HomeOutlined />} placeholder="Bàn 502" size="large" />
                    </Form.Item>
                </div>

                <div className="hanh-dong-bieu-mau">
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        icon={<SaveOutlined />}
                        className="nut-luu"
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </Form>
        </section>
    );
};

export default BieuMau;
