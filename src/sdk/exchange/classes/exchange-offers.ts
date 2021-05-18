import { Type } from 'class-transformer';
import { ExchangeOffer } from './exchange-offer';

export class ExchangeOffers {
  @Type(() => ExchangeOffer)
  items: ExchangeOffer[];
}
