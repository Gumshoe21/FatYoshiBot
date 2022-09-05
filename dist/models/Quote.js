"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quote = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true,
        unique: true
    }
});
const Quote = mongoose_1.default.model('Quote', quote);
module.exports = Quote;
//# sourceMappingURL=Quote.js.map