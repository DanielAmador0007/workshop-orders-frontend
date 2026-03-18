import apiClient from './client';
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export const customersApi = {
  getAll: (params?: PaginationParams) =>
    apiClient
      .get<PaginatedResponse<Customer>>('/customers', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Customer>(`/customers/${id}`).then((r) => r.data),

  create: (data: CreateCustomerRequest) =>
    apiClient.post<Customer>('/customers', data).then((r) => r.data),

  update: (id: string, data: UpdateCustomerRequest) =>
    apiClient.patch<Customer>(`/customers/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/customers/${id}`),
};
