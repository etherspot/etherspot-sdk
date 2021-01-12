import { Type } from 'class-transformer';
import { GatewaySupportedToken } from './gateway-supported-token';

export class GatewaySupportedTokens {
  @Type(() => GatewaySupportedToken)
  items: GatewaySupportedToken[];
}
