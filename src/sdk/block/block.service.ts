import { gql } from '@apollo/client/core';
import { NetworkNames, networkNameToChainId } from '../network';
import { Service } from '../common';
import { BlockStats } from './classes';

export class BlockService extends Service {
  async getCurrentBlockNumber(network?: NetworkNames): Promise<number> {
    let result = 1;

    const { apiService } = this.services;

    const { blockStats } = await apiService.query<{
      blockStats: BlockStats;
    }>(
      gql`
        query($chainId: Int) {
          blockStats(chainId: $chainId) {
            currentBlockNumber
          }
        }
      `,
      {
        models: {
          blockStats: BlockStats,
        },
        chainId: networkNameToChainId(network),
      },
    );

    if (blockStats && blockStats.currentBlockNumber) {
      result = blockStats.currentBlockNumber;
    }

    return result;
  }
}
