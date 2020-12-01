import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserSlack, UserSlackRelations, WorkspaceSlack} from '../models';
import {UserRepository} from './user.repository';
import {WorkspaceSlackRepository} from './workspace-slack.repository';

export class UserSlackRepository extends DefaultCrudRepository<
  UserSlack,
  typeof UserSlack.prototype.id,
  UserSlackRelations
> {
  public readonly workspace: BelongsToAccessor<
    WorkspaceSlack,
    typeof UserSlack.prototype.id
  >;

  public readonly user: BelongsToAccessor<User, typeof UserSlack.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('WorkspaceSlackRepository')
    protected workspaceSlackRepositoryGetter: Getter<WorkspaceSlackRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserSlack, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.workspace = this.createBelongsToAccessorFor(
      'workspace',
      workspaceSlackRepositoryGetter,
    );
    this.registerInclusionResolver(
      'workspace',
      this.workspace.inclusionResolver,
    );
  }
}
