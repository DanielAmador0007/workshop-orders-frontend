import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { vehiclesApi } from '../../api';
import { usePaginated } from '../../hooks';
import { Button, Pagination, ConfirmDialog } from '../../components/ui';
import { VehicleFormModal } from './VehicleFormModal';
import type { Vehicle, CreateVehicleRequest, UpdateVehicleRequest } from '../../types';

export function VehiclesPage() {
  const fetchVehicles = useCallback(
    (params: { page?: number; limit?: number }) => vehiclesApi.getAll(params),
    [],
  );
  const { data, totalPages, page, loading, setPage, refetch } = usePaginated<Vehicle>({
    fetchFn: fetchVehicles,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async (formData: CreateVehicleRequest) => {
    await vehiclesApi.create(formData);
    toast.success('Vehicle created');
    refetch();
  };

  const handleUpdate = async (formData: UpdateVehicleRequest) => {
    if (!editing) return;
    await vehiclesApi.update(editing.id, formData);
    toast.success('Vehicle updated');
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await vehiclesApi.delete(deleteTarget.id);
      toast.success('Vehicle deleted');
      setDeleteTarget(null);
      refetch();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-sm text-gray-500">Manage customer vehicles</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          + New Vehicle
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plate</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">No vehicles found</td>
              </tr>
            ) : (
              data.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{vehicle.plate}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{vehicle.brand}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{vehicle.model}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{vehicle.year}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{vehicle.customer?.name || '—'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => { setEditing(vehicle); setModalOpen(true); }}
                      className="mr-3 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(vehicle)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-6 py-3">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <VehicleFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={editing ? handleUpdate : handleCreate}
        vehicle={editing}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Vehicle"
        message={`Are you sure you want to delete the vehicle "${deleteTarget?.plate}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}
