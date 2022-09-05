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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Value_1 = __importDefault(require("./../models/Value"));
const User_1 = __importDefault(require("./../models/User"));
// const { incrementUserValue } = require('./actions');
const { REWARD_FEED_FAT_YOSHI, EMOTE_FAT_YOSHI } = require('./../constants');
exports.rewards = {
    [`${REWARD_FEED_FAT_YOSHI}`]: {
        onReward: ({ username }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield User_1.default.findOneAndUpdate({ username }, {
                $inc: { [`fatYoshiWeightContributed`]: Math.floor(1) }
            }, {
                upsert: true,
                new: true
            });
            const fatYoshiWeight = yield Value_1.default.findOneAndUpdate({ name: 'fatYoshiWeight' }, {
                $inc: { [`num`]: Math.floor(1) }
            }, {
                upsert: true,
                new: true
            });
            const { num: weight } = fatYoshiWeight;
            const { fatYoshiWeightContributed: contributed } = user;
            return `${EMOTE_FAT_YOSHI} Thanks for feeding me, ${username}! I now weigh ${weight} lbs./${(weight / 2.2).toFixed(2)} kgs)! You've contributed ${contributed} lbs./${(contributed / 2.2).toFixed(2)} kgs! Thanks for keeping me fat! ${EMOTE_FAT_YOSHI}`;
        })
    }
};
//# sourceMappingURL=rewards.js.map