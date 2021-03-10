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

    const methodsMap: { [key: string]: utils.FunctionFragment[] } = fragments.reduce((result, fragment) => {
      const { name, type } = fragment;

      if (type === 'function') {
        if (!result[name]) {
          result[name] = [fragment];
        } else {
          result[name].push(fragment);
        }
      }

      return result;
    }, {});

    const methods = Object.values(methodsMap);

    for (const fragments of methods) {
      this.defineFunctions(fragments);
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

  private defineFunctions(fragments: utils.FunctionFragment[]): void {
    const { name, constant } = fragments[0];
    const methodPrefix = constant ? 'call' : 'encode';
    const methodPostfix = `${name[0].toUpperCase()}${name.slice(1)}`;

    for (const fragment of fragments) {
      const { inputs, outputs } = fragment;
      let method = `${methodPrefix}${methodPostfix}`;

      if (fragments.length !== 1) {
        method = `${method}(${inputs.map(({ type }) => type).join(',')})`;
      }

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
}
