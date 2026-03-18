import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { workOrdersApi } from '../../api';
import { usePaginated } from '../../hooks';
import { Button, Pagination, StatusBadge, ConfirmDialog, Select } from '../../components/ui';
import { CreateWorkOrderModal, EditWorkOrderModal } from './WorkOrderModals';
import { WorkOrderStatus } from '../../types';
import type { WorkOrder, WorkOrderFilterParams, PaginationParams } from '../../types';

const NEXT_STATUS: Record<string, WorkOrderStatus | null> = {
  [WorkOrderStatus.RECEIVED]: WorkOrderStatus.IN_PROGRESS,
  [WorkOrderStatus.IN_PROGRESS]: WorkOrderStatus.COMPLETED,
  [WorkOrderStatus.COMPLETED]: WorkOrderStatus.DELIVERED,
  [WorkOrderStatus.DELIVERED]: null,
};

const STATUS_ACTION_LABEL: Record<string, string> = {
  [WorkOrderStatus.RECEIVED]: 'Start Work',
  [WorkOrderStatus.IN_PROGRESS]: 'Complete',
  [WorkOrderStatus.COMPLETED]: 'Deliver',
};

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: WorkOrderStatus.RECEIVED, label: 'Received' },
  { value: WorkOrderStatus.IN_PROGRESS, label: 'In Progress' },
  { value: WorkOrderStatus.COMPLETED, label: 'Completed' },
  { value: WorkOrderStatus.DELIVERED, label: 'Delivered' },
];

export function WorkOrdersPage() {
  const [filters, setFilters] = useState<WorkOrderFilterParams>({});
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<WorkOrder | null>(null);
  const [deleteItem, setDeleteItem] = useState<WorkOrder | null>(null);
  const [advancing, setAdvancing] = useState<string | null>(null);

  const fetchFn = useCallback(
    (params: PaginationParams) =>
      workOrdersApi.getAll({ ...params, ...filters }),
    [filters],
  );

  const { data, totalPages, page, setPage, loading, refetch } = usePaginated<WorkOrder>({ fetchFn });

  const handleCreate = async (formData: { vehicleId: string; description: string; technicianNotes?: string }) => {
    await workOrdersApi.create(formData);
    toast.success('Work order created');
    refetch();
  };

  const handleUpdate = async (formData: { description: string; technicianNotes?: string }) => {
    if (!editItem) return;
    await workOrdersApi.update(editItem.id, formData);
    toast.success('Work order updated');
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await workOrdersApi.delete(deleteItem.id);
    toast.success('Work order deleted');
    setDeleteItem(null);
    refetch();
  };

  const handleAdvanceStatus = async (wo: WorkOrder) => {
    const next = NEXT_STATUS[wo.status];
    if (!next) return;
    setAdvancing(wo.id);
    try {
      await workOrdersApi.updateStatus(wo.id, next);
      toast.success(`Status updated to ${next}`);
      refetch();
    } catch {
      /* error handled by interceptor */
    } finally {
      setAdvancing(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
        <Button onClick={() => setShowCreate(true)}>+ New Work Order</Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4 items-end">
        <div className="w-48">
          <Select
            label="Filter by Status"
            options={statusOptions}
            value={filters.status || ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                status: (e.target.value as WorkOrderStatus) || undefined,
              }))
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No work orders found</td></tr>
            ) : (
              data.map((wo) => (
                <tr key={wo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {wo.vehicle?.plate} — {wo.vehicle?.brand} {wo.vehicle?.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {wo.vehicle?.customer?.name || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{wo.description}</td>
                  <td className="px-6 py-4"><StatusBadge status={wo.status} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(wo.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {NEXT_STATUS[wo.status] && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAdvanceStatus(wo)}
                        isLoading={advancing === wo.id}
                      >
                        {STATUS_ACTION_LABEL[wo.status]}
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => setEditItem(wo)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteItem(wo)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CreateWorkOrderModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreate} />
      <EditWorkOrderModal isOpen={!!editItem} onClose={() => setEditItem(null)} onSubmit={handleUpdate} workOrder={editItem} />
      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Delete work order"
        message={`Delete work order for "${deleteItem?.vehicle?.plate || ''}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
