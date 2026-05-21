const rules = {
  required: [{ required: true, message: 'Trường này không được để trống' }],
  email: [
    { required: true, message: 'Vui lòng nhập email' },
    { type: 'email' as const, message: 'Email không hợp lệ' },
  ],
};

export default rules;
