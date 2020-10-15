import { BytesLike } from 'ethers';
import { IsBytesLike } from './validators';

export class SignMessageDto {
  @IsBytesLike({
    acceptText: true,
  })
  message: BytesLike;
}
