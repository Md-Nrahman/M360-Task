import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../config';

interface Review {
  comment: string;
  date: string; 
  rating: number;
  reviewerEmail: string;
  reviewerName: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  stock: number;
  thumbnail: string;
  reviews: Review[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
}


export const productSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    fetchProducts: builder.query<ProductsResponse, void>({
      query: () => ({
        url:'products?limit=0&skip',
      }),
    }),
    fetchProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
    }),
    fetchCategories: builder.query<Category[], void>({
      query: () => 'products/categories',
    }),
    updateProductById: builder.mutation<Product, Partial<Product>>({
      query: ({ id, ...value }) => ({
        url: `products/${id}`,
        method: 'PATCH',
        body: value,
      }),
    }),
  }),
});


export const {useFetchProductsQuery, useFetchProductByIdQuery, useFetchCategoriesQuery, useUpdateProductByIdMutation } = productSlice;
