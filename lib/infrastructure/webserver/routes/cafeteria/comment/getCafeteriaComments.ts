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

import {defineSchema} from '../../../libs/schema';
import {defineRoute} from '../../../libs/route';
import GetCafeteriaComments from '../../../../../application/cafeteria/GetCafeteriaComments';
import {stringAsInt} from '../../../utils/zodTypes';

const schema = defineSchema({
  params: {
    id: stringAsInt.optional(),
  },
});

export default defineRoute('get', '/cafeteria/comments/:id?', schema, async (req, res) => {
  const {id} = req.params;

  const comments = await GetCafeteriaComments.run({id});

  return res.json(comments);
});
