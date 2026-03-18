import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, TextArea, Modal } from '../../components/ui';
import { vehiclesApi } from '../../api';
import type { WorkOrder, Vehicle } from '../../types';

const workOrderSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  description: z.string().min(1, 'Description is required'),
  technicianNotes: z.string().optional(),
});

type WorkOrderForm = z.infer<typeof workOrderSchema>;

const editSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  technicianNotes: z.string().optional(),
});

type EditForm = z.infer<typeof editSchema>;

interface CreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkOrderForm) => Promise<void>;
}

export function CreateWorkOrderModal({ isOpen, onClose, onSubmit }: CreateProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WorkOrderForm>({ resolver: zodResolver(workOrderSchema) });

  useEffect(() => {
    if (isOpen) {
      vehiclesApi.getAll({ limit: 100 }).then((res) => setVehicles(res.data));
    }
  }, [isOpen]);

  const handleClose = () => { reset(); onClose(); };

  const handleFormSubmit = async (data: WorkOrderForm) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Work Order">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Select
          label="Vehicle"
          placeholder="Select a vehicle..."
          options={vehicles.map((v) => ({
            value: v.id,
            label: `${v.plate} — ${v.brand} ${v.model} (${v.customer?.name || 'N/A'})`,
          }))}
          error={errors.vehicleId?.message}
          {...register('vehicleId')}
        />
        <TextArea
          label="Description"
          placeholder="Describe the work to be done..."
          error={errors.description?.message}
          {...register('description')}
        />
        <TextArea
          label="Technician Notes (optional)"
          placeholder="Any initial notes..."
          error={errors.technicianNotes?.message}
          {...register('technicianNotes')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Create</Button>
        </div>
      </form>
    </Modal>
  );
}

interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditForm) => Promise<void>;
  workOrder: WorkOrder | null;
}

export function EditWorkOrderModal({ isOpen, onClose, onSubmit, workOrder }: EditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    values: workOrder
      ? { description: workOrder.description, technicianNotes: workOrder.technicianNotes || '' }
      : undefined,
  });

  const handleClose = () => { reset(); onClose(); };

  const handleFormSubmit = async (data: EditForm) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Work Order">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input label="Vehicle" value={workOrder ? `${workOrder.vehicle?.plate || ''} — ${workOrder.vehicle?.brand || ''} ${workOrder.vehicle?.model || ''}` : ''} disabled />
        <TextArea label="Description" error={errors.description?.message} {...register('description')} />
        <TextArea label="Technician Notes" error={errors.technicianNotes?.message} {...register('technicianNotes')} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Update</Button>
        </div>
      </form>
    </Modal>
  );
}
