import {DefaultCrudRepository} from '@loopback/repository';
import {UserSlack, UserSlackRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserSlackRepository extends DefaultCrudRepository<
  UserSlack,
  typeof UserSlack.prototype.id,
  UserSlackRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserSlack, dataSource);
  }
}
