const QueryKeys = Object.freeze({
  getCurrentUser: "getCurrentUser",

  shoppingList: "shoppingList",
  getCurrentShopping: "getCurrentShopping",

  groupsList: "groupsList",
  getCurrentGroup: "getCurrentGroup",

  categoriesList: "categoriesList",

  getTransactionsList: "getTransactionsList",

  currencyRates: "currencyRates",

  categorySummary: "categorySummary",
  summaryByMonth: "summaryByMonth",

  scheduledPaymentsList: (
    groupId: string | null,
    page?: number,
    pageSize?: number
  ) =>
    `scheduledPaymentsList-${groupId || "null"}, page-${page || "null"}, pageSize-${pageSize || "null"}`,

  vehiclesList: () => "vehiclesList",
  vehicleById: (vehicleId: string) => `vehicle, vehicleId=${vehicleId}`,
  currentVehicle: (vehicleId: string) =>
    `vehicle with stats, vehicleId=${vehicleId}`,
  vehicleFuelRecords: (vehicleId: string, page?: string, pageSize?: string) => [
    "vehicleFuelRecords",
    vehicleId,
    page ?? "all",
    pageSize ?? "all",
  ],
  vehicleServiceRecords: (
    vehicleId: string,
    page?: string,
    pageSize?: string
  ) => ["vehicleServiceRecords", vehicleId, page ?? "all", pageSize ?? "all"],
  vehicleScheduleRecords: (
    vehicleId: string,
    page?: string,
    pageSize?: string
  ) => ["vehicleScheduleRecords", vehicleId, page ?? "all", pageSize ?? "all"],
  vehicleReminders: (vehicleId: string) => ["vehicleReminders", vehicleId],
});

export default QueryKeys;
