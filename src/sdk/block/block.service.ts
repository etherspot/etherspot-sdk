import { gql } from '@apollo/client/core';
import { Service } from '../common';
import { BlockStats } from './classes';

export class BlockService extends Service {
  async getBlockStats(): Promise<BlockStats> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: BlockStats;
    }>(
      gql`
        query {
          blockStats {
            currentOnchainBlockNumber
            lastProcessedBlockNumber
          }
        }
      `,
      {
        models: {
          result: BlockStats,
        },
      },
    );

    return result;
  }
}
