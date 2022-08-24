"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const value = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    num: {
        type: Number,
        required: true,
        default: 0
    }
});
const Value = mongoose_1.default.model('Value', value);
module.exports = Value;
