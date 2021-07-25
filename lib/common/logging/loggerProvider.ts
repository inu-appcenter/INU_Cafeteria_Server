/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global App Center <potados99@gmail.com>
 *
 * INU Cafeteria is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * INU Cafeteria is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import TransportStream from 'winston-transport';
import winston from 'winston';
import {getCloudwatchTransport, getConsoleTransport, getFileTransport} from './transports';
import config from '../../../config';

export function getLogger(prefix: string) {
  const transports: TransportStream[] = [
    getConsoleTransport(),
    getFileTransport(prefix),
    getFileTransport('combined'),
  ];

  const productionTransports: TransportStream[] = [
    getCloudwatchTransport(prefix),
    getCloudwatchTransport('combined'),
  ];

  if (config.isProduction) {
    transports.concat(productionTransports);
  }

  const logger = createLogger(transports);

  logger.transports.forEach((transport) => {
    transport.silent = config.isTest;
  });

  return logger;
}

function createLogger(transports: TransportStream[]) {
  return winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json()
    ),
    transports,
  });
}