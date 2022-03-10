import { IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseClass } from '../../common';
import { CrossChainBridgeChainCurrency } from './cross-chain-bridge-chain-currency';

export class CrossChainBridgeSupportedChain extends BaseClass<CrossChainBridgeSupportedChain> {
  chainId: number;

  name: string;

  @IsBoolean()
  isL1: boolean;

  @IsBoolean()
  sendingEnabled: boolean;

  icon: string;

  @IsBoolean()
  receivingEnabled: boolean;

  @Type(() => CrossChainBridgeChainCurrency)
  currency: CrossChainBridgeChainCurrency;

  @IsArray()
  rpcs: string[];

  @IsArray()
  explorers: string[];
}
