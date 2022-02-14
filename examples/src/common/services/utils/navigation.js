// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
import { getNavigationPathAndParamsState } from 'services/navigation';
import { AUTH_FLOW } from 'constants/navigationConstants';

export const isNavigationAllowed = (): boolean => {
  const pathAndParams = getNavigationPathAndParamsState();

  if (!pathAndParams) {
    return false;
  }

  const pathParts = pathAndParams.path.split('/');
  const currentFlow = pathParts[0];

  return currentFlow !== AUTH_FLOW;
};

// Source: https://reactnavigation.org/docs/4.x/screen-tracking
export const getActiveRouteName = (navigationState: any): string | null => {
  if (!navigationState) return null;

  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }

  return route.routeName;
};
