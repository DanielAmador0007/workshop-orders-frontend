import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Modal } from '../../components/ui';
import { customersApi } from '../../api';
import type { Vehicle, Customer } from '../../types';

const vehicleSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  plate: z.string().min(1, 'Plate is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1900, 'Invalid year').max(2100, 'Invalid year'),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleForm) => Promise<void>;
  vehicle?: Vehicle | null;
}

export function VehicleFormModal({ isOpen, onClose, onSubmit, vehicle }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    values: vehicle
      ? {
          customerId: vehicle.customerId,
          plate: vehicle.plate,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
        }
      : undefined,
  });

  useEffect(() => {
    if (isOpen) {
      customersApi.getAll({ limit: 100 }).then((res) => setCustomers(res.data));
    }
  }, [isOpen]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: VehicleForm) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={vehicle ? 'Edit Vehicle' : 'New Vehicle'}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {!vehicle && (
          <Select
            label="Customer"
            placeholder="Select a customer..."
            options={customers.map((c) => ({ value: c.id, label: `${c.name} (${c.email})` }))}
            error={errors.customerId?.message}
            {...register('customerId')}
          />
        )}
        <Input label="Plate" placeholder="ABC-1234" error={errors.plate?.message} {...register('plate')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Brand" placeholder="Toyota" error={errors.brand?.message} {...register('brand')} />
          <Input label="Model" placeholder="Corolla" error={errors.model?.message} {...register('model')} />
        </div>
        <Input label="Year" type="number" placeholder="2023" error={errors.year?.message} {...register('year')} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {vehicle ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
