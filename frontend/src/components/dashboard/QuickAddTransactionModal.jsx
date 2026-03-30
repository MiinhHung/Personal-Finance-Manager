// src/components/dashboard/QuickAddTransactionModal.jsx
import React, { useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  InputNumber,
  Typography,
} from 'antd';
import { DollarOutlined, TagOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
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
    () => (Array.isArray(categories) ? categories.filter((c) => c.type === typeValue) : []),
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
      title={<Typography.Title level={4} style={{ margin: 0 }}>Ghi chép giao dịch nhanh</Typography.Title>}
      onOk={handleOk}
      onCancel={handleModalCancel}
      confirmLoading={submitting}
      okText="Lưu giao dịch"
      cancelText="Hủy"
      destroyOnClose
      width={480}
      bodyStyle={{ paddingTop: '12px' }}
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
        <Form.Item name="type" style={{ marginBottom: '24px' }}>
          <Radio.Group 
            buttonStyle="solid" 
            style={{ width: '100%', display: 'flex' }}
          >
            <Radio.Button value="income" style={{ flex: 1, textAlign: 'center', height: '40px', lineHeight: '38px', borderRadius: '8px 0 0 8px' }}>Thu nhập</Radio.Button>
            <Radio.Button value="expense" style={{ flex: 1, textAlign: 'center', height: '40px', lineHeight: '38px', borderRadius: '0 8px 8px 0' }}>Chi phí</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item 
          label={<span><DollarOutlined /> Số tiền</span>} 
          name="amount"
          rules={[
            { required: true, message: 'Vui lòng nhập số tiền' },
          ]}
        >
          <InputNumber
            placeholder="0"
            style={{ width: '100%' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            addonAfter="₫"
            size="large"
            min={0}
          />
        </Form.Item>

        <Form.Item label={<span><TagOutlined /> Danh mục</span>} name="categoryId">
          <Select
            placeholder="Chọn danh mục phân loại"
            allowClear
            size="large"
            options={filteredCategories.map((c) => ({
              label: c.name,
              value: c.categoryId,
            }))}
          />
        </Form.Item>

        <Form.Item label={<span><CalendarOutlined /> Ngày giao dịch</span>} name="date">
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item label={<span><EditOutlined /> Ghi chú</span>} name="description">
          <Input.TextArea placeholder="Nhập mô tả ngắn gọn..." autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default QuickAddTransactionModal;