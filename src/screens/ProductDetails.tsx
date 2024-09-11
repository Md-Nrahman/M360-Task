import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { useFetchProductByIdQuery } from '../api/productSlice';
import { Card, Descriptions, Spin, Alert, Button, Row, Col, Image } from 'antd';
import UpdateProductModal from '../components/UpdateProductModal';

const ProductDetails: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
  const { id } = useParams<{ id: string }>(); 
  const productId = Number(id); 
  const { data: product, error, isLoading } = useFetchProductByIdQuery(productId);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  if (isLoading) return <Spin tip="Loading..." />;
  if (error) return <Alert message="Error" description={String(error)} type="error" showIcon />;

  return (
    <>
    <Card bordered style={{ maxWidth: 1200, margin: 'auto' }} >
    <Row gutter={16} className="product-description-row">
      <Col xs={24} md={12} className="product-image-col">
        <Image alt={product?.title} src={product?.thumbnail} preview={false} />
      </Col>
      <Col xs={24} md={12} className="product-specs-col">
      <Row gutter={16} align="middle">
      <Col xs={24} md={12} style={{ padding: '20px' }}>
        <div style={{ textAlign: 'left' }}><h3 >{product?.title}</h3></div>
      </Col>
      <Col xs={24} md={12} style={{ padding: '20px' }}>
        <div style={{ textAlign: 'right' }}><Button type="primary" onClick={handleOpenModal}>
      Edit Product
    </Button></div>
      </Col>
    </Row>
        <Descriptions bordered column={1}>
        <Descriptions.Item label="Brand">{product?.brand}</Descriptions.Item>
        <Descriptions.Item label="Category">{product?.category}</Descriptions.Item>
        <Descriptions.Item label="Price">${product?.price}</Descriptions.Item>
        <Descriptions.Item label="Stock">{product?.stock}</Descriptions.Item>
        <Descriptions.Item label="Description" span={3}>
          {product?.description}
        </Descriptions.Item>
        </Descriptions>
        <p>{product?.description}</p>
      </Col>
    </Row>
  </Card>

    {isModalVisible && id!==undefined && <UpdateProductModal setIsModalVisible={setIsModalVisible} id={id} />}
    </>
  );
};

export default ProductDetails;
