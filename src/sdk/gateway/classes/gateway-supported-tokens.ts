import { Type } from 'class-transformer';
import { WithTypename } from '../../common';
import { GatewaySupportedToken } from './gateway-supported-token';

export class GatewaySupportedTokens extends WithTypename {
  @Type(() => GatewaySupportedToken)
  items: GatewaySupportedToken[];
}
