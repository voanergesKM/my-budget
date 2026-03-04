import { Shopping } from "@/app/lib/db/models";

import { BaseRepository } from "./BaseRepository";

class ShoppingRepository extends BaseRepository<any> {
  constructor() {
    super(Shopping);
  }

  findById(shoppingId: string) {
    return this.model.findById(shoppingId).populate(["createdBy", "groupId"]);
  }
}

export const shoppingRepository = new ShoppingRepository();
