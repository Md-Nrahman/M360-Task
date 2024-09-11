import React, { useEffect } from 'react';
import { useFetchProductByIdQuery, useFetchCategoriesQuery, useUpdateProductByIdMutation } from '../api/productSlice';
import { Form, Input, Button, Select, Spin, Alert, Space, Modal, DatePicker, Rate, Col, Row } from 'antd';
import moment from 'moment';

const { Option } = Select;

interface ProductProps {
  setIsModalVisible: (visible: boolean) => void;
  id: number | string;
}

interface Category {
  slug: string;
  name: string;
}


const UpdateProductModal: React.FC<ProductProps> = ({ setIsModalVisible, id }) => {
  const productId = Number(id);

  const { data: product, error: productError, isLoading: productLoading } = useFetchProductByIdQuery(productId);
  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useFetchCategoriesQuery();

  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductByIdMutation();

  // Form instance to control form data
  const [form] = Form.useForm();




  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFinish = async (values: any) => {
    console.log('Submitted Values:', values);
    try {
      await updateProduct({ id: productId, ...values }).unwrap();
      console.log('Product updated successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        reviews: product.reviews ? product.reviews.map(review => ({
          ...review,
          date: moment(review.date),
        })) : [],
      });
    }
  }, [product, form]);

  if (productLoading || categoriesLoading) return <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', 
    }}
  >
    <Spin tip="Loading..." />
  </div>;
  if (productError) return <Alert message="Error" description={String(productError)} type="error" showIcon />;
  if (categoriesError) return <Alert message="Error" description={String(categoriesError)} type="error" showIcon />;

  return (
    <Modal
      title="Update Product"
      open={true}
      onCancel={handleCloseModal}
      onOk={() => form.submit()}
      okText="Submit"
      confirmLoading={updateLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the product title!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the product description!' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
          <Select placeholder="Select a category">
            {categories?.map((category: Category) => (
              <Option key={category.slug} value={category.slug}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="brand" label="Brand" rules={[{ required: true, message: 'Please input the brand!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please input the stock amount!' }]}>
          <Input type="number" />
        </Form.Item>

        {/* Dynamic list of reviews */}
        <Form.List name="reviews">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'reviewerName']}
                      fieldKey={[fieldKey, 'reviewerName'] as [string | number, string]}
                      label="Reviewer Name"
                      rules={[{ required: true, message: 'Please input the reviewer name!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'reviewerEmail']}
                      fieldKey={[fieldKey, 'reviewerEmail'] as [string | number, string]}
                      label="Reviewer Email"
                      rules={[{ required: true, message: 'Please input the reviewer email!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'comment']}
                      fieldKey={[fieldKey, 'comment'] as [string | number, string]}
                      label="Comment"
                      rules={[{ required: true, message: 'Please input a comment!' }]}
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'rating']}
                      fieldKey={[fieldKey, 'rating'] as [string | number, string]}
                      label="Rating"
                      rules={[{ required: true, message: 'Please rate the product!' }]}
                    >
                      <Rate />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'date']}
                      fieldKey={[fieldKey, 'date'] as [string | number, string]}
                      label="Date"
                      rules={[{ required: true, message: 'Please select the review date!' }]}
                    >
                      <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={() => remove(name)} style={{ marginBottom: 24 }}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Review
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default UpdateProductModal;
