import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '../../components/ui';
import type { Customer } from '../../types';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});

type CustomerForm = z.infer<typeof customerSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerForm) => Promise<void>;
  customer?: Customer | null;
}

export function CustomerFormModal({ isOpen, onClose, onSubmit, customer }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    values: customer
      ? { name: customer.name, email: customer.email, phone: customer.phone || '' }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CustomerForm) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={customer ? 'Edit Customer' : 'New Customer'}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input label="Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="john@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" placeholder="+1234567890" error={errors.phone?.message} {...register('phone')} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {customer ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
