import { Injectable } from '@nestjs/common';
import * as ethers from 'ethers';
import MINTER from '../abi/Minter.json';

@Injectable()
export class ContractService {

  private provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  private signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
  private contractAddress =process.env.MINTER_CONTRACT;
  private contractABI = MINTER;

  private contract = new ethers.Contract(
    this.contractAddress,
    this.contractABI,
    this.signer,
  );

  async updateContractPeriod(): Promise<void> {
    const tx = await this.contract.updatePeriod();
    await tx.wait();
    console.log(`Transaction successful: ${tx.hash}`);
  }
}
