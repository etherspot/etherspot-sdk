import { RootReducerState } from 'reducers/rootReducer';

// user, ensName,
export const purgeSensitiveDataFromState = (initialState: RootReducerState): Partial<RootReducerState> => {
  let state = { ...initialState };

  // user
  if (state.user) delete state.user;

  // smartWallet
  if (state.smartWallet?.accounts) delete state.smartWallet.accounts;
  if (state.smartWallet?.connectedAccount?.ensName) delete state.smartWallet.connectedAccount.ensName;

  // appSettings
  if (state.appSettings?.data?.deviceUniqueId) delete state.appSettings.data.deviceUniqueId;

  return state;
};

export const validateStateToSync = (state: Partial<RootReducerState>): boolean => {
  // user
  if (state.user) return false;

  // smartWallet
  if (state.smartWallet?.accounts) return false;
  if (state.smartWallet?.connectedAccount?.ensName) return false;

  // appSettings
  if (state.appSettings?.data?.deviceUniqueId) return false;

  return true;
};
