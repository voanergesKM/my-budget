import { NextRequest } from "next/server";

import { withServerTranslations } from "@/app/lib/utils/withServerTranslations";

export function withTranslations(namespace: string) {
  return (handler: any) => async (req: NextRequest, ctx: any) => {
    const t = await withServerTranslations(namespace);

    return handler(req, { ...ctx, t });
  };
}
