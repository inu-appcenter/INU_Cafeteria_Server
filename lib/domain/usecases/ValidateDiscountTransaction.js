/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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

/**
 * Do check if this user is able to get a discount.
 * It checks these conditions:
 * - In a proper meal time?
 * - Barcode recently activated?
 * - Has already received a discount on that day?
 * - Isn't it too frequent? (15 sec interval)
 *
 * Possible failure cases:
 * - Not a meal type -> 200, { "message": "SUCCESS", "activated": "0" }
 * - Error in DB while finding a barcode -> 500, { "message": "DB_QUERY_ERROR" }
 * - No barcode found -> 400, { "message": "BARCODE_ERROR" }
 * - Barcode not activated -> 200, { "message : "SUCCESS", "activated": "0" }
 * - DB error while looking for discount history -> 200, { "message" : "DB_ERROR" }
 * - Discount already applied -> 200, { "message": "SUCCESS", "activated": "0" }
 * - Too frequent attempt -> 200, { "message": "SUCCESS", "activated": "0" }
 *
 * On success case:
 * -> 200, { "message": "SUCCESS", "activated": "1" }
 */

import UseCase from './UseCase';
import ValidationResults from 'domain/entities/DiscountValidationResults';

/**
 * Check if this discount is valid so can be allowed.
 */
class ValidateDiscountTransaction extends UseCase {
  constructor({transactionValidator}) {
    super();
    this.transactionValidator = transactionValidator;
  }

  async onExecute({transaction, token}) {
    // Extract params.
    const {userId, cafeteriaId, mealType} = transaction;

    const isInMealTime = await this.transactionValidator
        .isInMealTime(cafeteriaId, mealType);
    if (!isInMealTime) {
      return ValidationResults.USUAL_FAIL;
    }

    const userExists = await this.transactionValidator
        .userExists(userId);
    if (!userExists) {
      return ValidationResults.UNUSUAL_NO_BARCODE; /* no barcode = no user */
    }

    const barcodeIsActive = await this.transactionValidator
        .isBarcodeActive(userId, 10/* available for 10 mins */);
    if (!barcodeIsActive) {
      return ValidationResults.USUAL_FAIL;
    }

    const isFirstToday = await this.transactionValidator
        .isFirstToday(userId);
    if (!isFirstToday) {
      return ValidationResults.USUAL_FAIL;
    }

    const isNotFrequent = await this.transactionValidator
        .barcodeNotUsedRecently(userId, 15/* interval 15 secs */);
    if (!isNotFrequent) {
      return ValidationResults.USUAL_FAIL;
    }

    const tokenIsValid = await this.transactionValidator
        .isTokenValid(cafeteriaId, token);
    if (!tokenIsValid) {
      return ValidationResults.UNUSUAL_WRONG_PARAM;
    }

    return ValidationResults.USUAL_SUCCESS;
  }
}

export default ValidateDiscountTransaction;