import apiClient from './client';
import type {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export const vehiclesApi = {
  getAll: (params?: PaginationParams) =>
    apiClient
      .get<PaginatedResponse<Vehicle>>('/vehicles', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Vehicle>(`/vehicles/${id}`).then((r) => r.data),

  create: (data: CreateVehicleRequest) =>
    apiClient.post<Vehicle>('/vehicles', data).then((r) => r.data),

  update: (id: string, data: UpdateVehicleRequest) =>
    apiClient.patch<Vehicle>(`/vehicles/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/vehicles/${id}`),
};
