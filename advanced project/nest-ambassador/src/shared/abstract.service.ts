import { DeleteResult, Repository, UpdateResult } from 'typeorm';

export abstract class AbstractService<T> {
  protected constructor(protected readonly repository: Repository<any>) {}

  async save(options: Partial<any>): Promise<T> {
    return this.repository.save(options);
  }

  async find(options: Partial<any> = {}): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(options: Partial<any>): Promise<T> {
    return this.repository.findOne(options);
  }

  async update(id: number, options: Partial<any>): Promise<UpdateResult> {
    return this.repository.update(id, options);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
