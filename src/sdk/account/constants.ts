export enum AccountTypes {
  Contract = 'Contract',
  Key = 'Key',
}

export enum AccountStates {
  UnDeployed = 'UnDeployed',
  Deployed = 'Deployed',
}

export enum AccountStores {
  PersonalAccountRegistry = 'PersonalAccountRegistry',
}

export enum AccountMemberTypes {
  Owner = 'Owner',
}

export enum AccountMemberStates {
  Added = 'Added',
  Removed = 'Removed',
}

export enum AccountMemberStores {
  AccountOwnerRegistry = 'AccountOwnerRegistry',
  PersonalAccountRegistry = 'PersonalAccountRegistry',
}

export enum AccountProofStates {
  Added = 'Added',
  Removed = 'Removed',
}

export enum Currencies {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}
