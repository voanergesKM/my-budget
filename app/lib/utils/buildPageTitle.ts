const APP_NAME = "MyBudget";

export function buildPageTitle(pageName: string, context?: string) {
  let title = pageName.trim();

  if (context) {
    title += ` - ${context.trim()}`;
  }

  return `${title} | ${APP_NAME}`;
}
