// src/components/dashboard/QuickAddTransactionModal.jsx
import React, { useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
} from 'antd';
import dayjs from 'dayjs';

function QuickAddTransactionModal({
  open,
  onCancel,
  onSubmit, // (payload, form) => Promise
  submitting,
  categories,
}) {
  const [form] = Form.useForm();

  const typeValue = Form.useWatch('type', form) || 'expense';

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === typeValue),
    [categories, typeValue],
  );

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    const payload = {
      type: values.type,
      amount: Number(values.amount),
      categoryId: values.categoryId || null,
      transactionDate: values.date
        ? values.date.format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      description: values.description || '',
    };
    onSubmit(payload, form);
  };

  const handleModalCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title="Thêm giao dịch nhanh"
      onOk={handleOk}
      onCancel={handleModalCancel}
      confirmLoading={submitting}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'expense',
          date: dayjs(),
        }}
        onFinish={handleFinish}
      >
        <Form.Item label="Loại" name="type">
          <Radio.Group>
            <Radio.Button value="income">Thu nhập</Radio.Button>
            <Radio.Button value="expense">Chi phí</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Danh mục" name="categoryId">
          <Select
            placeholder="Chọn danh mục"
            allowClear
            options={filteredCategories.map((c) => ({
              label: c.name,
              value: c.categoryId,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Số tiền"
          name="amount"
          rules={[
            { required: true, message: 'Nhập số tiền' },
            { pattern: /^\d+(\.\d+)?$/, message: 'Số tiền phải là số hợp lệ' },
          ]}
        >
          <Input placeholder="Ví dụ: 500000" />
        </Form.Item>

        <Form.Item label="Ngày" name="date">
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={2} placeholder="Ví dụ: Lương tháng 1, ăn trưa..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default QuickAddTransactionModal;