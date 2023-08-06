import { Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class BaseService<T extends ObjectLiteral> {
  constructor(private repository: Repository<T>) {}

  create(createDto: DeepPartial<T>): Promise<T> {
    return this.repository.save(this.repository.create(createDto));
  }

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<T[]> {
    return this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<T>): Promise<NullableType<T>> {
    return this.repository.findOne({
      where: fields,
    });
  }

  update(id: number, updateDto: DeepPartial<T>): Promise<T> {
    return this.repository.save({ id, ...updateDto });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
