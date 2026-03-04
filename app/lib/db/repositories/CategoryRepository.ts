import { Category } from "@/app/lib/db/models";

import { BaseRepository } from "./BaseRepository";

class CategoryRepository extends BaseRepository<any> {
  constructor() {
    super(Category);
  }

  find(query: Record<string, any>) {
    return this.model
      .find(query)
      .sort({ createdAt: -1 })
      .populate(["group", "createdBy"]);
  }

  findById(id: string) {
    return this.model.findById(id).populate(["group", "createdBy"]);
  }
}

export const categoryRepository = new CategoryRepository();
