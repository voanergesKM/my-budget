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
});

export default QueryKeys;
