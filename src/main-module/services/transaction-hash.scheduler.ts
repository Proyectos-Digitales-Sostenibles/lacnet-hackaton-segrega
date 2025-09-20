import { LacchainProvider, LacchainSigner } from '@lacchain/gas-model-provider';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { ethers } from 'ethers';
import { ConfigProvider } from 'src/config.provider';
import { And, IsNull, LessThan, Not, Repository } from 'typeorm';
import { TransactionEntity } from '../datasources/database/models/entity/transaction.entity';
import { Mutex } from '../util/mutex';

const cpi = ConfigProvider.instance();

@Injectable()
export class TransactionHashSchedulerService {
  private readonly logger = new Logger(TransactionHashSchedulerService.name);

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
  ) {}

  // Every 10 seconds
  @Cron(CronExpression.EVERY_10_SECONDS)
  async computeMissingInmutableHashes(): Promise<void> {
    const unlock = await Mutex.getLock('compute-hash-lock').lock(true);
    const transactionQueryRunner = this.transactionRepo.manager.connection.createQueryRunner();
    await transactionQueryRunner.connect();
    await transactionQueryRunner.startTransaction();
    try {
      console.log('Computing missing inmutable hashes');

      // Find transactions with confirmDate not null and inmutableHash null
      const pendingTransactions = await this.transactionRepo
        .createQueryBuilder('t')
        .leftJoinAndSelect('t.sourceUser', 'sourceUser')
        .leftJoinAndSelect('t.targetUser', 'targetUser')
        .where('t.confirmDate IS NOT NULL')
        .andWhere(`t.inmutableHash IS NULL or t.inmutableHash = ''`)
        .orderBy('t.confirmDate', 'ASC')
        .limit(500)
        .getMany();

      if (pendingTransactions.length > 0) {
        let previousHash = '';
        for (const tx of pendingTransactions) {
          if (previousHash === '') {
            const previousTx = await this.transactionRepo.findOne({
              where: { confirmDate: And(LessThan(tx.confirmDate), Not(IsNull())) },
              order: { confirmDate: 'DESC' },
            });
            if (previousTx && !previousTx.inmutableHash) {
              throw new Error(`Previous transaction of first pending transaction ${previousTx.id} has no inmutable hash`);
            }
            previousHash = previousTx?.inmutableHash ? previousTx.inmutableHash.split('::')[1] : 'firsttransaction';
            const previousSmartContractHash = await this.getPreviousSmartContractHash();
            if (previousSmartContractHash !== previousHash) {
              throw new Error(`Previous smart contract hash does not match previous transaction hash ${previousSmartContractHash} !== ${previousHash}`);
              // TODO: Something has gone wrong. Fire alert to moderators to check the database consistency
            }

            console.log('Previous transaction of first pending transaction', previousTx?.id, previousHash);
          }

          // Lazy relations are promises; ensure we have identifiers
          const source = (await tx.sourceUser?.catch?.(() => null)) || null;
          const target = await tx.targetUser;

          const sourceId = source?.uuid ?? '';
          const targetId = target.uuid;
          const amountStr = String(tx.amount);

          const raw = `${previousHash}:${sourceId}|${targetId}|${amountStr}`;
          const hash = this.sha256Hash(raw);
          this.logger.log(`Computed immutable hash for transaction ${tx.id}: ${hash} (${raw})`);
          await transactionQueryRunner.manager.update(TransactionEntity, { id: tx.id }, { inmutableHash: `${raw}::${hash}` });
          previousHash = hash;
        }

        await this.updateSmartContract(previousHash);
        await transactionQueryRunner.commitTransaction();

        this.logger.log(`Computed immutable hash for ${pendingTransactions.length} transactions`);
      } else {
        this.logger.log('No pending transactions found');
      }
    } catch (error) {
      await transactionQueryRunner.rollbackTransaction();
      this.logger.error(`Error computing missing inmutable hashes: ${error}`);
      throw error;
    } finally {
      await transactionQueryRunner.release();
      unlock();
    }
  }

  private sha256Hash(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  private async getPreviousSmartContractHash(): Promise<string> {
    const expirationDate = new Date().getTime() + 5 * 60 * 1000;
    const provider = new LacchainProvider(cpi.getConfig('LACCHAIN__RPC_NODE')!);
    const signer = new LacchainSigner(cpi.getConfig('LACCHAIN__PRIVATE_KEY')!, provider, cpi.getConfig('LACCHAIN__NODE_ADDRESS')!, expirationDate);
    const contract = new ethers.Contract(cpi.getConfig('LACCHAIN__CONTRACT_ADDRESS')!, JSON.parse(cpi.getConfig('LACCHAIN__CONTRACT_ABI')!), signer);
    const storedValue = await contract.retreive();
    return storedValue.toString();
  }

  private async updateSmartContract(inmutableHash: string): Promise<void> {
    const expirationDate = new Date().getTime() + 5 * 60 * 1000;
    console.log('Expiration Date:', expirationDate);
    const provider = new LacchainProvider(cpi.getConfig('LACCHAIN__RPC_NODE')!);
    const signer = new LacchainSigner(cpi.getConfig('LACCHAIN__PRIVATE_KEY')!, provider, cpi.getConfig('LACCHAIN__NODE_ADDRESS')!, expirationDate);

    // Replace with the deployed contract address
    const contractAddress = cpi.getConfig('LACCHAIN__CONTRACT_ADDRESS')!;

    // Connect to the contract
    const contract = new ethers.Contract(contractAddress, JSON.parse(cpi.getConfig('LACCHAIN__CONTRACT_ABI')!), signer);
    console.log('Contract Address: ', contractAddress);

    // Write: Set a value in the contract
    const tx = await contract.store(inmutableHash);
    console.log('Transaction sent with inmutable hash: ', tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();
    console.log('Transaction confirmed');

    // Read: Get the stored value
    const storedValue = await contract.retreive();
    console.log('Stored Value: ', storedValue.toString());
    if (storedValue.toString() !== inmutableHash) {
      throw new Error(`Stored value does not match inmutable hash ${storedValue.toString()} !== ${inmutableHash}`);
    }
  }
}
