/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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

import logger from './lib/common/logging/logger';
import {startTypeORM} from '@inu-cafeteria/backend-core';
import startServer from './lib/infrastructure/webserver/server';
import {printInBox} from './lib/infrastructure/webserver/utils/printer';
import config from './config';

async function start() {
  logger.info('TypeORM과 데이터베이스 연결을 시작합니다.');
  await startTypeORM(true);

  logger.info('서버를 시작합니다.');
  await startServer();
}

start()
  .then(() => printInBox('SERVER STARTED', `Listening on ${config.server.port}`, '#'))
  .catch((e) => console.log(e));
