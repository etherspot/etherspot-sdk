import { utils } from 'ethers';
import { Service } from '../common';
import { ContractEvent, ContractLog } from './interfaces';
import { prepareInputArg } from './utils';

export abstract class Contract<N extends string = string> extends Service {
  protected readonly interface: utils.Interface;

  constructor(readonly name: N, abi: any) {
    super();

    this.interface = new utils.Interface(abi);

    const { fragments } = this.interface;

    for (const fragment of fragments) {
      const { type, name } = fragment;

      if (name) {
        switch (type) {
          case 'function': {
            this.defineFunction(fragment as utils.FunctionFragment);
            break;
          }
        }
      }
    }
  }

  abstract get address(): string;

  parseLog(log: ContractLog): ContractEvent {
    let result: ContractEvent;

    try {
      const { name: event, args } = this.interface.parseLog(log);

      result = {
        contract: this.name,
        event,
        args,
      };
    } catch (err) {
      result = null;
    }

    return result;
  }

  private defineFunction(fragment: utils.FunctionFragment): void {
    const { name, constant, inputs, outputs } = fragment;

    const postfix = `${name[0].toUpperCase()}${name.slice(1)}`;
    const method = `${constant ? 'call' : 'encode'}${postfix}`;

    if (!this[method]) {
      Object.defineProperty(this, method, {
        value: (...args: any[]) => {
          const to = this.address;
          const data = this.interface.encodeFunctionData(
            name,
            args.map((arg, index) => prepareInputArg(inputs[index].type, arg)),
          );

          let result: any;

          if (constant) {
            const { contractService } = this.services;

            result = contractService.callContract(to, data).then((data) => {
              const decoded = this.interface.decodeFunctionResult(fragment, data);
              return outputs.length === 1 ? decoded[0] : decoded;
            });
          } else {
            result = {
              to,
              data,
            };
          }

          return result;
        },
        writable: false,
      });
    }
  }
}
