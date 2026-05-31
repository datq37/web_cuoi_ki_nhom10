import { type FormInstance } from 'antd';
import { isValue } from './common';
import { trim } from './text';

export const buildFormData = (payload: any) => {
	const form = new FormData();
	Object.keys(payload).map((key) => {
		if (isValue(payload[key])) {
			if (Array.isArray(payload[key])) {
				for (let i = 0; i < payload[key].length; i += 1) {
					form.append(key, payload[key][i]);
				}
				return;
			}
			form.set(key, trim(payload[key]));
		}
	});
	return form;
};

export const chuanHoaObject = (obj: any) => {
	if (!obj) return obj;
	if (typeof obj !== 'object') return trim(obj);
	Object.keys(obj).forEach((key) => (obj[key] = chuanHoaObject(obj[key])));
	return obj;
};

export const resetFieldsForm = (form: FormInstance<any>, formDefaultValues?: Record<string, any>) => {
	const values = form.getFieldsValue();
	Object.keys(values).map((k) => (values[k] = undefined));
	form.setFieldsValue({ ...values, ...(formDefaultValues ?? {}) });
	form.setFields(form.getFieldsError().map((item) => ({ name: item.name, errors: undefined, warnings: undefined })));
};
