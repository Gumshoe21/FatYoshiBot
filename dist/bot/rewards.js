"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Value } = require('./../models/Value');
const { incrementUserValue } = require('./actions');
const { REWARD_FEED_FAT_YOSHI, EMOTE_FAT_YOSHI } = require('./../constants');
exports.rewards = {
    [`${REWARD_FEED_FAT_YOSHI}`]: {
        onReward: ({ username }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield incrementUserValue(username, 'fatYoshiWeightContributed', 1);
            const fatYoshiWeight = yield Value.find({
                name: 'fatYoshiWeight'
            });
            const { num: weight } = fatYoshiWeight;
            const { fatYoshiWeightContributed: contributed } = user.values;
            return `${EMOTE_FAT_YOSHI} Thanks for feeding me, ${username}! I now weigh ${weight} lbs./${weight / 2.2} kgs)! You've contributed ${contributed} lbs./${contributed / 2.2} kgs! Thanks for keeping me fat! ${EMOTE_FAT_YOSHI}`;
        })
    }
};
//# sourceMappingURL=rewards.js.map