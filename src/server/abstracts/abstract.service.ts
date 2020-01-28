import { FindOneOptions } from 'typeorm';
import { logger } from '@server/logger';

export abstract class AbstractService<T> {
  protected name: string;

  protected async checkIfExists(id: string | null, options?: FindOneOptions<T>) {
    let element;
    try {
      if (id !== null) {
        element = await this.findById(id);
      }

      if (!id && options) {
        element = await this.findByOptions(options);
      }

      if (!id && !options) {
        throw new Error('No parameters found');
      }

      return !!element;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  protected throwNotFound() {
    const err: Error & { status?: number } = new Error(`${this.name} not found in database`);
    err.status = 404;
    throw err;
  }

  protected abstract async findById(id: string): Promise<T>;
  protected abstract async findByOptions(options: FindOneOptions<T>): Promise<T>;
}
