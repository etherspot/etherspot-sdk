import { Type } from 'class-transformer';
import { PoolsActivity } from './pools-activity';

export class PoolsActivities {
    @Type(() => PoolsActivity)
    items: PoolsActivity[];
}
