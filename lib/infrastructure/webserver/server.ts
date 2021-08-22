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

import config from '../../../config';
import express from 'express';
import cookieParser from 'cookie-parser';
import {errorHandler} from './libs/middleware/errorHandler';
import {registerRoutes} from './utils/register';
import {authorizer} from './libs/middleware/authorizer';
import recorder from './libs/middleware/recorder';

const excludeList = [
  '/',

  '/student/login',
  '/guest/challenge',
  '/guest/login',

  '/cafeteria',
  '/corners',
  '/menus',
  '/notices',
  '/notices/latest',

  '/kiosk/discount/verify',
  '/kiosk/discount/commit',

  '/isBarcode',
  '/paymentSend',
];

export default async function startServer() {
  const app = express();

  app.use(cookieParser());
  app.use(authorizer({exclude: excludeList}));

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.use(recorder());

  await registerRoutes(app, __dirname + '/routes');

  app.use(errorHandler());

  app.listen(config.server.port, config.server.host);
}
