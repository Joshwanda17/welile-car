export const formatUGX = (amount: number): string => {
  return `UGX ${amount.toLocaleString('en-UG')}`;
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-UG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
