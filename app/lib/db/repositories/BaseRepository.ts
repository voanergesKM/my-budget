import { Document, Model, PipelineStage } from "mongoose";

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  find(query: Record<string, any>) {
    return this.model.find(query).sort({ createdAt: -1 });
  }

  findPaginated(
    query: Record<string, any>,
    skip: number,
    limit: number,
    populate?: string[]
  ) {
    let q = this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    populate && q.populate(populate);

    return q;
  }

  findById(id: string) {
    return this.model.findById(id);
  }

  create(payload: Partial<T>) {
    return this.model.create(payload);
  }

  count(query: Record<string, any>) {
    return this.model.countDocuments(query);
  }

  insertMany(payload: Partial<T>[]) {
    return this.model.insertMany(payload);
  }

  updateOne(id: string, payload: Partial<T>) {
    return this.model.findByIdAndUpdate(id, payload, { new: true });
  }

  deleteOne(filter: Record<string, any>) {
    return this.model.findOneAndDelete(filter);
  }

  deleteMany(filter: Record<string, any>) {
    return this.model.deleteMany(filter);
  }

  aggregate(pipeline: PipelineStage[]) {
    return this.model.aggregate(pipeline);
  }
}
