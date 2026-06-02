import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react';

export interface ConfirmModalOptions {
  title: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  onOk: () => void;
  onCancel?: () => void;
}

/**
 * ConfirmModal
 *
 * Component modal xác nhận dùng chung — thay thế Modal.confirm()
 * rải rác trong nhiều trang.
 *
 * @example
 * ConfirmModal.show({
 *   title: 'Xoá nguyên liệu?',
 *   content: 'Hành động không thể hoàn tác.',
 *   danger: true,
 *   onOk: () => handleDelete(id),
 * });
 */
const ConfirmModal = {
  show({
    title,
    content,
    okText = 'Xác nhận',
    cancelText = 'Huỷ',
    danger = false,
    onOk,
    onCancel,
  }: ConfirmModalOptions) {
    Modal.confirm({
      title,
      content,
      icon: <ExclamationCircleOutlined style={{ color: danger ? '#dc2626' : '#f97316' }} />,
      okText,
      cancelText,
      okType: danger ? 'danger' : 'primary',
      centered: true,
      okButtonProps: { style: { borderRadius: 8 } },
      cancelButtonProps: { style: { borderRadius: 8 } },
      onOk,
      onCancel,
    });
  },

  /** Shortcut cho xoá */
  delete({
    title,
    content,
    onOk,
  }: Pick<ConfirmModalOptions, 'title' | 'content' | 'onOk'>) {
    ConfirmModal.show({
      title,
      content: content ?? 'Hành động này không thể hoàn tác.',
      okText: 'Xoá',
      danger: true,
      onOk,
    });
  },
};

export default ConfirmModal;
