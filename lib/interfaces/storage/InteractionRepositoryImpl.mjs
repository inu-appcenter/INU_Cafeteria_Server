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

import InteractionRepository from '../../domain/repositories/InteractionRepository';
import logger from '../../common/utils/logger';

import Question from '../../domain/entities/Question';
import Answer from '../../domain/entities/Answer';

class InteractionRepositoryImpl extends InteractionRepository {
  constructor({db}) {
    super();

    this.db = db;
    this.questionModel = this.db.model('question');
    this.answerModel = this.db.model('answer');
  }

  async ask(question) {
    if (!question) {
      return false;
    }

    try {
      await this.questionModel.create({
        /* id auto increased */

        device_info: question.deviceInfo,
        version: question.version,

        content: question.content,
        user_id: question.userId,
      });

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }

  async getQuestions(userId) {
    const seqQuestions = await this.questionModel.findAll({
      where: {user_id: userId},
    });

    return seqQuestions.map((seqQuestion) => this._seqQuestionToQuestion(seqQuestion));
  }

  _seqQuestionToQuestion(seqQuestion) {
    return new Question({
      id: seqQuestion.id,
      deviceInfo: seqQuestion.device_info,
      version: seqQuestion.version,
      content: seqQuestion.content,
      userId: seqQuestion.user_id,
    });
  }

  async getAnswers(userId) {
    const seqAnswers = await this.answerModel.findAll({
      where: {
        user_id: userId,
      },
    });

    return seqAnswers.map((seqAnswer) => this._seqAnswerToAnswer(seqAnswer));
  }

  _seqAnswerToAnswer(seqAnswer) {
    return new Answer({
      id: seqAnswer.id,
      title: seqAnswer.title,
      body: seqAnswer.body,
      read: seqAnswer.read,
      questionId: seqAnswer.question_id,
    });
  }

  async markAnswerRead(answerId) {
    try {
      this.answerModel.update({
        read: true,
      }, {where: {id: answerId}});

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }
}

export default InteractionRepositoryImpl;
