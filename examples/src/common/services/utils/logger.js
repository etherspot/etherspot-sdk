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
import { logger } from 'react-native-logs';
import { colorConsoleAfterInteractions } from 'react-native-logs/dist/transports/colorConsoleAfterInteractions';

/**
 * Define the configuration for the logger.
 * @url https://github.com/onubo/react-native-logs
 *
 * Note: colorConsoleAfterInteractions ensures that the UI
 * is not frozen.
 */
const config = {
  transport: (msg, level, options) => {
    // Write to non-blocking transport.
    colorConsoleAfterInteractions(msg, level, options);

    // TODO: Write to non-blocking fs - we will read / ship
    // these logs from the upcoming developer screen if needed.
    // rnFsFileAsync(msg, level, options);
  },
};

// Build out our logger instance...
const log = logger.createLogger(config);

// Export.
export { log };
