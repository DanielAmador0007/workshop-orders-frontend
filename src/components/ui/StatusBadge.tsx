import { WorkOrderStatus } from '../../types';

const statusConfig: Record<WorkOrderStatus, { label: string; color: string }> = {
  [WorkOrderStatus.RECEIVED]: { label: 'Received', color: 'bg-yellow-100 text-yellow-800' },
  [WorkOrderStatus.IN_PROGRESS]: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  [WorkOrderStatus.COMPLETED]: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  [WorkOrderStatus.DELIVERED]: { label: 'Delivered', color: 'bg-gray-100 text-gray-800' },
};

export function StatusBadge({ status }: { status: WorkOrderStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
