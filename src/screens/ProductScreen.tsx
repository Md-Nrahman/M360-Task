import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchProductsQuery } from '../api/productSlice';
import { List, Card, Spin, Alert } from 'antd';


const ProductScreen: React.FC = () => {
  const { data, error, isLoading } = useFetchProductsQuery();

  if (isLoading) return <Spin tip="Loading..." />;

  if (error) return <Alert message="Error" description={String(error)} type="error" showIcon />;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Products</h1>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4
        }}
        dataSource={data?.products}
        renderItem={(product) => (
          <List.Item key={product.id}>
            <Link to={`/product/${product.id}`}>
              <Card
                hoverable
                cover={<img alt={product.title} src={product.thumbnail} />}
              >
                <Card.Meta title={product.title} description={`$${product.price}`} />
              </Card>
            </Link>
          </List.Item>
        )}
      />

    </div>
  );
};

export default ProductScreen;
