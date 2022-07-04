import { BaseClass } from '../../common';

export class StreamTransactionPayload extends BaseClass<StreamTransactionPayload> {
  error: string;

  data: string;

  to: string;

}