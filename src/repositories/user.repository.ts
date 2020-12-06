import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, UserSlack} from '../models';
import {UserSlackRepository} from './user-slack.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly usersSlack: HasManyRepositoryFactory<UserSlack, typeof User.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserSlackRepository') protected userSlackRepositoryGetter: Getter<UserSlackRepository>,) {
    super(User, dataSource);
    this.usersSlack = this.createHasManyRepositoryFactoryFor('usersSlack', userSlackRepositoryGetter,);
  }
}
