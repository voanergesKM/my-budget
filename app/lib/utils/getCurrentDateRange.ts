export const getCurrentMonthRange = () => {
  const now = new Date();
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from, to };
};
