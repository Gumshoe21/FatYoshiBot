"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cooldown = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        sparse: false
    },
    command: {
        type: String,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    }
});
const Cooldown = mongoose_1.default.model('Cooldown', cooldown);
module.exports = Cooldown;
//# sourceMappingURL=Cooldown.js.map