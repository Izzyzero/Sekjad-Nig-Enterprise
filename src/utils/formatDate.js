export const formatDate = (value) =>
  new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(new Date(value))
