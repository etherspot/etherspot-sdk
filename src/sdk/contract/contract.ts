import { utils } from 'ethers';
import { Service } from '../common';
import { prepareInputArg } from './utils';

export abstract class Contract extends Service {
  protected readonly interface: utils.Interface;

  protected constructor(abi: any) {
    super();

    this.interface = new utils.Interface(abi);

    const { fragments } = this.interface;

    for (const fragment of fragments) {
      const { type, name } = fragment;

      if (name) {
        switch (type) {
          case 'event': {
            const { anonymous } = fragment as utils.EventFragment;

            if (!anonymous) {
              //
            }
            break;
          }

          case 'function': {
            this.defineFunction(fragment as utils.FunctionFragment);
            break;
          }
        }
      }
    }
  }

  abstract get address(): string;

  private defineFunction(fragment: utils.FunctionFragment): void {
    const { name, constant, inputs, outputs } = fragment;

    const postfix = `${name[0].toUpperCase()}${name.slice(1)}`;
    const method = `${constant ? 'call' : 'encode'}${postfix}`;

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
