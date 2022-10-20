import { BigNumberish, ethers } from 'ethers';
import { ContractNames, getContractAbi } from '@etherspot/contracts';
import { Account, EnvNames, NetworkNames, Sdk } from '../../src';
import * as dotenv from 'dotenv';
import { TransactionRequest } from '@ethersproject/abstract-provider';
dotenv.config();

const VAULT_ABI = [
  {
    inputs: [
      { internalType: 'contract IStrategy', name: '_strategy', type: 'address' },
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_symbol', type: 'string' },
      { internalType: 'uint256', name: '_approvalDelay', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'implementation', type: 'address' }],
    name: 'NewStratCandidate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'implementation', type: 'address' }],
    name: 'UpgradeStrat',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'approvalDelay',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'available',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'balance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'depositAll', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'earn', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'getPricePerFullShare',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
    name: 'inCaseTokensGetStuck',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_implementation', type: 'address' }],
    name: 'proposeStrat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'stratCandidate',
    outputs: [
      { internalType: 'address', name: 'implementation', type: 'address' },
      { internalType: 'uint256', name: 'proposedTime', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'strategy',
    outputs: [{ internalType: 'contract IStrategy', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'upgradeStrat', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'want',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_shares', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'withdrawAll', outputs: [], stateMutability: 'nonpayable', type: 'function' },
];
const beefyUniV2ZapABI = [
  {
    inputs: [
      { internalType: 'address', name: '_router', type: 'address' },
      { internalType: 'address', name: '_WETH', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'WETH',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'beefyVault', type: 'address' },
      { internalType: 'uint256', name: 'tokenAmountOutMin', type: 'uint256' },
      { internalType: 'address', name: 'tokenIn', type: 'address' },
      { internalType: 'uint256', name: 'tokenInAmount', type: 'uint256' },
    ],
    name: 'beefIn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'beefyVault', type: 'address' },
      { internalType: 'uint256', name: 'tokenAmountOutMin', type: 'uint256' },
    ],
    name: 'beefInETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'beefyVault', type: 'address' },
      { internalType: 'uint256', name: 'withdrawAmount', type: 'uint256' },
    ],
    name: 'beefOut',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'beefyVault', type: 'address' },
      { internalType: 'uint256', name: 'withdrawAmount', type: 'uint256' },
      { internalType: 'address', name: 'desiredToken', type: 'address' },
      { internalType: 'uint256', name: 'desiredTokenOutMin', type: 'uint256' },
    ],
    name: 'beefOutAndSwap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'checkWETH',
    outputs: [{ internalType: 'bool', name: 'isValid', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'beefyVault', type: 'address' },
      { internalType: 'address', name: 'tokenIn', type: 'address' },
      { internalType: 'uint256', name: 'fullInvestmentIn', type: 'uint256' },
    ],
    name: 'estimateSwap',
    outputs: [
      { internalType: 'uint256', name: 'swapAmountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'swapAmountOut', type: 'uint256' },
      { internalType: 'address', name: 'swapTokenOut', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minimumAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'router',
    outputs: [{ internalType: 'contract IUniswapV2Router02', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];

const TOKEN_ADDRESS = ethers.constants.AddressZero;
const VAULT_ADDRESS = '0xcb979E17c039001DAd363093CeFca7170f144816'; // https://app.beefy.com/vault/biswap-wbnb-bifi
const ZAP_ADDRESS = '0x9A76a315109663d9f2e105Be7A6df18b4F7B16F0'; // https://bscscan.com/address/0x9A76a315109663d9f2e105Be7A6df18b4F7B16F0#code
const IS_NATIVE = true; // we are staking the native token 
const COEFF = 2.35; // coff for BeefyUniV2Zap AMM
const AMOUNT = ethers.utils.parseEther('0.001'); // amount to stake

export interface ERC20Contract {
  encodeApprove?(spender: string, value: BigNumberish): TransactionRequest;
  callAllowance?(owner: string, spender: string): Promise<string>;
}

export interface VaultContract {
  encodeDeposit?(amount: BigNumberish): TransactionRequest;
  callName?(): Promise<string>;
}

export interface ZapContract {
  encodeBeefInETH?(vault: string, amountMin: BigNumberish): TransactionRequest;
}

const handleDeposit = async () => {
  const privateKey = process.env.SENDER_PRIVATE_KEY;
  const sdk = new Sdk(
    { privateKey: privateKey },
    {
      env: EnvNames.MainNets,
      networkName: NetworkNames.Bsc,
    },
  );

  const { state } = sdk;

  console.log('key account', state.account);

  let contractAccount: Account;
  try {
    contractAccount = await sdk.computeContractAccount({
      sync: false,
    });
  } catch (error) {
    console.log('Error', error);
  }
  console.log('contract account', contractAccount.address);

  await sdk.syncAccount();

  const erc20Contract = sdk.registerContract<ERC20Contract>(
    'erc20Contract',
    getContractAbi(ContractNames.ERC20Token),
    TOKEN_ADDRESS,
  );
  const vaultContract = sdk.registerContract<VaultContract>('vault', VAULT_ABI, VAULT_ADDRESS);
  const zapContract = sdk.registerContract<ZapContract>('zap', beefyUniV2ZapABI, ZAP_ADDRESS);
  await sdk.clearGatewayBatch();

  if (!IS_NATIVE) {
    const approveTx = erc20Contract.encodeApprove(VAULT_ADDRESS, AMOUNT);
    await sdk.batchExecuteAccountTransaction({
      to: approveTx.to,
      data: approveTx.data,
    });
  }

  console.log('Vault address', VAULT_ADDRESS);
  let tx: TransactionRequest;

  const swapAmountOut = AMOUNT.mul(1000).div(COEFF * 1000);
  const swapAmountOutMin = swapAmountOut.sub(swapAmountOut.div(100));
  tx = {
    ...zapContract.encodeBeefInETH(VAULT_ADDRESS, swapAmountOutMin),
    value: AMOUNT,
  };

  await sdk.batchExecuteAccountTransaction({
    to: tx.to,
    data: tx.data,
    value: tx.value,
  });
  // console.log(
  //   'gateway address',
  //   sdk.internalContracts.gatewayContract.address
  // )
  // console.log(
  //   'batch',
  //   await sdk.encodeGatewayBatch()
  // );

  let estimatedGas;
  try {
    estimatedGas = await sdk.estimateGatewayBatch();
    console.log('estimated batch', ethers.utils.formatEther(estimatedGas.estimation.feeAmount));
  } catch (error) {
    console.log('estimation error', error);
  }
  // Estimate and submit the transactions to the Gateway
  // console.log('submitted batch', await sdk.submitGatewayBatch());
};

handleDeposit().then().catch();
