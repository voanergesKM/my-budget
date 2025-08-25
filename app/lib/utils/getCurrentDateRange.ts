export const getCurrentMonthRange = () => {
  const now = new Date();

  const from = new Date(now.getFullYear(), now.getMonth(), 1);

  return { from, to: now };
};
