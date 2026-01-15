// src/pages/CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import categoriesApi from '../api/categoriesApi';

const { Title, Text } = Typography;

function CategoriesPage() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      setLoadingList(true);
      const res = await categoriesApi.getAll();
      const list = res.data.data.categories || [];
      setCategories(list);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load categories', err);
      message.error('Không tải được danh mục');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFinish = async (values) => {
    try {
      setSubmitting(true);
      if (editingCategory) {
        await categoriesApi.update(editingCategory.categoryId, values);
        message.success('Cập nhật danh mục thành công');
      } else {
        await categoriesApi.create(values);
        message.success('Thêm danh mục thành công');
      }
      form.resetFields();
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message || 'Lưu danh mục thất bại';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      type: record.type,
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    form.resetFields();
  };

  const handleDelete = async (record) => {
    if (record.isSystem) {
      message.warning('Không thể xóa danh mục hệ thống');
      return;
    }
    const ok = window.confirm(
      `Bạn có chắc muốn xóa danh mục "${record.name}"?`,
    );
    if (!ok) return;

    try {
      await categoriesApi.remove(record.categoryId);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message || 'Xóa danh mục thất bại';
      message.error(msg);
    }
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (value) =>
        value === 'income' ? (
          <Tag color="green">Thu nhập</Tag>
        ) : (
          <Tag color="red">Chi phí</Tag>
        ),
    },
    {
      title: 'Nguồn',
      dataIndex: 'isSystem',
      key: 'isSystem',
      render: (isSystem) =>
        isSystem ? (
          <Tag color="blue">Hệ thống</Tag>
        ) : (
          <Tag color="default">Cá nhân</Tag>
        ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            disabled={record.isSystem} // không cho sửa category hệ thống
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record)}
            disabled={record.isSystem} // không cho xóa category hệ thống
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Danh mục
        </Title>
        <Text style={{ color: '#e5e7eb' }}>
          Xin chào, <strong>{user?.fullName}</strong>
        </Text>
      </div>

      {/* Form thêm / sửa */}
      <Card
        title={
          editingCategory ? 'Sửa danh mục cá nhân' : 'Thêm danh mục cá nhân'
        }
        style={{ marginBottom: 16 }}
        extra={
          editingCategory && (
            <Button type="link" onClick={handleCancelEdit}>
              Hủy chỉnh sửa
            </Button>
          )
        }
      >
        <Form
          layout="inline"
          form={form}
          onFinish={handleFinish}
          style={{ rowGap: 12 }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Nhập tên danh mục' }]}
          >
            <Input placeholder="Ví dụ: Gym, Coffee..." />
          </Form.Item>
          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: 'Chọn loại' }]}
          >
            <Select
              placeholder="Chọn loại"
              style={{ width: 160 }}
              options={[
                { value: 'income', label: 'Thu nhập' },
                { value: 'expense', label: 'Chi phí' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={submitting}
            >
              {editingCategory ? 'Lưu' : 'Thêm'}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Bảng danh mục */}
      <Card title="Danh sách danh mục">
        <Table
          rowKey="categoryId"
          dataSource={categories}
          columns={columns}
          loading={loadingList}
          pagination={false}
        />
      </Card>
    </>
  );
}

export default CategoriesPage;