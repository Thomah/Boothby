import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserSlack, UserSlackRelations} from '../models';

export class UserSlackRepository extends DefaultCrudRepository<
  UserSlack,
  typeof UserSlack.prototype.id,
  UserSlackRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(UserSlack, dataSource);
  }
}
