import apiClient from './client';
import type {
  WorkOrder,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
  WorkOrderStatus,
  PaginatedResponse,
  WorkOrderFilterParams,
} from '../types';

export const workOrdersApi = {
  getAll: (params?: WorkOrderFilterParams) =>
    apiClient
      .get<PaginatedResponse<WorkOrder>>('/work-orders', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<WorkOrder>(`/work-orders/${id}`).then((r) => r.data),

  create: (data: CreateWorkOrderRequest) =>
    apiClient.post<WorkOrder>('/work-orders', data).then((r) => r.data),

  update: (id: string, data: UpdateWorkOrderRequest) =>
    apiClient.patch<WorkOrder>(`/work-orders/${id}`, data).then((r) => r.data),

  updateStatus: (id: string, status: WorkOrderStatus) =>
    apiClient
      .patch<WorkOrder>(`/work-orders/${id}/status`, { status })
      .then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/work-orders/${id}`),
};
