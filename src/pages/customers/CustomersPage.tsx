import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { customersApi } from '../../api';
import { usePaginated } from '../../hooks';
import { Button, Pagination, ConfirmDialog } from '../../components/ui';
import { CustomerFormModal } from './CustomerFormModal';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types';

export function CustomersPage() {
  const fetchCustomers = useCallback(
    (params: { page?: number; limit?: number }) => customersApi.getAll(params),
    [],
  );
  const { data, totalPages, page, loading, setPage, refetch } = usePaginated<Customer>({
    fetchFn: fetchCustomers,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async (formData: CreateCustomerRequest) => {
    await customersApi.create(formData);
    toast.success('Customer created');
    refetch();
  };

  const handleUpdate = async (formData: UpdateCustomerRequest) => {
    if (!editing) return;
    await customersApi.update(editing.id, formData);
    toast.success('Customer updated');
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customersApi.delete(deleteTarget.id);
      toast.success('Customer deleted');
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
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">Manage your workshop customers</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          + New Customer
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No customers found</td>
              </tr>
            ) : (
              data.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{customer.phone || '—'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => { setEditing(customer); setModalOpen(true); }}
                      className="mr-3 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(customer)}
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

      <CustomerFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={editing ? handleUpdate : handleCreate}
        customer={editing}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
}
