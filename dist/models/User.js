"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fatYoshiWeightContributed: {
        type: Number,
        required: true,
        default: 0
    },
    strings: [
        {
            id: Number,
            text: String
        }
    ],
    access: {
        type: String,
        required: true,
        default: 'user'
    },
    roles: [String]
});
const User = mongoose_1.default.model('User', user);
exports.default = User;
//# sourceMappingURL=User.js.map