// ─── Auth ────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
}

// ─── Pagination ──────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Customer ────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
}

// ─── Vehicle ─────────────────────────────────────────
export interface Vehicle {
  id: string;
  customerId: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  customerId: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
}

export interface UpdateVehicleRequest {
  plate?: string;
  brand?: string;
  model?: string;
  year?: number;
}

// ─── Work Order ──────────────────────────────────────
export enum WorkOrderStatus {
  RECEIVED = 'RECEIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELIVERED = 'DELIVERED',
}

export interface WorkOrder {
  id: string;
  vehicleId: string;
  description: string;
  status: WorkOrderStatus;
  technicianNotes: string | null;
  vehicle?: Vehicle;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkOrderRequest {
  vehicleId: string;
  description: string;
  technicianNotes?: string;
}

export interface UpdateWorkOrderRequest {
  description?: string;
  technicianNotes?: string;
}

export interface WorkOrderFilterParams extends PaginationParams {
  status?: WorkOrderStatus;
  customerId?: string;
}

// ─── API Error ───────────────────────────────────────
export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}
