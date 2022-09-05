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
exports.commands = void 0;
const Command = require('./../models/Command');
const Quotes = require('../models/Quote');
const { incrementUserValue } = require('./actions');
const { STREAMER_NICKNAME } = require('./../constants');
const { generatePeterSentence } = require('./utils/generatePeterSentence');
const { generateGaslightSentence } = require('./utils/generateGaslightSentence');
// const { generatePublicCommandsList } = require('./utils/generatePublicCommandsList');
exports.commands = {
    r: {
        access: ['user'],
        onCommand: () => __awaiter(void 0, void 0, void 0, function* () {
            return `Please reset, ${STREAMER_NICKNAME}.`;
        })
    },
    c: {
        access: ['user'],
        onCommand: () => __awaiter(void 0, void 0, void 0, function* () {
            return `Please continue, ${STREAMER_NICKNAME}.`;
        })
    },
    bot: {
        access: ['admin'],
        onCommand: () => __awaiter(void 0, void 0, void 0, function* () { })
    },
    commands: {
        access: ['user'],
        onCommand: () => __awaiter(void 0, void 0, void 0, function* () {
            return commandsList;
        })
    },
    peter: {
        access: ['user'],
        onCommand: () => __awaiter(void 0, void 0, void 0, function* () {
            return generatePeterSentence();
        })
    },
    gaslight: {
        access: ['user'],
        onCommand: () => __awaiter(void 0, void 0, void 0, function* () {
            return generateGaslightSentence();
        })
    }
};
exports.commands = exports.commands;
const generatePublicCommandsList = ({ commands }) => {
    let publicCommandsList = [];
    for (const command in commands) {
        if (!commands[command].access.includes('admin'))
            publicCommandsList.push(`!${command}`);
    }
    return publicCommandsList.join(' ');
};
const commandsList = generatePublicCommandsList({ commands: exports.commands });
//# sourceMappingURL=commands.js.map