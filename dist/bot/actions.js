"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
exports.incrementUserValue = (username, value, amount) => {
    const user = User_1.default.findOneAndUpdate({ username }, {
        $inc: { [`values.${value}`]: amount }
    }, {
        upsert: true,
        new: true
    });
    return user;
};
//# sourceMappingURL=actions.js.map