import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { BlockStats } from './classes';

export class BlockService extends Service {
  async getCurrentBlockNumber(): Promise<number> {
    let result = 1;

    const { apiService } = this.services;

    const { blockStats } = await apiService.query<{
      blockStats: BlockStats;
    }>(
      gql`
        query($chainId: Int) {
          blockStats(chainId: $chainId) {
            currentBlockNumber
            lastProcessedBlockNumber
          }
        }
      `,
      {
        models: {
          blockStats: BlockStats,
        },
      },
    );

    if (blockStats && blockStats.currentBlockNumber) {
      result = blockStats.currentBlockNumber;
    }

    return result;
  }
}
