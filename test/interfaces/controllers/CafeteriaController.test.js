/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020  INU Appcenter <potados99@gmail.com>
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
'use strict';

jest.unmock('@config/config');

jest.mock('@config/config', () => {
	return {
		sequelize: {
			database: 'cafeteria', /* cafeteria */
			username: 'hah',
			password: 'duh',
			host: 'host', /* localhost */
			dialect: 'mysql', /* mysql */
			logging: false
		},

		log: {
			timestamp: 0,
			file: {
				name: (name) => 'logs/' + name + '/' + name + '-test-%DATE%.log',
				datePattern: ''
			}
		}
	};
});

const GetCafeteria = require('@domain/usecases/GetCafeteria');
const GetCorners = require('@domain/usecases/GetCorners');
const GetMenus = require('@domain/usecases/GetMenus');

const CafeteriaController = require('@interfaces/controllers/CafeteriaController');



jest.mock('@domain/usecases/GetCafeteria');
jest.mock('@domain/usecases/GetCorners');
jest.mock('@domain/usecases/GetMenus');

describe('# Cafeteria controller', () => {

	it('should get cafeteria with id 2.', async () => {

		const cafeteriaEntity = {
			'id': '2' ,
			'name': 'theName',
			'imagePath': 'thePath'
		};

		const cafeteriaResponse = {
			'id': '2' ,
			'name': 'theName',
			'image-path': 'thePath'
		};

		GetCafeteria.mockImplementationOnce(() => cafeteriaEntity);

		const request = { params: { id: 2} };

		const response = await CafeteriaController.getCafeteria(request);

		expect(response).toEqual(cafeteriaResponse);
	});

	it('should get corner with id 3.', async () => {

		const cornerEntity = {
			'id': '3' ,
			'name': 'theName',
			'cafeteriaId': '1'
		};

		const cornerResponse = {
			'cafeteria-id': '1',
			'id': '3' ,
			'name': 'theName',
		};

		GetCorners.mockImplementationOnce(() => cornerEntity);

		const request = { params: { id: 3 }, query: {} };
		const response = await CafeteriaController.getCorners(request);

		expect(response).toEqual(cornerResponse);
	});

	it('should get menus at 20200219 of corner with id 18.', async () => {

		const menuEntities = [
			{
				'foods': 'yeah foods',
				'price': '1000',
				'calorie': '100',
				'cornerId': '18'
			}
		];

		const menuResponse = [
			{
				'corner-id': '18',
				'foods': 'yeah foods',
				'price': '1000',
				'calorie': '100'
			}
		];

		GetMenus.mockImplementationOnce(() => menuEntities);

		const request = { params: {}, query: { date: '20200219', cornerId: 18 } };
		const response = await CafeteriaController.getMenus(request);

		expect(response).toEqual(menuResponse);
	});

});
