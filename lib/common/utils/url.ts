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

export function appendQueryStringParameters(url: string, parameters: Record<string, any>) {
  return isEmpty(parameters) ? url : url + (url.includes('?') ? '&' : '?') + serialize(parameters);
}

function isEmpty(record: Record<string, any>) {
  return Object.keys(record).length === 0;
}

function serialize(record: Record<string, any>) {
  const str = [];
  for (const p in record) {
    if (record.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(record[p]));
    }
  }

  return str.join('&');
}
