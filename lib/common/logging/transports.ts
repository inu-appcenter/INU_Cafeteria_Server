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

import winston from 'winston';
import config from '../../../config';
import AWS from 'aws-sdk';
import WinstonCloudwatch from 'winston-cloudwatch';
import {getConsoleFormat, getFileFormat} from './formats';
import _ from 'winston-daily-rotate-file';
_;

export function getConsoleTransport() {
  return new winston.transports.Console({
    format: getConsoleFormat(),
  });
}

export function getFileTransport(prefix: string) {
  return new winston.transports.DailyRotateFile({
    format: getFileFormat(),
    filename: config.log.filepath(prefix),
    datePattern: 'YYYY-MM-DD',
  });
}

export function getCloudwatchTransport(prefix: string) {
  AWS.config.update({
    region: config.aws.region,
    credentials: new AWS.Credentials(config.aws.accessKeyId, config.aws.secretAccessKey),
  });

  return new WinstonCloudwatch({
    logGroupName: config.aws.cloudwatch.logGroupName,
    logStreamName: prefix,
    messageFormatter: (log) =>
      `[${config.server.instanceName}] ${log.level}: ${log.message.trim()}`,
  });
}
