/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ (function(module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express = __webpack_require__(/*! express */ "express");
const path = __webpack_require__(/*! path */ "path");
const morgan = __webpack_require__(/*! morgan */ "morgan");
const rateLimit = __webpack_require__(/*! express-rate-limit */ "express-rate-limit");
const helmet = __webpack_require__(/*! helmet */ "helmet");
const mongoSanitize = __webpack_require__(/*! express-mongo-sanitize */ "express-mongo-sanitize");
const xss = __webpack_require__(/*! xss-clean */ "xss-clean");
const cookieParser = __webpack_require__(/*! cookie-parser */ "cookie-parser");
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const hpp = __webpack_require__(/*! hpp */ "hpp");
const cors = __webpack_require__(/*! cors */ "cors");
const appError_1 = __importDefault(__webpack_require__(/*! ./utils/appError */ "./src/utils/appError.ts"));
const userRouter = __webpack_require__(/*! ./routes/userRoutes */ "./src/routes/userRoutes.ts");
const commandRouter = __webpack_require__(/*! ./routes/userRoutes */ "./src/routes/userRoutes.ts");
const app = express();
// By enabling the "trust proxy" setting via app.enable('trust proxy'), Express will have knowledge that it's sitting behind a proxy and that the X-Forwarded-* header fields may be trusted, which otherwise may be easily spoofed.
app.enable('trust proxy');
/*
app.use(
  cors({
    origin: ['https://12hourstudy.netlify.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
);
*/
app.options('*', cors());
// Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());
// HTTP request logger middleware
if (true) {
    app.use(morgan('dev'));
}
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(hpp());
// rate limiting
const limiter = rateLimit({
    max: 5000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP; please try again in an hour.'
});
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use((req, _res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
app.use(`/api/${process.env.API_VERSION}/users`, userRouter);
app.get('/', (_req, res) => {
    res.send('Hello from Express!');
});
app.all('*', (req, _res, next) => {
    next(new appError_1.default(`Can't find URL ${req.originalUrl} on this server`, 404));
});
module.exports = app;


/***/ }),

/***/ "./src/bot/actions.ts":
/*!****************************!*\
  !*** ./src/bot/actions.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const User_1 = __importDefault(__webpack_require__(/*! ../models/User */ "./src/models/User.ts"));
exports.incrementUserValue = (username, value, amount) => {
    const user = User_1.default.findOneAndUpdate({ username }, {
        $inc: { [`values.${value}`]: amount }
    }, {
        upsert: true,
        new: true
    });
    return user;
};


/***/ }),

/***/ "./src/bot/commands.ts":
/*!*****************************!*\
  !*** ./src/bot/commands.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.commands = void 0;
const Command = __webpack_require__(/*! ./../models/Command */ "./src/models/Command.ts");
const Quotes = __webpack_require__(/*! ../models/Quote */ "./src/models/Quote.ts");
const { incrementUserValue } = __webpack_require__(/*! ./actions */ "./src/bot/actions.ts");
const { STREAMER_NICKNAME } = __webpack_require__(/*! ./../constants */ "./src/constants.ts");
const { generatePeterSentence } = __webpack_require__(/*! ./utils/generatePeterSentence */ "./src/bot/utils/generatePeterSentence.ts");
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


/***/ }),

/***/ "./src/bot/handlers.ts":
/*!*****************************!*\
  !*** ./src/bot/handlers.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tmiClient_1 = __importDefault(__webpack_require__(/*! ./tmiClient */ "./src/bot/tmiClient.ts"));
const { commands } = __webpack_require__(/*! ./commands */ "./src/bot/commands.ts");
const { rewards } = __webpack_require__(/*! ./rewards */ "./src/bot/rewards.ts");
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const { isOnCooldown } = __webpack_require__(/*! ./utils/isOnCooldown */ "./src/bot/utils/isOnCooldown.ts");
const { isCommand } = __webpack_require__(/*! ./../helpers/isCommand */ "./src/helpers/isCommand.ts");
exports.commandHandler = (channel, context, message, self) => __awaiter(void 0, void 0, void 0, function* () {
    // If our message isn't formatted like a command (i.e., preceded by a '!'), exit fn.
    if (!isCommand(message))
        return;
    // If the user is the bot itself, exit fn.
    if (self)
        return;
    // Separate the raw message, the command itself, and any args into variables.
    const [raw, command, argument] = message.match(regexpCommand);
    // Obtain the onCommand fn from the command to which it belongs.
    const { onCommand } = commands[command] || {};
    // If the command doesn't exist, exit fn.
    if (commands[command] === {})
        return;
    //  console.log(await isOnCooldown(context.username, command));
    // Execute the onCommand fn, await its response, and store it in a var.
    let response = yield onCommand({ channel, context, message, self });
    // Execute the isOnCooldown fn and await its response, which will be either true if there is an active cooldown or false if there isn't one.
    const cooldownIsActive = yield isOnCooldown(context.username, command);
    // console.log(`canSay: ${canSay}`);
    // If there isn't an active cooldown, convey the response to the channel in a message.
    if (!cooldownIsActive)
        tmiClient_1.default.say(channel, response);
});
exports.redemptionHandler = (channel, username, type, tags, message) => __awaiter(void 0, void 0, void 0, function* () {
    // If a reward with that reward id isn't present in the list of rewards, exit fn.
    if (!rewards[type])
        return;
    // If the redeemer is the bot itself, exit fn.
    if (self)
        return;
    // Obtain the onRedemption fn from the reward to which it belongs.
    const { onRedemption } = rewards[type];
    // Execute the onRedemption fn, await its response, and store it in a var.
    let response = yield onRedemption({ channel, username, type, tags, message });
    // Convey the response to the channel in a message.
    tmiClient_1.default.say(channel, response);
});


/***/ }),

/***/ "./src/bot/rewards.ts":
/*!****************************!*\
  !*** ./src/bot/rewards.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const { Value } = __webpack_require__(/*! ./../models/Value */ "./src/models/Value.ts");
const { incrementUserValue } = __webpack_require__(/*! ./actions */ "./src/bot/actions.ts");
const { REWARD_FEED_FAT_YOSHI, EMOTE_FAT_YOSHI } = __webpack_require__(/*! ./../constants */ "./src/constants.ts");
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


/***/ }),

/***/ "./src/bot/tmiClient.ts":
/*!******************************!*\
  !*** ./src/bot/tmiClient.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tmi_js_1 = __importDefault(__webpack_require__(/*! tmi.js */ "tmi.js"));
const options = {
    connection: {
        reconnect: true
    },
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_OAUTH_TOKEN
    },
    channels: ['gumshoe21']
};
const tmiClient = new tmi_js_1.default.Client(options);
exports["default"] = tmiClient;


/***/ }),

/***/ "./src/bot/utils/generatePeterSentence.ts":
/*!************************************************!*\
  !*** ./src/bot/utils/generatePeterSentence.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


exports.generatePeterSentence = () => {
    const wordGroups = [
        [
            "Don't",
            'worry',
            'Mr.',
            'Aziz',
            'these',
            'pizzas',
            'are',
            'in',
            'good',
            'hands'
        ],
        [
            'Oh',
            'no',
            'Dr.',
            "Conners'",
            'class',
            'I',
            'got',
            'so',
            'caught',
            'up',
            'in',
            'what',
            'I',
            'was',
            'doing',
            'I',
            'forgot',
            'all',
            'about',
            'it',
            "S'gonna",
            'kill',
            'me'
        ]
    ];
    const groupCount = wordGroups.length;
    const randomGroup = wordGroups[Math.floor(Math.random() * groupCount)];
    for (let i = randomGroup.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [randomGroup[i], randomGroup[j]] = [randomGroup[j], randomGroup[i]];
    }
    return randomGroup.join(' ');
};


/***/ }),

/***/ "./src/bot/utils/isOnCooldown.ts":
/*!***************************************!*\
  !*** ./src/bot/utils/isOnCooldown.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Cooldown = __webpack_require__(/*! ../../models/Cooldown */ "./src/models/Cooldown.ts");
const { convertMsToSec } = __webpack_require__(/*! ./../../helpers/convertMsToSec */ "./src/helpers/convertMsToSec.ts");
const { getCurrentTimeInMs } = __webpack_require__(/*! ./../../helpers/getCurrentTimeInMs */ "./src/helpers/getCurrentTimeInMs.ts");
const { GLOBAL_COOLDOWN_TIME_IN_SECONDS } = __webpack_require__(/*! ./../../constants */ "./src/constants.ts");
exports.isOnCooldown = (username, command) => __awaiter(void 0, void 0, void 0, function* () {
    // Try to find a cooldown with the provided username and command name in the database. If such a cooldown isn't found, create a new cooldown with the provided username and command name and set the startTime field to the current time in milliseconds.
    try {
        let cooldown = yield Cooldown.findOne({
            username: username,
            command: command
        });
        if (!cooldown) {
            cooldown = yield Cooldown.create({
                username,
                command,
                startTime: new Date(Date.now()).getTime()
            });
        }
        //
        console.log(Math.floor(cooldown.startTime / 1000));
        // Store the current time in milliseconds in a variable.
        const now = new Date(Date.now()).getTime();
        console.log(Math.floor(new Date(Date.now()).getTime() / 1000));
        // if the current time is not equal to the cooldown's startTime, and if 30 seconds hasn't passed since the cooldown's startTime, return true, indicated that there is an active cooldown. Otherwise, delete the current cooldown, as it has expired, and return false, indicating that there is no active cooldown.
        if (convertMsToSec(getCurrentTimeInMs()) !==
            convertMsToSec(cooldown.startTime) &&
            convertMsToSec(getCurrentTimeInMs()) -
                convertMsToSec(cooldown.startTime) <
                30) {
            return true;
        }
        else {
            yield Cooldown.deleteOne({ username: username, command: command });
            cooldown = yield Cooldown.create({
                username,
                command,
                startTime: new Date(Date.now()).getTime()
            });
            return false;
        }
    }
    catch (err) {
        console.log(err);
    }
});


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


// General
exports.STREAMER_NICKNAME = 'Gumshoe';
// Emotes
exports.EMOTE_FAT_YOSHI = 'FatYoshi';
// Rewards
exports.REWARD_FEED_FAT_YOSHI = '971f8d94-6a1b-475a-ae67-52c7b30f12fc';
exports.GLOBAL_COOLDOWN_TIME_IN_SECONDS = 30;


/***/ }),

/***/ "./src/controllers/authController.ts":
/*!*******************************************!*\
  !*** ./src/controllers/authController.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const { promisify } = __webpack_require__(/*! util */ "util"); // utility for promisify method
const dotenv = __webpack_require__(/*! dotenv */ "dotenv");
const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
const User = __webpack_require__(/*! ./../models/User */ "./src/models/User.ts");
const catchAsync_1 = __importDefault(__webpack_require__(/*! ./../utils/catchAsync */ "./src/utils/catchAsync.ts"));
const AppError = __webpack_require__(/*! ../utils/appError */ "./src/utils/appError.ts");
const signToken = (id) => {
    return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
        expiresIn: '5d'
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true
    };
    res.cookie('jwt', token, cookieOptions);
    // remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
};
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    // 2) check if user exists && passowrd is correct
    const user = yield User.findOne({ email }).select('+password'); // we are selecting password here because we need it in order to check if it is correct - now it will be back in the output
    // short circuiting down here btw
    if (!user || !(yield user.correctPassword(password, user.password))) {
        // if not user or password incorrect
        return next(new AppError('Ioncrrect email or password', 401)); // 401 = unauthorized
    }
    // 3) if everything okay, send token to client
    createSendToken(user, 200, res);
}));
exports.logout = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true
    };
    res.cookie('jwt', 'loggedOut', cookieOptions);
    res.status(202).json({ status: 'success' });
}));
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1) Getting token and check if it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies['jwt']) {
        token = req.cookies['jwt'];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }
    //2) verification token - making sure the token hasn't been manipulated by malicious 3rd party
    const decoded = yield promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3) Check if user still exists
    // if no one tampered with the token...
    const currentUser = yield User.findById(decoded.id);
    if (!currentUser) {
        // if current user doesn't exist, don't give access to route, throw err
        return next(new AppError('The user belonging to this token does no longer exist', 401));
    }
    // user does exist at this point
    //4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        // iat = issued at
        return next(new AppError('User recently changed password; please log in again', 401));
        // GRANT ACCESS TO PROTECTED ROUTE
    }
    req.user = currentUser; // very important for next step to work, otherwise no access to role
    res.locals.user = currentUser;
    next();
}));
exports.restrict = () => {
    return (req, _res, next) => {
        if (!req.user.isAdmin) {
            return next(new AppError('You do not have permission to perform this action.', 403)); // 403 === forbidden
        }
        next();
    };
};
exports.updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) get user from collection
    const user = yield User.findById(req.user.id).select('+password');
    // 2) check if POSTed password is correct
    if (!(yield user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    yield user.save();
    //User.findByIdAndUpdate will NOT work as intended!
    // 4) Log user in; send JWT to user
    createSendToken(user, 200, res);
}));


/***/ }),

/***/ "./src/controllers/handlerFactory.ts":
/*!*******************************************!*\
  !*** ./src/controllers/handlerFactory.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
// LECTURE 160
const catchAsync_1 = __importDefault(__webpack_require__(/*! ./../utils/catchAsync */ "./src/utils/catchAsync.ts"));
const AppError = __webpack_require__(/*! ../utils/appError */ "./src/utils/appError.ts");
const APIFeatures = __webpack_require__(/*! ./../utils/apiFeatures */ "./src/utils/apiFeatures.ts");
exports.deleteOne = (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findByIdAndDelete(req.params.id);
    // 204 is no content - we don't send data back, we just send 'null' - to show that the resource we deleted no longer exists
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
}));
exports.updateOne = (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findByIdAndUpdate(req.params.id, req.body, {
        //  setting new to 'true' will will return the document after the update is complete
        new: true,
        runValidators: true
    });
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
}));
exports.createOne = (Model) => (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: parseInt(doc)
        }
    });
}));
exports.getOne = (Model, popOptions) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = Model.findById(req.params.id);
    if (popOptions)
        query = query.populate(popOptions);
    const doc = yield query;
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
}));
exports.getAll = (Model) => (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId)
        filter = { tour: req.params.tourId }; // if there's a tourId, then the object 'filter' will go into Review.find(filter) below (lecture 159) so only the reviews where the tour matches the id are going to be found;
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // const doc = await features.query.explain(); // generate statistics in responses
    const doc = yield features.query;
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    });
}));


/***/ }),

/***/ "./src/controllers/userController.ts":
/*!*******************************************!*\
  !*** ./src/controllers/userController.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const User = __webpack_require__(/*! ./../models/User */ "./src/models/User.ts");
const catchAsync_1 = __importDefault(__webpack_require__(/*! ./../utils/catchAsync */ "./src/utils/catchAsync.ts"));
const appError_1 = __importDefault(__webpack_require__(/*! ../utils/appError */ "./src/utils/appError.ts"));
const factory = __webpack_require__(/*! ./handlerFactory */ "./src/controllers/handlerFactory.ts");
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
/*
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
*/
exports.getMe = (req, _res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.updateMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError_1.default('This route is not for password updates; please use /updateMyPasword', 400));
    }
    // 2) update user doc if not
    /* Now why am I putting x here, and not simply request.body? Well that's because we actually do not want to update everything that's in the body, because let's say the user puts, in the body, the role for example. We could have body.role set to admin for example, and so this would then allow any user to change the role, for example, to administrator. And of course that can not be allowed. Or the user could also change their reset token, or when that reset token expires, and all of that should not be allowed of course. So doing something like this would of course be a huge mistake. And so we need to make sure that the object that we pass here, so again that object that will contain the data that's gonna be updated, only contains name and email, because for now these are the only fields that we want to allow to update. And so basically we want to filter the body so that in the end, it only contains name and email and nothing else. So if then the user tries to change the role, that will then be filtered out so that it never finds its way to our database. lecture 138*/
    // filtered out unwanted field names that are now allowed to be updated
    const filteredBody = filterObj(req.body, 'email', 'role');
    const updatedUser = yield User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    }); // we can use AndUpdate b/c not using password
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
}));
exports.deleteMe = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    yield User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
}));
exports.getUser = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id).populate('timer', '_id');
        res.json(user);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
}));
exports.createUser = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: parseInt(doc)
        }
    });
}));
exports.deleteUser = (_req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
// do NOT update passwords with this!
// exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User);


/***/ }),

/***/ "./src/helpers/convertMsToSec.ts":
/*!***************************************!*\
  !*** ./src/helpers/convertMsToSec.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


exports.convertMsToSec = (ms) => {
    return Math.floor(ms / 1000);
};


/***/ }),

/***/ "./src/helpers/getCurrentTimeInMs.ts":
/*!*******************************************!*\
  !*** ./src/helpers/getCurrentTimeInMs.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


exports.getCurrentTimeInMs = () => {
    return new Date(Date.now()).getTime();
};


/***/ }),

/***/ "./src/helpers/isCommand.ts":
/*!**********************************!*\
  !*** ./src/helpers/isCommand.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


exports.isCommand = (message) => {
    const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
    return regexpCommand.test(message);
};


/***/ }),

/***/ "./src/models/Command.ts":
/*!*******************************!*\
  !*** ./src/models/Command.ts ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
const command = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
const Command = mongoose_1.default.model('Command', command);
module.exports = Command;


/***/ }),

/***/ "./src/models/Cooldown.ts":
/*!********************************!*\
  !*** ./src/models/Cooldown.ts ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
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


/***/ }),

/***/ "./src/models/Quote.ts":
/*!*****************************!*\
  !*** ./src/models/Quote.ts ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
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


/***/ }),

/***/ "./src/models/User.ts":
/*!****************************!*\
  !*** ./src/models/User.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
const user = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    values: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true,
        default: {
            fatYoshiWeightContributed: 0
        }
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
exports["default"] = User;


/***/ }),

/***/ "./src/models/Value.ts":
/*!*****************************!*\
  !*** ./src/models/Value.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
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
exports["default"] = Value;


/***/ }),

/***/ "./src/routes/userRoutes.ts":
/*!**********************************!*\
  !*** ./src/routes/userRoutes.ts ***!
  \**********************************/
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.router = void 0;
const express = __webpack_require__(/*! express */ "express");
const userController = __webpack_require__(/*! ./../controllers/userController */ "./src/controllers/userController.ts");
const authController = __webpack_require__(/*! ./../controllers/authController */ "./src/controllers/authController.ts");
exports.router = express.Router();
exports.router
    .route('/createUser')
    .post(/*authController.protect,*/ userController.createUser);
exports.router.route('/getAllUsers').get(userController.getAllUsers);
module.exports = exports.router;


/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const dotenv = (__webpack_require__(/*! dotenv */ "dotenv").config)();
const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
const tmiClient_1 = __importDefault(__webpack_require__(/*! ./bot/tmiClient */ "./src/bot/tmiClient.ts"));
const { commandHandler, redemptionHandler } = __webpack_require__(/*! ./bot/handlers */ "./src/bot/handlers.ts");
const Value = __webpack_require__(/*! ./models/Value */ "./src/models/Value.ts");
const app = __webpack_require__(/*! ./app */ "./src/app.ts");
mongoose
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})
    .then((_con) => console.log('Database connection successful.'));
tmiClient_1.default.connect();
tmiClient_1.default.on('message', commandHandler);
tmiClient_1.default.on('redeem', redemptionHandler);
process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit(1); // code 0 = success; code 1 = uncaught exception
});
const port = process.env.PORT || 8000;
const server = app.listen(port, () => { });
process.on('unhandledRejection', (_err) => {
    server.close(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    server.close(() => { });
});


/***/ }),

/***/ "./src/utils/apiFeatures.ts":
/*!**********************************!*\
  !*** ./src/utils/apiFeatures.ts ***!
  \**********************************/
/***/ ((module) => {


class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        // return entire object
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        // return entire object
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
module.exports = APIFeatures;


/***/ }),

/***/ "./src/utils/appError.ts":
/*!*******************************!*\
  !*** ./src/utils/appError.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // calling constructor of parent class
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // all errors get this property set to true ; we can then test for this property and only send back error messages to the client for these operational errors that we created using this class
        Error.captureStackTrace(this, this.constructor); // when a new object is created, and a constructor function is called, then that function call is not gonna appear in ths taack trace and will not popllute it
    }
}
exports["default"] = AppError;


/***/ }),

/***/ "./src/utils/catchAsync.ts":
/*!*********************************!*\
  !*** ./src/utils/catchAsync.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports["default"] = catchAsync;


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-mongo-sanitize":
/*!*****************************************!*\
  !*** external "express-mongo-sanitize" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("express-mongo-sanitize");

/***/ }),

/***/ "express-rate-limit":
/*!*************************************!*\
  !*** external "express-rate-limit" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("express-rate-limit");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "hpp":
/*!**********************!*\
  !*** external "hpp" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("hpp");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("morgan");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "tmi.js":
/*!*************************!*\
  !*** external "tmi.js" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("tmi.js");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "xss-clean":
/*!****************************!*\
  !*** external "xss-clean" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("xss-clean");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZHhCLE1BQU0sVUFBVSxHQUFHLENBQUMsRUFBWSxFQUFZLEVBQUU7SUFDNUMsT0FBTyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1FBQ3pELEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixxQkFBZSxVQUFVLENBQUM7Ozs7Ozs7Ozs7O0FDUDFCOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL2JvdC9hY3Rpb25zLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL2JvdC9jb21tYW5kcy50cyIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC8uL3NyYy9ib3QvaGFuZGxlcnMudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvYm90L3Jld2FyZHMudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvYm90L3RtaUNsaWVudC50cyIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC8uL3NyYy9ib3QvdXRpbHMvZ2VuZXJhdGVQZXRlclNlbnRlbmNlLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL2JvdC91dGlscy9pc09uQ29vbGRvd24udHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL2NvbnRyb2xsZXJzL2F1dGhDb250cm9sbGVyLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL2NvbnRyb2xsZXJzL2hhbmRsZXJGYWN0b3J5LnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL2NvbnRyb2xsZXJzL3VzZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL2hlbHBlcnMvY29udmVydE1zVG9TZWMudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvaGVscGVycy9nZXRDdXJyZW50VGltZUluTXMudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvaGVscGVycy9pc0NvbW1hbmQudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvbW9kZWxzL0NvbW1hbmQudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvbW9kZWxzL0Nvb2xkb3duLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL21vZGVscy9RdW90ZS50cyIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC8uL3NyYy9tb2RlbHMvVXNlci50cyIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC8uL3NyYy9tb2RlbHMvVmFsdWUudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvcm91dGVzL3VzZXJSb3V0ZXMudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvLi9zcmMvc2VydmVyLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL3V0aWxzL2FwaUZlYXR1cmVzLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL3V0aWxzL2FwcEVycm9yLnRzIiwid2VicGFjazovL2ZhdHlvc2hpYm90Ly4vc3JjL3V0aWxzL2NhdGNoQXN5bmMudHMiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvZXh0ZXJuYWwgY29tbW9uanMgXCJib2R5LXBhcnNlclwiIiwid2VicGFjazovL2ZhdHlvc2hpYm90L2V4dGVybmFsIGNvbW1vbmpzIFwiY29va2llLXBhcnNlclwiIiwid2VicGFjazovL2ZhdHlvc2hpYm90L2V4dGVybmFsIGNvbW1vbmpzIFwiY29yc1wiIiwid2VicGFjazovL2ZhdHlvc2hpYm90L2V4dGVybmFsIGNvbW1vbmpzIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzLW1vbmdvLXNhbml0aXplXCIiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzLXJhdGUtbGltaXRcIiIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC9leHRlcm5hbCBjb21tb25qcyBcImhlbG1ldFwiIiwid2VicGFjazovL2ZhdHlvc2hpYm90L2V4dGVybmFsIGNvbW1vbmpzIFwiaHBwXCIiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvZXh0ZXJuYWwgY29tbW9uanMgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC9leHRlcm5hbCBjb21tb25qcyBcIm1vbmdvb3NlXCIiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3QvZXh0ZXJuYWwgY29tbW9uanMgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC9leHRlcm5hbCBjb21tb25qcyBcInBhdGhcIiIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC9leHRlcm5hbCBjb21tb25qcyBcInRtaS5qc1wiIiwid2VicGFjazovL2ZhdHlvc2hpYm90L2V4dGVybmFsIGNvbW1vbmpzIFwidXRpbFwiIiwid2VicGFjazovL2ZhdHlvc2hpYm90L2V4dGVybmFsIGNvbW1vbmpzIFwieHNzLWNsZWFuXCIiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3Qvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9mYXR5b3NoaWJvdC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmF0eW9zaGlib3Qvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgbW9yZ2FuID0gcmVxdWlyZSgnbW9yZ2FuJyk7XG5jb25zdCByYXRlTGltaXQgPSByZXF1aXJlKCdleHByZXNzLXJhdGUtbGltaXQnKTtcbmNvbnN0IGhlbG1ldCA9IHJlcXVpcmUoJ2hlbG1ldCcpO1xuY29uc3QgbW9uZ29TYW5pdGl6ZSA9IHJlcXVpcmUoJ2V4cHJlc3MtbW9uZ28tc2FuaXRpemUnKTtcbmNvbnN0IHhzcyA9IHJlcXVpcmUoJ3hzcy1jbGVhbicpO1xuY29uc3QgY29va2llUGFyc2VyID0gcmVxdWlyZSgnY29va2llLXBhcnNlcicpO1xuY29uc3QgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJyk7XG5jb25zdCBocHAgPSByZXF1aXJlKCdocHAnKTtcbmNvbnN0IGNvcnMgPSByZXF1aXJlKCdjb3JzJyk7XG5pbXBvcnQgQXBwRXJyb3IgZnJvbSAnLi91dGlscy9hcHBFcnJvcic7XG5jb25zdCB1c2VyUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXMvdXNlclJvdXRlcycpO1xuY29uc3QgY29tbWFuZFJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVzL3VzZXJSb3V0ZXMnKTtcbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuLy8gQnkgZW5hYmxpbmcgdGhlIFwidHJ1c3QgcHJveHlcIiBzZXR0aW5nIHZpYSBhcHAuZW5hYmxlKCd0cnVzdCBwcm94eScpLCBFeHByZXNzIHdpbGwgaGF2ZSBrbm93bGVkZ2UgdGhhdCBpdCdzIHNpdHRpbmcgYmVoaW5kIGEgcHJveHkgYW5kIHRoYXQgdGhlIFgtRm9yd2FyZGVkLSogaGVhZGVyIGZpZWxkcyBtYXkgYmUgdHJ1c3RlZCwgd2hpY2ggb3RoZXJ3aXNlIG1heSBiZSBlYXNpbHkgc3Bvb2ZlZC5cbmFwcC5lbmFibGUoJ3RydXN0IHByb3h5Jyk7XG4vKlxuYXBwLnVzZShcbiAgY29ycyh7XG4gICAgb3JpZ2luOiBbJ2h0dHBzOi8vMTJob3Vyc3R1ZHkubmV0bGlmeS5hcHAnLCAnaHR0cDovL2xvY2FsaG9zdDozMDAwJ10sXG4gICAgbWV0aG9kczogWydHRVQnLCAnUE9TVCcsICdQVVQnLCAnREVMRVRFJywgJ1BBVENIJ10sXG4gICAgY3JlZGVudGlhbHM6IHRydWVcbiAgfSlcbik7XG4qL1xuYXBwLm9wdGlvbnMoJyonLCBjb3JzKCkpO1xuXG4vLyBIZWxtZXQgaGVscHMgeW91IHNlY3VyZSB5b3VyIEV4cHJlc3MgYXBwcyBieSBzZXR0aW5nIHZhcmlvdXMgSFRUUCBoZWFkZXJzLlxuYXBwLnVzZShoZWxtZXQoKSk7XG5cbi8vIEhUVFAgcmVxdWVzdCBsb2dnZXIgbWlkZGxld2FyZVxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gIGFwcC51c2UobW9yZ2FuKCdkZXYnKSk7XG59XG5cbi8vIFBhcnNlIGluY29taW5nIHJlcXVlc3QgYm9kaWVzIGluIGEgbWlkZGxld2FyZSBiZWZvcmUgeW91ciBoYW5kbGVycywgYXZhaWxhYmxlIHVuZGVyIHRoZSByZXEuYm9keSBwcm9wZXJ0eS5cbmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpO1xuXG5hcHAudXNlKGhwcCgpKTtcblxuLy8gcmF0ZSBsaW1pdGluZ1xuY29uc3QgbGltaXRlciA9IHJhdGVMaW1pdCh7XG4gIG1heDogNTAwMCxcbiAgd2luZG93TXM6IDYwICogNjAgKiAxMDAwLFxuICBtZXNzYWdlOiAnVG9vIG1hbnkgcmVxdWVzdHMgZnJvbSB0aGlzIElQOyBwbGVhc2UgdHJ5IGFnYWluIGluIGFuIGhvdXIuJ1xufSk7XG5cbmFwcC51c2UoJy9hcGknLCBsaW1pdGVyKTtcbmFwcC51c2UoZXhwcmVzcy5qc29uKHsgbGltaXQ6ICcxMGtiJyB9KSk7XG5hcHAudXNlKGNvb2tpZVBhcnNlcigpKTtcbmFwcC51c2UobW9uZ29TYW5pdGl6ZSgpKTtcbmFwcC51c2UoeHNzKCkpO1xuXG5hcHAudXNlKChyZXE6IHsgcmVxdWVzdFRpbWU6IHN0cmluZyB9LCBfcmVzOiBhbnksIG5leHQ6ICgpID0+IHZvaWQpID0+IHtcbiAgcmVxLnJlcXVlc3RUaW1lID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICBuZXh0KCk7XG59KTtcblxuYXBwLnVzZShgL2FwaS8ke3Byb2Nlc3MuZW52LkFQSV9WRVJTSU9OfS91c2Vyc2AsIHVzZXJSb3V0ZXIpO1xuXG5hcHAuZ2V0KCcvJywgKF9yZXE6IGFueSwgcmVzOiB7IHNlbmQ6IChhcmcwOiBzdHJpbmcpID0+IHZvaWQgfSkgPT4ge1xuICByZXMuc2VuZCgnSGVsbG8gZnJvbSBFeHByZXNzIScpO1xufSk7XG5cbmFwcC5hbGwoXG4gICcqJyxcbiAgKHJlcTogeyBvcmlnaW5hbFVybDogYW55IH0sIF9yZXM6IGFueSwgbmV4dDogKGFyZzA6IGFueSkgPT4gdm9pZCkgPT4ge1xuICAgIG5leHQobmV3IEFwcEVycm9yKGBDYW4ndCBmaW5kIFVSTCAke3JlcS5vcmlnaW5hbFVybH0gb24gdGhpcyBzZXJ2ZXJgLCA0MDQpKTtcbiAgfVxuKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG4iLCJpbXBvcnQgVXNlciBmcm9tICcuLi9tb2RlbHMvVXNlcic7XG5cbmV4cG9ydHMuaW5jcmVtZW50VXNlclZhbHVlID0gKFxuICB1c2VybmFtZTogc3RyaW5nLFxuICB2YWx1ZTogbnVtYmVyLFxuICBhbW91bnQ6IG51bWJlclxuKSA9PiB7XG4gIGNvbnN0IHVzZXIgPSBVc2VyLmZpbmRPbmVBbmRVcGRhdGUoXG4gICAgeyB1c2VybmFtZSB9LFxuICAgIHtcbiAgICAgICRpbmM6IHsgW2B2YWx1ZXMuJHt2YWx1ZX1gXTogYW1vdW50IH1cbiAgICB9LFxuICAgIHtcbiAgICAgIHVwc2VydDogdHJ1ZSxcbiAgICAgIG5ldzogdHJ1ZVxuICAgIH1cbiAgKTtcbiAgcmV0dXJuIHVzZXI7XG59O1xuIiwiY29uc3QgQ29tbWFuZCA9IHJlcXVpcmUoJy4vLi4vbW9kZWxzL0NvbW1hbmQnKTtcbmNvbnN0IFF1b3RlcyA9IHJlcXVpcmUoJy4uL21vZGVscy9RdW90ZScpO1xuY29uc3QgeyBpbmNyZW1lbnRVc2VyVmFsdWUgfSA9IHJlcXVpcmUoJy4vYWN0aW9ucycpO1xuY29uc3QgeyBTVFJFQU1FUl9OSUNLTkFNRSB9ID0gcmVxdWlyZSgnLi8uLi9jb25zdGFudHMnKTtcbmNvbnN0IHsgZ2VuZXJhdGVQZXRlclNlbnRlbmNlIH0gPSByZXF1aXJlKCcuL3V0aWxzL2dlbmVyYXRlUGV0ZXJTZW50ZW5jZScpO1xuLy8gY29uc3QgeyBnZW5lcmF0ZVB1YmxpY0NvbW1hbmRzTGlzdCB9ID0gcmVxdWlyZSgnLi91dGlscy9nZW5lcmF0ZVB1YmxpY0NvbW1hbmRzTGlzdCcpO1xuXG5leHBvcnQgY29uc3QgY29tbWFuZHMgPSB7XG4gIHI6IHtcbiAgICBhY2Nlc3M6IFsndXNlciddLFxuICAgIG9uQ29tbWFuZDogYXN5bmMgKCkgPT4ge1xuICAgICAgcmV0dXJuIGBQbGVhc2UgcmVzZXQsICR7U1RSRUFNRVJfTklDS05BTUV9LmA7XG4gICAgfVxuICB9LFxuICBjOiB7XG4gICAgYWNjZXNzOiBbJ3VzZXInXSxcbiAgICBvbkNvbW1hbmQ6IGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiBgUGxlYXNlIGNvbnRpbnVlLCAke1NUUkVBTUVSX05JQ0tOQU1FfS5gO1xuICAgIH1cbiAgfSxcbiAgYm90OiB7XG4gICAgYWNjZXNzOiBbJ2FkbWluJ10sXG4gICAgb25Db21tYW5kOiBhc3luYyAoKSA9PiB7fVxuICB9LFxuICBjb21tYW5kczoge1xuICAgIGFjY2VzczogWyd1c2VyJ10sXG4gICAgb25Db21tYW5kOiBhc3luYyAoKSA9PiB7XG4gICAgICByZXR1cm4gY29tbWFuZHNMaXN0O1xuICAgIH1cbiAgfSxcbiAgcGV0ZXI6IHtcbiAgICBhY2Nlc3M6IFsndXNlciddLFxuICAgIG9uQ29tbWFuZDogYXN5bmMgKCkgPT4ge1xuICAgICAgcmV0dXJuIGdlbmVyYXRlUGV0ZXJTZW50ZW5jZSgpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5jb21tYW5kcyA9IGNvbW1hbmRzO1xuXG5jb25zdCBnZW5lcmF0ZVB1YmxpY0NvbW1hbmRzTGlzdCA9ICh7IGNvbW1hbmRzIH0pID0+IHtcbiAgbGV0IHB1YmxpY0NvbW1hbmRzTGlzdDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBjb21tYW5kIGluIGNvbW1hbmRzKSB7XG4gICAgaWYgKCFjb21tYW5kc1tjb21tYW5kXS5hY2Nlc3MuaW5jbHVkZXMoJ2FkbWluJykpXG4gICAgICBwdWJsaWNDb21tYW5kc0xpc3QucHVzaChgISR7Y29tbWFuZH1gKTtcbiAgfVxuICByZXR1cm4gcHVibGljQ29tbWFuZHNMaXN0LmpvaW4oJyAnKTtcbn07XG5cbmNvbnN0IGNvbW1hbmRzTGlzdCA9IGdlbmVyYXRlUHVibGljQ29tbWFuZHNMaXN0KHsgY29tbWFuZHMgfSk7XG4iLCJpbXBvcnQgdG1pQ2xpZW50IGZyb20gJy4vdG1pQ2xpZW50JztcbmNvbnN0IHsgY29tbWFuZHMgfSA9IHJlcXVpcmUoJy4vY29tbWFuZHMnKTtcbmNvbnN0IHsgcmV3YXJkcyB9ID0gcmVxdWlyZSgnLi9yZXdhcmRzJyk7XG5jb25zdCByZWdleHBDb21tYW5kID0gbmV3IFJlZ0V4cCgvXiEoW2EtekEtWjAtOV0rKSg/OlxcVyspPyguKik/Lyk7XG5jb25zdCB7IGlzT25Db29sZG93biB9ID0gcmVxdWlyZSgnLi91dGlscy9pc09uQ29vbGRvd24nKTtcbmNvbnN0IHsgaXNDb21tYW5kIH0gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNDb21tYW5kJyk7XG5leHBvcnRzLmNvbW1hbmRIYW5kbGVyID0gYXN5bmMgKGNoYW5uZWwsIGNvbnRleHQsIG1lc3NhZ2UsIHNlbGYpID0+IHtcbiAgLy8gSWYgb3VyIG1lc3NhZ2UgaXNuJ3QgZm9ybWF0dGVkIGxpa2UgYSBjb21tYW5kIChpLmUuLCBwcmVjZWRlZCBieSBhICchJyksIGV4aXQgZm4uXG4gIGlmICghaXNDb21tYW5kKG1lc3NhZ2UpKSByZXR1cm47XG5cbiAgLy8gSWYgdGhlIHVzZXIgaXMgdGhlIGJvdCBpdHNlbGYsIGV4aXQgZm4uXG4gIGlmIChzZWxmKSByZXR1cm47XG5cbiAgLy8gU2VwYXJhdGUgdGhlIHJhdyBtZXNzYWdlLCB0aGUgY29tbWFuZCBpdHNlbGYsIGFuZCBhbnkgYXJncyBpbnRvIHZhcmlhYmxlcy5cbiAgY29uc3QgW3JhdywgY29tbWFuZCwgYXJndW1lbnRdID0gbWVzc2FnZS5tYXRjaChyZWdleHBDb21tYW5kKTtcblxuICAvLyBPYnRhaW4gdGhlIG9uQ29tbWFuZCBmbiBmcm9tIHRoZSBjb21tYW5kIHRvIHdoaWNoIGl0IGJlbG9uZ3MuXG4gIGNvbnN0IHsgb25Db21tYW5kIH0gPSBjb21tYW5kc1tjb21tYW5kXSB8fCB7fTtcblxuICAvLyBJZiB0aGUgY29tbWFuZCBkb2Vzbid0IGV4aXN0LCBleGl0IGZuLlxuICBpZiAoY29tbWFuZHNbY29tbWFuZF0gPT09IHt9KSByZXR1cm47XG4gIC8vICBjb25zb2xlLmxvZyhhd2FpdCBpc09uQ29vbGRvd24oY29udGV4dC51c2VybmFtZSwgY29tbWFuZCkpO1xuXG4gIC8vIEV4ZWN1dGUgdGhlIG9uQ29tbWFuZCBmbiwgYXdhaXQgaXRzIHJlc3BvbnNlLCBhbmQgc3RvcmUgaXQgaW4gYSB2YXIuXG4gIGxldCByZXNwb25zZSA9IGF3YWl0IG9uQ29tbWFuZCh7IGNoYW5uZWwsIGNvbnRleHQsIG1lc3NhZ2UsIHNlbGYgfSk7XG5cbiAgLy8gRXhlY3V0ZSB0aGUgaXNPbkNvb2xkb3duIGZuIGFuZCBhd2FpdCBpdHMgcmVzcG9uc2UsIHdoaWNoIHdpbGwgYmUgZWl0aGVyIHRydWUgaWYgdGhlcmUgaXMgYW4gYWN0aXZlIGNvb2xkb3duIG9yIGZhbHNlIGlmIHRoZXJlIGlzbid0IG9uZS5cbiAgY29uc3QgY29vbGRvd25Jc0FjdGl2ZSA9IGF3YWl0IGlzT25Db29sZG93bihjb250ZXh0LnVzZXJuYW1lLCBjb21tYW5kKTtcblxuICAvLyBjb25zb2xlLmxvZyhgY2FuU2F5OiAke2NhblNheX1gKTtcblxuICAvLyBJZiB0aGVyZSBpc24ndCBhbiBhY3RpdmUgY29vbGRvd24sIGNvbnZleSB0aGUgcmVzcG9uc2UgdG8gdGhlIGNoYW5uZWwgaW4gYSBtZXNzYWdlLlxuICBpZiAoIWNvb2xkb3duSXNBY3RpdmUpIHRtaUNsaWVudC5zYXkoY2hhbm5lbCwgcmVzcG9uc2UpO1xufTtcblxuZXhwb3J0cy5yZWRlbXB0aW9uSGFuZGxlciA9IGFzeW5jIChjaGFubmVsLCB1c2VybmFtZSwgdHlwZSwgdGFncywgbWVzc2FnZSkgPT4ge1xuICAvLyBJZiBhIHJld2FyZCB3aXRoIHRoYXQgcmV3YXJkIGlkIGlzbid0IHByZXNlbnQgaW4gdGhlIGxpc3Qgb2YgcmV3YXJkcywgZXhpdCBmbi5cbiAgaWYgKCFyZXdhcmRzW3R5cGVdKSByZXR1cm47XG4gIC8vIElmIHRoZSByZWRlZW1lciBpcyB0aGUgYm90IGl0c2VsZiwgZXhpdCBmbi5cbiAgaWYgKHNlbGYpIHJldHVybjtcblxuICAvLyBPYnRhaW4gdGhlIG9uUmVkZW1wdGlvbiBmbiBmcm9tIHRoZSByZXdhcmQgdG8gd2hpY2ggaXQgYmVsb25ncy5cbiAgY29uc3QgeyBvblJlZGVtcHRpb24gfSA9IHJld2FyZHNbdHlwZV07XG5cbiAgLy8gRXhlY3V0ZSB0aGUgb25SZWRlbXB0aW9uIGZuLCBhd2FpdCBpdHMgcmVzcG9uc2UsIGFuZCBzdG9yZSBpdCBpbiBhIHZhci5cbiAgbGV0IHJlc3BvbnNlID0gYXdhaXQgb25SZWRlbXB0aW9uKHsgY2hhbm5lbCwgdXNlcm5hbWUsIHR5cGUsIHRhZ3MsIG1lc3NhZ2UgfSk7XG5cbiAgLy8gQ29udmV5IHRoZSByZXNwb25zZSB0byB0aGUgY2hhbm5lbCBpbiBhIG1lc3NhZ2UuXG4gIHRtaUNsaWVudC5zYXkoY2hhbm5lbCwgcmVzcG9uc2UpO1xufTtcbiIsImltcG9ydCB7IFZhbHVlRGV0ZXJtaW5pbmdNaWRkbGV3YXJlIH0gZnJvbSAnZXhwcmVzcy1yYXRlLWxpbWl0JztcbmltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5jb25zdCB7IFZhbHVlIH0gPSByZXF1aXJlKCcuLy4uL21vZGVscy9WYWx1ZScpO1xuY29uc3QgeyBpbmNyZW1lbnRVc2VyVmFsdWUgfSA9IHJlcXVpcmUoJy4vYWN0aW9ucycpO1xuY29uc3QgeyBSRVdBUkRfRkVFRF9GQVRfWU9TSEksIEVNT1RFX0ZBVF9ZT1NISSB9ID0gcmVxdWlyZSgnLi8uLi9jb25zdGFudHMnKTtcblxuZXhwb3J0cy5yZXdhcmRzID0ge1xuICBbYCR7UkVXQVJEX0ZFRURfRkFUX1lPU0hJfWBdOiB7XG4gICAgb25SZXdhcmQ6IGFzeW5jICh7IHVzZXJuYW1lIH0pID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBpbmNyZW1lbnRVc2VyVmFsdWUoXG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAnZmF0WW9zaGlXZWlnaHRDb250cmlidXRlZCcsXG4gICAgICAgIDFcbiAgICAgICk7XG4gICAgICBjb25zdCBmYXRZb3NoaVdlaWdodCA9IGF3YWl0IFZhbHVlLmZpbmQoe1xuICAgICAgICBuYW1lOiAnZmF0WW9zaGlXZWlnaHQnXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHsgbnVtOiB3ZWlnaHQgfSA9IGZhdFlvc2hpV2VpZ2h0O1xuICAgICAgY29uc3QgeyBmYXRZb3NoaVdlaWdodENvbnRyaWJ1dGVkOiBjb250cmlidXRlZCB9ID0gdXNlci52YWx1ZXM7XG4gICAgICByZXR1cm4gYCR7RU1PVEVfRkFUX1lPU0hJfSBUaGFua3MgZm9yIGZlZWRpbmcgbWUsICR7dXNlcm5hbWV9ISBJIG5vdyB3ZWlnaCAke3dlaWdodH0gbGJzLi8ke1xuICAgICAgICB3ZWlnaHQgLyAyLjJcbiAgICAgIH0ga2dzKSEgWW91J3ZlIGNvbnRyaWJ1dGVkICR7Y29udHJpYnV0ZWR9IGxicy4vJHtcbiAgICAgICAgY29udHJpYnV0ZWQgLyAyLjJcbiAgICAgIH0ga2dzISBUaGFua3MgZm9yIGtlZXBpbmcgbWUgZmF0ISAke0VNT1RFX0ZBVF9ZT1NISX1gO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB0bWkgZnJvbSAndG1pLmpzJztcblxuY29uc3Qgb3B0aW9uczogdG1pLk9wdGlvbnMgPSB7XG4gIGNvbm5lY3Rpb246IHtcbiAgICByZWNvbm5lY3Q6IHRydWVcbiAgfSxcbiAgaWRlbnRpdHk6IHtcbiAgICB1c2VybmFtZTogcHJvY2Vzcy5lbnYuVFdJVENIX0JPVF9VU0VSTkFNRSxcbiAgICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuVFdJVENIX0JPVF9PQVVUSF9UT0tFTlxuICB9LFxuXG4gIGNoYW5uZWxzOiBbJ2d1bXNob2UyMSddXG59O1xuXG5jb25zdCB0bWlDbGllbnQgPSBuZXcgdG1pLkNsaWVudChvcHRpb25zKTtcblxuZXhwb3J0IGRlZmF1bHQgdG1pQ2xpZW50O1xuIiwiZXhwb3J0cy5nZW5lcmF0ZVBldGVyU2VudGVuY2UgPSAoKSA9PiB7XG4gIGNvbnN0IHdvcmRHcm91cHMgPSBbXG4gICAgW1xuICAgICAgXCJEb24ndFwiLFxuICAgICAgJ3dvcnJ5JyxcbiAgICAgICdNci4nLFxuICAgICAgJ0F6aXonLFxuICAgICAgJ3RoZXNlJyxcbiAgICAgICdwaXp6YXMnLFxuICAgICAgJ2FyZScsXG4gICAgICAnaW4nLFxuICAgICAgJ2dvb2QnLFxuICAgICAgJ2hhbmRzJ1xuICAgIF0sXG4gICAgW1xuICAgICAgJ09oJyxcbiAgICAgICdubycsXG4gICAgICAnRHIuJyxcbiAgICAgIFwiQ29ubmVycydcIixcbiAgICAgICdjbGFzcycsXG4gICAgICAnSScsXG4gICAgICAnZ290JyxcbiAgICAgICdzbycsXG4gICAgICAnY2F1Z2h0JyxcbiAgICAgICd1cCcsXG4gICAgICAnaW4nLFxuICAgICAgJ3doYXQnLFxuICAgICAgJ0knLFxuICAgICAgJ3dhcycsXG4gICAgICAnZG9pbmcnLFxuICAgICAgJ0knLFxuICAgICAgJ2ZvcmdvdCcsXG4gICAgICAnYWxsJyxcbiAgICAgICdhYm91dCcsXG4gICAgICAnaXQnLFxuICAgICAgXCJTJ2dvbm5hXCIsXG4gICAgICAna2lsbCcsXG4gICAgICAnbWUnXG4gICAgXVxuICBdO1xuXG4gIGNvbnN0IGdyb3VwQ291bnQgPSB3b3JkR3JvdXBzLmxlbmd0aDtcbiAgY29uc3QgcmFuZG9tR3JvdXAgPSB3b3JkR3JvdXBzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdyb3VwQ291bnQpXTtcblxuICBmb3IgKGxldCBpID0gcmFuZG9tR3JvdXAubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgIGxldCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgW3JhbmRvbUdyb3VwW2ldLCByYW5kb21Hcm91cFtqXV0gPSBbcmFuZG9tR3JvdXBbal0sIHJhbmRvbUdyb3VwW2ldXTtcbiAgfVxuICByZXR1cm4gcmFuZG9tR3JvdXAuam9pbignICcpO1xufTtcbiIsImNvbnN0IENvb2xkb3duID0gcmVxdWlyZSgnLi4vLi4vbW9kZWxzL0Nvb2xkb3duJyk7XG5jb25zdCB7IGNvbnZlcnRNc1RvU2VjIH0gPSByZXF1aXJlKCcuLy4uLy4uL2hlbHBlcnMvY29udmVydE1zVG9TZWMnKTtcbmNvbnN0IHsgZ2V0Q3VycmVudFRpbWVJbk1zIH0gPSByZXF1aXJlKCcuLy4uLy4uL2hlbHBlcnMvZ2V0Q3VycmVudFRpbWVJbk1zJyk7XG5jb25zdCB7IEdMT0JBTF9DT09MRE9XTl9USU1FX0lOX1NFQ09ORFMgfSA9IHJlcXVpcmUoJy4vLi4vLi4vY29uc3RhbnRzJyk7XG5cbmV4cG9ydHMuaXNPbkNvb2xkb3duID0gYXN5bmMgKHVzZXJuYW1lOiBzdHJpbmcsIGNvbW1hbmQ6IHN0cmluZykgPT4ge1xuICAvLyBUcnkgdG8gZmluZCBhIGNvb2xkb3duIHdpdGggdGhlIHByb3ZpZGVkIHVzZXJuYW1lIGFuZCBjb21tYW5kIG5hbWUgaW4gdGhlIGRhdGFiYXNlLiBJZiBzdWNoIGEgY29vbGRvd24gaXNuJ3QgZm91bmQsIGNyZWF0ZSBhIG5ldyBjb29sZG93biB3aXRoIHRoZSBwcm92aWRlZCB1c2VybmFtZSBhbmQgY29tbWFuZCBuYW1lIGFuZCBzZXQgdGhlIHN0YXJ0VGltZSBmaWVsZCB0byB0aGUgY3VycmVudCB0aW1lIGluIG1pbGxpc2Vjb25kcy5cbiAgdHJ5IHtcbiAgICBsZXQgY29vbGRvd24gPSBhd2FpdCBDb29sZG93bi5maW5kT25lKHtcbiAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICB9KTtcblxuICAgIGlmICghY29vbGRvd24pIHtcbiAgICAgIGNvb2xkb3duID0gYXdhaXQgQ29vbGRvd24uY3JlYXRlKHtcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIGNvbW1hbmQsXG4gICAgICAgIHN0YXJ0VGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSkuZ2V0VGltZSgpXG4gICAgICB9KTtcbiAgICB9XG4gICAgLy9cbiAgICBjb25zb2xlLmxvZyhNYXRoLmZsb29yKGNvb2xkb3duLnN0YXJ0VGltZSAvIDEwMDApKTtcbiAgICAvLyBTdG9yZSB0aGUgY3VycmVudCB0aW1lIGluIG1pbGxpc2Vjb25kcyBpbiBhIHZhcmlhYmxlLlxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKERhdGUubm93KCkpLmdldFRpbWUoKTtcblxuICAgIGNvbnNvbGUubG9nKE1hdGguZmxvb3IobmV3IERhdGUoRGF0ZS5ub3coKSkuZ2V0VGltZSgpIC8gMTAwMCkpO1xuICAgIC8vIGlmIHRoZSBjdXJyZW50IHRpbWUgaXMgbm90IGVxdWFsIHRvIHRoZSBjb29sZG93bidzIHN0YXJ0VGltZSwgYW5kIGlmIDMwIHNlY29uZHMgaGFzbid0IHBhc3NlZCBzaW5jZSB0aGUgY29vbGRvd24ncyBzdGFydFRpbWUsIHJldHVybiB0cnVlLCBpbmRpY2F0ZWQgdGhhdCB0aGVyZSBpcyBhbiBhY3RpdmUgY29vbGRvd24uIE90aGVyd2lzZSwgZGVsZXRlIHRoZSBjdXJyZW50IGNvb2xkb3duLCBhcyBpdCBoYXMgZXhwaXJlZCwgYW5kIHJldHVybiBmYWxzZSwgaW5kaWNhdGluZyB0aGF0IHRoZXJlIGlzIG5vIGFjdGl2ZSBjb29sZG93bi5cbiAgICBpZiAoXG4gICAgICBjb252ZXJ0TXNUb1NlYyhnZXRDdXJyZW50VGltZUluTXMoKSkgIT09XG4gICAgICAgIGNvbnZlcnRNc1RvU2VjKGNvb2xkb3duLnN0YXJ0VGltZSkgJiZcbiAgICAgIGNvbnZlcnRNc1RvU2VjKGdldEN1cnJlbnRUaW1lSW5NcygpKSAtXG4gICAgICAgIGNvbnZlcnRNc1RvU2VjKGNvb2xkb3duLnN0YXJ0VGltZSkgPFxuICAgICAgICAzMFxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IENvb2xkb3duLmRlbGV0ZU9uZSh7IHVzZXJuYW1lOiB1c2VybmFtZSwgY29tbWFuZDogY29tbWFuZCB9KTtcbiAgICAgIGNvb2xkb3duID0gYXdhaXQgQ29vbGRvd24uY3JlYXRlKHtcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIGNvbW1hbmQsXG4gICAgICAgIHN0YXJ0VGltZTogbmV3IERhdGUoRGF0ZS5ub3coKSkuZ2V0VGltZSgpXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH1cbn07XG4iLCIvLyBHZW5lcmFsXG5cbmV4cG9ydHMuU1RSRUFNRVJfTklDS05BTUUgPSAnR3Vtc2hvZSc7XG5cbi8vIEVtb3Rlc1xuXG5leHBvcnRzLkVNT1RFX0ZBVF9ZT1NISSA9ICdGYXRZb3NoaSc7XG5cbi8vIFJld2FyZHNcblxuZXhwb3J0cy5SRVdBUkRfRkVFRF9GQVRfWU9TSEkgPSAnOTcxZjhkOTQtNmExYi00NzVhLWFlNjctNTJjN2IzMGYxMmZjJztcblxuZXhwb3J0cy5HTE9CQUxfQ09PTERPV05fVElNRV9JTl9TRUNPTkRTID0gMzA7XG4iLCJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5jb25zdCB7IHByb21pc2lmeSB9ID0gcmVxdWlyZSgndXRpbCcpOyAvLyB1dGlsaXR5IGZvciBwcm9taXNpZnkgbWV0aG9kXG5jb25zdCBkb3RlbnYgPSByZXF1aXJlKCdkb3RlbnYnKTtcbmNvbnN0IGp3dCA9IHJlcXVpcmUoJ2pzb253ZWJ0b2tlbicpO1xuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vLi4vbW9kZWxzL1VzZXInKTtcbmltcG9ydCBjYXRjaEFzeW5jIGZyb20gJy4vLi4vdXRpbHMvY2F0Y2hBc3luYyc7XG5jb25zdCBBcHBFcnJvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2FwcEVycm9yJyk7XG5cbmNvbnN0IHNpZ25Ub2tlbiA9IChpZCkgPT4ge1xuICByZXR1cm4gand0LnNpZ24oeyBpZCB9LCBgJHtwcm9jZXNzLmVudi5KV1RfU0VDUkVUfWAsIHtcbiAgICBleHBpcmVzSW46ICc1ZCdcbiAgfSk7XG59O1xuXG5jb25zdCBjcmVhdGVTZW5kVG9rZW4gPSAodXNlciwgc3RhdHVzQ29kZSwgcmVzKSA9PiB7XG4gIGNvbnN0IHRva2VuID0gc2lnblRva2VuKHVzZXIuaWQpO1xuXG4gIGNvbnN0IGNvb2tpZU9wdGlvbnMgPSB7XG4gICAgZXhwaXJlczogbmV3IERhdGUoRGF0ZS5ub3coKSArIDI0ICogNjAgKiA2MCAqIDEwMDApLFxuICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgIHNhbWVTaXRlOiAnbm9uZScsXG4gICAgc2VjdXJlOiB0cnVlXG4gIH07XG5cbiAgcmVzLmNvb2tpZSgnand0JywgdG9rZW4sIGNvb2tpZU9wdGlvbnMpO1xuXG4gIC8vIHJlbW92ZSBwYXNzd29yZCBmcm9tIG91dHB1dFxuICB1c2VyLnBhc3N3b3JkID0gdW5kZWZpbmVkO1xuXG4gIHJlcy5zdGF0dXMoc3RhdHVzQ29kZSkuanNvbih7XG4gICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgdG9rZW4sXG4gICAgdXNlclxuICB9KTtcbn07XG5cbmV4cG9ydHMubG9naW4gPSBjYXRjaEFzeW5jKGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gcmVxLmJvZHk7XG4gIC8vIDEpIGNoZWNrIGlmIGVtYWlsIGFuZCBwYXNzd29yZCBleGlzdFxuICBpZiAoIWVtYWlsIHx8ICFwYXNzd29yZCkge1xuICAgIHJldHVybiBuZXh0KG5ldyBBcHBFcnJvcignUGxlYXNlIHByb3ZpZGUgZW1haWwgYW5kIHBhc3N3b3JkJywgNDAwKSk7XG4gIH1cbiAgLy8gMikgY2hlY2sgaWYgdXNlciBleGlzdHMgJiYgcGFzc293cmQgaXMgY29ycmVjdFxuICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHsgZW1haWwgfSkuc2VsZWN0KCcrcGFzc3dvcmQnKTsgLy8gd2UgYXJlIHNlbGVjdGluZyBwYXNzd29yZCBoZXJlIGJlY2F1c2Ugd2UgbmVlZCBpdCBpbiBvcmRlciB0byBjaGVjayBpZiBpdCBpcyBjb3JyZWN0IC0gbm93IGl0IHdpbGwgYmUgYmFjayBpbiB0aGUgb3V0cHV0XG4gIC8vIHNob3J0IGNpcmN1aXRpbmcgZG93biBoZXJlIGJ0d1xuICBpZiAoIXVzZXIgfHwgIShhd2FpdCB1c2VyLmNvcnJlY3RQYXNzd29yZChwYXNzd29yZCwgdXNlci5wYXNzd29yZCkpKSB7XG4gICAgLy8gaWYgbm90IHVzZXIgb3IgcGFzc3dvcmQgaW5jb3JyZWN0XG4gICAgcmV0dXJuIG5leHQobmV3IEFwcEVycm9yKCdJb25jcnJlY3QgZW1haWwgb3IgcGFzc3dvcmQnLCA0MDEpKTsgLy8gNDAxID0gdW5hdXRob3JpemVkXG4gIH1cbiAgLy8gMykgaWYgZXZlcnl0aGluZyBva2F5LCBzZW5kIHRva2VuIHRvIGNsaWVudFxuICBjcmVhdGVTZW5kVG9rZW4odXNlciwgMjAwLCByZXMpO1xufSk7XG5cbmV4cG9ydHMubG9nb3V0ID0gY2F0Y2hBc3luYyhhc3luYyAoX3JlcSwgcmVzKSA9PiB7XG4gIGNvbnN0IGNvb2tpZU9wdGlvbnMgPSB7XG4gICAgZXhwaXJlczogbmV3IERhdGUoRGF0ZS5ub3coKSArIDEwICogMTAwMCksXG4gICAgaHR0cE9ubHk6IHRydWUsXG4gICAgc2FtZVNpdGU6ICdub25lJyxcbiAgICBzZWN1cmU6IHRydWVcbiAgfTtcblxuICByZXMuY29va2llKCdqd3QnLCAnbG9nZ2VkT3V0JywgY29va2llT3B0aW9ucyk7XG5cbiAgcmVzLnN0YXR1cygyMDIpLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJyB9KTtcbn0pO1xuXG5leHBvcnRzLnByb3RlY3QgPSBjYXRjaEFzeW5jKGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAvLzEpIEdldHRpbmcgdG9rZW4gYW5kIGNoZWNrIGlmIGl0J3MgdGhlcmVcbiAgbGV0IHRva2VuO1xuICBpZiAoXG4gICAgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJlxuICAgIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3RhcnRzV2l0aCgnQmVhcmVyJylcbiAgKSB7XG4gICAgdG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV07XG4gIH0gZWxzZSBpZiAocmVxLmNvb2tpZXNbJ2p3dCddKSB7XG4gICAgdG9rZW4gPSByZXEuY29va2llc1snand0J107XG4gIH1cbiAgaWYgKCF0b2tlbikge1xuICAgIHJldHVybiBuZXh0KFxuICAgICAgbmV3IEFwcEVycm9yKCdZb3UgYXJlIG5vdCBsb2dnZWQgaW4hIFBsZWFzZSBsb2cgaW4gdG8gZ2V0IGFjY2VzcycsIDQwMSlcbiAgICApO1xuICB9XG4gIC8vMikgdmVyaWZpY2F0aW9uIHRva2VuIC0gbWFraW5nIHN1cmUgdGhlIHRva2VuIGhhc24ndCBiZWVuIG1hbmlwdWxhdGVkIGJ5IG1hbGljaW91cyAzcmQgcGFydHlcbiAgY29uc3QgZGVjb2RlZCA9IGF3YWl0IHByb21pc2lmeShqd3QudmVyaWZ5KSh0b2tlbiwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCk7XG5cbiAgLy8zKSBDaGVjayBpZiB1c2VyIHN0aWxsIGV4aXN0c1xuICAvLyBpZiBubyBvbmUgdGFtcGVyZWQgd2l0aCB0aGUgdG9rZW4uLi5cbiAgY29uc3QgY3VycmVudFVzZXIgPSBhd2FpdCBVc2VyLmZpbmRCeUlkKGRlY29kZWQuaWQpO1xuICBpZiAoIWN1cnJlbnRVc2VyKSB7XG4gICAgLy8gaWYgY3VycmVudCB1c2VyIGRvZXNuJ3QgZXhpc3QsIGRvbid0IGdpdmUgYWNjZXNzIHRvIHJvdXRlLCB0aHJvdyBlcnJcbiAgICByZXR1cm4gbmV4dChcbiAgICAgIG5ldyBBcHBFcnJvcignVGhlIHVzZXIgYmVsb25naW5nIHRvIHRoaXMgdG9rZW4gZG9lcyBubyBsb25nZXIgZXhpc3QnLCA0MDEpXG4gICAgKTtcbiAgfVxuICAvLyB1c2VyIGRvZXMgZXhpc3QgYXQgdGhpcyBwb2ludFxuICAvLzQpIENoZWNrIGlmIHVzZXIgY2hhbmdlZCBwYXNzd29yZCBhZnRlciB0aGUgdG9rZW4gd2FzIGlzc3VlZFxuICBpZiAoY3VycmVudFVzZXIuY2hhbmdlZFBhc3N3b3JkQWZ0ZXIoZGVjb2RlZC5pYXQpKSB7XG4gICAgLy8gaWF0ID0gaXNzdWVkIGF0XG4gICAgcmV0dXJuIG5leHQoXG4gICAgICBuZXcgQXBwRXJyb3IoJ1VzZXIgcmVjZW50bHkgY2hhbmdlZCBwYXNzd29yZDsgcGxlYXNlIGxvZyBpbiBhZ2FpbicsIDQwMSlcbiAgICApO1xuICAgIC8vIEdSQU5UIEFDQ0VTUyBUTyBQUk9URUNURUQgUk9VVEVcbiAgfVxuXG4gIHJlcS51c2VyID0gY3VycmVudFVzZXI7IC8vIHZlcnkgaW1wb3J0YW50IGZvciBuZXh0IHN0ZXAgdG8gd29yaywgb3RoZXJ3aXNlIG5vIGFjY2VzcyB0byByb2xlXG4gIHJlcy5sb2NhbHMudXNlciA9IGN1cnJlbnRVc2VyO1xuICBuZXh0KCk7XG59KTtcblxuZXhwb3J0cy5yZXN0cmljdCA9ICgpID0+IHtcbiAgcmV0dXJuIChyZXEsIF9yZXMsIG5leHQpID0+IHtcbiAgICBpZiAoIXJlcS51c2VyLmlzQWRtaW4pIHtcbiAgICAgIHJldHVybiBuZXh0KFxuICAgICAgICBuZXcgQXBwRXJyb3IoJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIHBlcmZvcm0gdGhpcyBhY3Rpb24uJywgNDAzKVxuICAgICAgKTsgLy8gNDAzID09PSBmb3JiaWRkZW5cbiAgICB9XG4gICAgbmV4dCgpO1xuICB9O1xufTtcblxuZXhwb3J0cy51cGRhdGVQYXNzd29yZCA9IGNhdGNoQXN5bmMoYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIC8vIDEpIGdldCB1c2VyIGZyb20gY29sbGVjdGlvblxuICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kQnlJZChyZXEudXNlci5pZCkuc2VsZWN0KCcrcGFzc3dvcmQnKTtcbiAgLy8gMikgY2hlY2sgaWYgUE9TVGVkIHBhc3N3b3JkIGlzIGNvcnJlY3RcbiAgaWYgKCEoYXdhaXQgdXNlci5jb3JyZWN0UGFzc3dvcmQocmVxLmJvZHkucGFzc3dvcmRDdXJyZW50LCB1c2VyLnBhc3N3b3JkKSkpIHtcbiAgICByZXR1cm4gbmV4dChuZXcgQXBwRXJyb3IoJ1lvdXIgY3VycmVudCBwYXNzd29yZCBpcyB3cm9uZy4nLCA0MDEpKTtcbiAgfVxuICAvLyAzKSBJZiBzbywgdXBkYXRlIHBhc3N3b3JkXG4gIHVzZXIucGFzc3dvcmQgPSByZXEuYm9keS5wYXNzd29yZDtcbiAgdXNlci5wYXNzd29yZENvbmZpcm0gPSByZXEuYm9keS5wYXNzd29yZENvbmZpcm07XG4gIGF3YWl0IHVzZXIuc2F2ZSgpO1xuICAvL1VzZXIuZmluZEJ5SWRBbmRVcGRhdGUgd2lsbCBOT1Qgd29yayBhcyBpbnRlbmRlZCFcblxuICAvLyA0KSBMb2cgdXNlciBpbjsgc2VuZCBKV1QgdG8gdXNlclxuICBjcmVhdGVTZW5kVG9rZW4odXNlciwgMjAwLCByZXMpO1xufSk7XG4iLCIvLyBMRUNUVVJFIDE2MFxuaW1wb3J0IGNhdGNoQXN5bmMgZnJvbSAnLi8uLi91dGlscy9jYXRjaEFzeW5jJztcbmNvbnN0IEFwcEVycm9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYXBwRXJyb3InKTtcbmNvbnN0IEFQSUZlYXR1cmVzID0gcmVxdWlyZSgnLi8uLi91dGlscy9hcGlGZWF0dXJlcycpO1xuXG5leHBvcnRzLmRlbGV0ZU9uZSA9IChNb2RlbCkgPT5cbiAgY2F0Y2hBc3luYyhhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICBjb25zdCBkb2MgPSBhd2FpdCBNb2RlbC5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcbiAgICAvLyAyMDQgaXMgbm8gY29udGVudCAtIHdlIGRvbid0IHNlbmQgZGF0YSBiYWNrLCB3ZSBqdXN0IHNlbmQgJ251bGwnIC0gdG8gc2hvdyB0aGF0IHRoZSByZXNvdXJjZSB3ZSBkZWxldGVkIG5vIGxvbmdlciBleGlzdHNcbiAgICBpZiAoIWRvYykge1xuICAgICAgcmV0dXJuIG5leHQobmV3IEFwcEVycm9yKCdObyBkb2N1bWVudCBmb3VuZCB3aXRoIHRoYXQgSUQnLCA0MDQpKTtcbiAgICB9XG4gICAgcmVzLnN0YXR1cygyMDQpLmpzb24oe1xuICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gIH0pO1xuXG5leHBvcnRzLnVwZGF0ZU9uZSA9IChNb2RlbCkgPT5cbiAgY2F0Y2hBc3luYyhhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICBjb25zdCBkb2MgPSBhd2FpdCBNb2RlbC5maW5kQnlJZEFuZFVwZGF0ZShyZXEucGFyYW1zLmlkLCByZXEuYm9keSwge1xuICAgICAgLy8gIHNldHRpbmcgbmV3IHRvICd0cnVlJyB3aWxsIHdpbGwgcmV0dXJuIHRoZSBkb2N1bWVudCBhZnRlciB0aGUgdXBkYXRlIGlzIGNvbXBsZXRlXG4gICAgICBuZXc6IHRydWUsXG4gICAgICBydW5WYWxpZGF0b3JzOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKCFkb2MpIHtcbiAgICAgIHJldHVybiBuZXh0KG5ldyBBcHBFcnJvcignTm8gZG9jdW1lbnQgZm91bmQgd2l0aCB0aGF0IElEJywgNDA0KSk7XG4gICAgfVxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgZGF0YToge1xuICAgICAgICBkYXRhOiBkb2NcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbmV4cG9ydHMuY3JlYXRlT25lID0gKE1vZGVsKSA9PlxuICBjYXRjaEFzeW5jKGFzeW5jIChyZXEsIHJlcywgX25leHQpID0+IHtcbiAgICBjb25zdCBkb2MgPSBhd2FpdCBNb2RlbC5jcmVhdGUocmVxLmJvZHkpO1xuICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgZGF0YToge1xuICAgICAgICBkYXRhOiBwYXJzZUludChkb2MpXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG5leHBvcnRzLmdldE9uZSA9IChNb2RlbCwgcG9wT3B0aW9ucykgPT5cbiAgY2F0Y2hBc3luYyhhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICBsZXQgcXVlcnkgPSBNb2RlbC5maW5kQnlJZChyZXEucGFyYW1zLmlkKTtcbiAgICBpZiAocG9wT3B0aW9ucykgcXVlcnkgPSBxdWVyeS5wb3B1bGF0ZShwb3BPcHRpb25zKTtcbiAgICBjb25zdCBkb2MgPSBhd2FpdCBxdWVyeTtcblxuICAgIGlmICghZG9jKSB7XG4gICAgICByZXR1cm4gbmV4dChuZXcgQXBwRXJyb3IoJ05vIGRvY3VtZW50IGZvdW5kIHdpdGggdGhhdCBJRCcsIDQwNCkpO1xuICAgIH1cblxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgZGF0YToge1xuICAgICAgICBkYXRhOiBkb2NcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbmV4cG9ydHMuZ2V0QWxsID0gKE1vZGVsKSA9PlxuICBjYXRjaEFzeW5jKGFzeW5jIChyZXEsIHJlcywgX25leHQpID0+IHtcbiAgICAvLyBUbyBhbGxvdyBmb3IgbmVzdGVkIEdFVCByZXZpZXdzIG9uIHRvdXJcbiAgICBsZXQgZmlsdGVyID0ge307XG5cbiAgICBpZiAocmVxLnBhcmFtcy50b3VySWQpIGZpbHRlciA9IHsgdG91cjogcmVxLnBhcmFtcy50b3VySWQgfTsgLy8gaWYgdGhlcmUncyBhIHRvdXJJZCwgdGhlbiB0aGUgb2JqZWN0ICdmaWx0ZXInIHdpbGwgZ28gaW50byBSZXZpZXcuZmluZChmaWx0ZXIpIGJlbG93IChsZWN0dXJlIDE1OSkgc28gb25seSB0aGUgcmV2aWV3cyB3aGVyZSB0aGUgdG91ciBtYXRjaGVzIHRoZSBpZCBhcmUgZ29pbmcgdG8gYmUgZm91bmQ7XG5cbiAgICBjb25zdCBmZWF0dXJlcyA9IG5ldyBBUElGZWF0dXJlcyhNb2RlbC5maW5kKGZpbHRlciksIHJlcS5xdWVyeSlcbiAgICAgIC5maWx0ZXIoKVxuICAgICAgLnNvcnQoKVxuICAgICAgLmxpbWl0RmllbGRzKClcbiAgICAgIC5wYWdpbmF0ZSgpO1xuICAgIC8vIGNvbnN0IGRvYyA9IGF3YWl0IGZlYXR1cmVzLnF1ZXJ5LmV4cGxhaW4oKTsgLy8gZ2VuZXJhdGUgc3RhdGlzdGljcyBpbiByZXNwb25zZXNcblxuICAgIGNvbnN0IGRvYyA9IGF3YWl0IGZlYXR1cmVzLnF1ZXJ5O1xuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgcmVzdWx0czogZG9jLmxlbmd0aCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZGF0YTogZG9jXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuIiwiY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vLi4vbW9kZWxzL1VzZXInKTtcbmltcG9ydCBjYXRjaEFzeW5jIGZyb20gJy4vLi4vdXRpbHMvY2F0Y2hBc3luYyc7XG5pbXBvcnQgQXBwRXJyb3IgZnJvbSAnLi4vdXRpbHMvYXBwRXJyb3InO1xuY29uc3QgZmFjdG9yeSA9IHJlcXVpcmUoJy4vaGFuZGxlckZhY3RvcnknKTtcblxuY29uc3QgZmlsdGVyT2JqID0gKG9iajogeyBbeDogc3RyaW5nXTogYW55IH0sIC4uLmFsbG93ZWRGaWVsZHM6IHN0cmluZ1tdKSA9PiB7XG4gIGNvbnN0IG5ld09iaiA9IHt9O1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goKGVsKSA9PiB7XG4gICAgaWYgKGFsbG93ZWRGaWVsZHMuaW5jbHVkZXMoZWwpKSBuZXdPYmpbZWxdID0gb2JqW2VsXTtcbiAgfSk7XG4gIHJldHVybiBuZXdPYmo7XG59O1xuLypcbmV4cG9ydHMuZ2V0QWxsVXNlcnMgPSBjYXRjaEFzeW5jKGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICBjb25zdCB1c2VycyA9IGF3YWl0IFVzZXIuZmluZCgpO1xuXG4gIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICByZXN1bHRzOiB1c2Vycy5sZW5ndGgsXG4gICAgZGF0YToge1xuICAgICAgdXNlcnMsXG4gICAgfSxcbiAgfSk7XG59KTtcbiovXG5cbmV4cG9ydHMuZ2V0TWUgPSAoXG4gIHJlcTogeyBwYXJhbXM6IHsgaWQ6IGFueSB9OyB1c2VyOiB7IGlkOiBhbnkgfSB9LFxuICBfcmVzOiBhbnksXG4gIG5leHQ6ICgpID0+IHZvaWRcbikgPT4ge1xuICByZXEucGFyYW1zLmlkID0gcmVxLnVzZXIuaWQ7XG4gIG5leHQoKTtcbn07XG5cbmV4cG9ydHMudXBkYXRlTWUgPSBjYXRjaEFzeW5jKFxuICBhc3luYyAoXG4gICAgcmVxOiB7IGJvZHk6IHsgcGFzc3dvcmQ6IGFueTsgcGFzc3dvcmRDb25maXJtOiBhbnkgfTsgdXNlcjogeyBpZDogYW55IH0gfSxcbiAgICByZXM6IHtcbiAgICAgIHN0YXR1czogKGFyZzA6IG51bWJlcikgPT4ge1xuICAgICAgICAoKTogYW55O1xuICAgICAgICBuZXcgKCk6IGFueTtcbiAgICAgICAganNvbjoge1xuICAgICAgICAgIChhcmcwOiB7IHN0YXR1czogc3RyaW5nOyBkYXRhOiB7IHVzZXI6IGFueSB9IH0pOiB2b2lkO1xuICAgICAgICAgIG5ldyAoKTogYW55O1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9LFxuICAgIG5leHQ6IChhcmcwOiBhbnkpID0+IGFueVxuICApID0+IHtcbiAgICAvLyAxKSBjcmVhdGUgZXJyb3IgaWYgdXNlciBQT1NUcyBwYXNzd29yZCBkYXRhXG4gICAgaWYgKHJlcS5ib2R5LnBhc3N3b3JkIHx8IHJlcS5ib2R5LnBhc3N3b3JkQ29uZmlybSkge1xuICAgICAgcmV0dXJuIG5leHQoXG4gICAgICAgIG5ldyBBcHBFcnJvcihcbiAgICAgICAgICAnVGhpcyByb3V0ZSBpcyBub3QgZm9yIHBhc3N3b3JkIHVwZGF0ZXM7IHBsZWFzZSB1c2UgL3VwZGF0ZU15UGFzd29yZCcsXG4gICAgICAgICAgNDAwXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIDIpIHVwZGF0ZSB1c2VyIGRvYyBpZiBub3RcbiAgICAvKiBOb3cgd2h5IGFtIEkgcHV0dGluZyB4IGhlcmUsIGFuZCBub3Qgc2ltcGx5IHJlcXVlc3QuYm9keT8gV2VsbCB0aGF0J3MgYmVjYXVzZSB3ZSBhY3R1YWxseSBkbyBub3Qgd2FudCB0byB1cGRhdGUgZXZlcnl0aGluZyB0aGF0J3MgaW4gdGhlIGJvZHksIGJlY2F1c2UgbGV0J3Mgc2F5IHRoZSB1c2VyIHB1dHMsIGluIHRoZSBib2R5LCB0aGUgcm9sZSBmb3IgZXhhbXBsZS4gV2UgY291bGQgaGF2ZSBib2R5LnJvbGUgc2V0IHRvIGFkbWluIGZvciBleGFtcGxlLCBhbmQgc28gdGhpcyB3b3VsZCB0aGVuIGFsbG93IGFueSB1c2VyIHRvIGNoYW5nZSB0aGUgcm9sZSwgZm9yIGV4YW1wbGUsIHRvIGFkbWluaXN0cmF0b3IuIEFuZCBvZiBjb3Vyc2UgdGhhdCBjYW4gbm90IGJlIGFsbG93ZWQuIE9yIHRoZSB1c2VyIGNvdWxkIGFsc28gY2hhbmdlIHRoZWlyIHJlc2V0IHRva2VuLCBvciB3aGVuIHRoYXQgcmVzZXQgdG9rZW4gZXhwaXJlcywgYW5kIGFsbCBvZiB0aGF0IHNob3VsZCBub3QgYmUgYWxsb3dlZCBvZiBjb3Vyc2UuIFNvIGRvaW5nIHNvbWV0aGluZyBsaWtlIHRoaXMgd291bGQgb2YgY291cnNlIGJlIGEgaHVnZSBtaXN0YWtlLiBBbmQgc28gd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhhdCB0aGUgb2JqZWN0IHRoYXQgd2UgcGFzcyBoZXJlLCBzbyBhZ2FpbiB0aGF0IG9iamVjdCB0aGF0IHdpbGwgY29udGFpbiB0aGUgZGF0YSB0aGF0J3MgZ29ubmEgYmUgdXBkYXRlZCwgb25seSBjb250YWlucyBuYW1lIGFuZCBlbWFpbCwgYmVjYXVzZSBmb3Igbm93IHRoZXNlIGFyZSB0aGUgb25seSBmaWVsZHMgdGhhdCB3ZSB3YW50IHRvIGFsbG93IHRvIHVwZGF0ZS4gQW5kIHNvIGJhc2ljYWxseSB3ZSB3YW50IHRvIGZpbHRlciB0aGUgYm9keSBzbyB0aGF0IGluIHRoZSBlbmQsIGl0IG9ubHkgY29udGFpbnMgbmFtZSBhbmQgZW1haWwgYW5kIG5vdGhpbmcgZWxzZS4gU28gaWYgdGhlbiB0aGUgdXNlciB0cmllcyB0byBjaGFuZ2UgdGhlIHJvbGUsIHRoYXQgd2lsbCB0aGVuIGJlIGZpbHRlcmVkIG91dCBzbyB0aGF0IGl0IG5ldmVyIGZpbmRzIGl0cyB3YXkgdG8gb3VyIGRhdGFiYXNlLiBsZWN0dXJlIDEzOCovXG4gICAgLy8gZmlsdGVyZWQgb3V0IHVud2FudGVkIGZpZWxkIG5hbWVzIHRoYXQgYXJlIG5vdyBhbGxvd2VkIHRvIGJlIHVwZGF0ZWRcbiAgICBjb25zdCBmaWx0ZXJlZEJvZHkgPSBmaWx0ZXJPYmoocmVxLmJvZHksICdlbWFpbCcsICdyb2xlJyk7XG4gICAgY29uc3QgdXBkYXRlZFVzZXIgPSBhd2FpdCBVc2VyLmZpbmRCeUlkQW5kVXBkYXRlKFxuICAgICAgcmVxLnVzZXIuaWQsXG4gICAgICBmaWx0ZXJlZEJvZHksXG4gICAgICB7XG4gICAgICAgIG5ldzogdHJ1ZSxcbiAgICAgICAgcnVuVmFsaWRhdG9yczogdHJ1ZVxuICAgICAgfVxuICAgICk7IC8vIHdlIGNhbiB1c2UgQW5kVXBkYXRlIGIvYyBub3QgdXNpbmcgcGFzc3dvcmRcblxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgZGF0YToge1xuICAgICAgICB1c2VyOiB1cGRhdGVkVXNlclxuICAgICAgfVxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnRzLmRlbGV0ZU1lID0gY2F0Y2hBc3luYyhcbiAgYXN5bmMgKFxuICAgIHJlcTogeyB1c2VyOiB7IGlkOiBhbnkgfSB9LFxuICAgIHJlczoge1xuICAgICAgc3RhdHVzOiAoYXJnMDogbnVtYmVyKSA9PiB7XG4gICAgICAgICgpOiBhbnk7XG4gICAgICAgIG5ldyAoKTogYW55O1xuICAgICAgICBqc29uOiB7IChhcmcwOiB7IHN0YXR1czogc3RyaW5nOyBkYXRhOiBudWxsIH0pOiB2b2lkOyBuZXcgKCk6IGFueSB9O1xuICAgICAgfTtcbiAgICB9LFxuICAgIF9uZXh0OiBhbnlcbiAgKSA9PiB7XG4gICAgYXdhaXQgVXNlci5maW5kQnlJZEFuZFVwZGF0ZShyZXEudXNlci5pZCwgeyBhY3RpdmU6IGZhbHNlIH0pO1xuICAgIHJlcy5zdGF0dXMoMjA0KS5qc29uKHtcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgZGF0YTogbnVsbFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnRzLmdldFVzZXIgPSBjYXRjaEFzeW5jKFxuICBhc3luYyAoXG4gICAgcmVxOiB7IHVzZXI6IHsgaWQ6IGFueSB9IH0sXG4gICAgcmVzOiB7XG4gICAgICBqc29uOiAoYXJnMDogYW55KSA9PiB2b2lkO1xuICAgICAgc3RhdHVzOiAoYXJnMDogbnVtYmVyKSA9PiB7XG4gICAgICAgICgpOiBhbnk7XG4gICAgICAgIG5ldyAoKTogYW55O1xuICAgICAgICBzZW5kOiB7IChhcmcwOiBzdHJpbmcpOiB2b2lkOyBuZXcgKCk6IGFueSB9O1xuICAgICAgfTtcbiAgICB9LFxuICAgIF9uZXh0OiBhbnlcbiAgKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmRCeUlkKHJlcS51c2VyLmlkKS5wb3B1bGF0ZSgndGltZXInLCAnX2lkJyk7XG4gICAgICByZXMuanNvbih1c2VyKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKCdTZXJ2ZXIgRXJyb3InKTtcbiAgICB9XG4gIH1cbik7XG5cbmV4cG9ydHMuY3JlYXRlVXNlciA9IGNhdGNoQXN5bmMoXG4gIGFzeW5jIChcbiAgICByZXE6IHsgYm9keTogYW55IH0sXG4gICAgcmVzOiB7XG4gICAgICBzdGF0dXM6IChhcmcwOiBudW1iZXIpID0+IHtcbiAgICAgICAgKCk6IGFueTtcbiAgICAgICAgbmV3ICgpOiBhbnk7XG4gICAgICAgIGpzb246IHtcbiAgICAgICAgICAoYXJnMDogeyBzdGF0dXM6IHN0cmluZzsgZGF0YTogeyBkYXRhOiBudW1iZXIgfSB9KTogdm9pZDtcbiAgICAgICAgICBuZXcgKCk6IGFueTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBfbmV4dDogYW55XG4gICkgPT4ge1xuICAgIGNvbnN0IGRvYyA9IGF3YWl0IFVzZXIuY3JlYXRlKHJlcS5ib2R5KTtcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbih7XG4gICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZGF0YTogcGFyc2VJbnQoZG9jKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnRzLmRlbGV0ZVVzZXIgPSAoXG4gIF9yZXE6IGFueSxcbiAgcmVzOiB7XG4gICAgc3RhdHVzOiAoYXJnMDogbnVtYmVyKSA9PiB7XG4gICAgICAoKTogYW55O1xuICAgICAgbmV3ICgpOiBhbnk7XG4gICAgICBqc29uOiB7IChhcmcwOiB7IHN0YXR1czogc3RyaW5nOyBtZXNzYWdlOiBzdHJpbmcgfSk6IHZvaWQ7IG5ldyAoKTogYW55IH07XG4gICAgfTtcbiAgfVxuKSA9PiB7XG4gIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgbWVzc2FnZTogJ1RoaXMgcm91dGUgaXMgbm90IHlldCBkZWZpbmVkISdcbiAgfSk7XG59O1xuXG4vLyBkbyBOT1QgdXBkYXRlIHBhc3N3b3JkcyB3aXRoIHRoaXMhXG4vLyBleHBvcnRzLmNyZWF0ZVVzZXIgPSBmYWN0b3J5LmNyZWF0ZU9uZShVc2VyKTtcbmV4cG9ydHMudXBkYXRlVXNlciA9IGZhY3RvcnkudXBkYXRlT25lKFVzZXIpO1xuZXhwb3J0cy5kZWxldGVVc2VyID0gZmFjdG9yeS5kZWxldGVPbmUoVXNlcik7XG5leHBvcnRzLmdldEFsbFVzZXJzID0gZmFjdG9yeS5nZXRBbGwoVXNlcik7XG4iLCJleHBvcnRzLmNvbnZlcnRNc1RvU2VjID0gKG1zOiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICByZXR1cm4gTWF0aC5mbG9vcihtcyAvIDEwMDApO1xufTtcbiIsImV4cG9ydHMuZ2V0Q3VycmVudFRpbWVJbk1zID0gKCk6IG51bWJlciA9PiB7XG4gIHJldHVybiBuZXcgRGF0ZShEYXRlLm5vdygpKS5nZXRUaW1lKCk7XG59O1xuIiwiZXhwb3J0cy5pc0NvbW1hbmQgPSAobWVzc2FnZTogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gIGNvbnN0IHJlZ2V4cENvbW1hbmQgPSBuZXcgUmVnRXhwKC9eIShbYS16QS1aMC05XSspKD86XFxXKyk/KC4qKT8vKTtcbiAgcmV0dXJuIHJlZ2V4cENvbW1hbmQudGVzdChtZXNzYWdlKTtcbn07XG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuXG5pbnRlcmZhY2UgSUNvbW1hbmQge1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmNvbnN0IGNvbW1hbmQgPSBuZXcgbW9uZ29vc2UuU2NoZW1hPElDb21tYW5kPih7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgdW5pcXVlOiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBDb21tYW5kID0gbW9uZ29vc2UubW9kZWw8SUNvbW1hbmQ+KCdDb21tYW5kJywgY29tbWFuZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbWFuZDtcbiIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmludGVyZmFjZSBJQ29vbGRvd24ge1xuICB1c2VybmFtZTogc3RyaW5nO1xuICBjb21tYW5kOiBzdHJpbmc7XG4gIHN0YXJ0VGltZTogbnVtYmVyO1xufVxuXG5jb25zdCBjb29sZG93biA9IG5ldyBtb25nb29zZS5TY2hlbWE8SUNvb2xkb3duPih7XG4gIHVzZXJuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIHNwYXJzZTogZmFsc2VcbiAgfSxcbiAgY29tbWFuZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZVxuICB9LFxuICBzdGFydFRpbWU6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgcmVxdWlyZWQ6IHRydWVcbiAgfVxufSk7XG5cbmNvbnN0IENvb2xkb3duID0gbW9uZ29vc2UubW9kZWw8SUNvb2xkb3duPignQ29vbGRvd24nLCBjb29sZG93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29vbGRvd247XG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuXG5pbnRlcmZhY2UgSVF1b3RlIHtcbiAgaWQ6IG51bWJlcjtcbiAgdGV4dDogc3RyaW5nO1xufVxuY29uc3QgcXVvdGUgPSBuZXcgbW9uZ29vc2UuU2NoZW1hPElRdW90ZT4oe1xuICBpZDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB1bmlxdWU6IHRydWVcbiAgfSxcbiAgdGV4dDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB1bmlxdWU6IHRydWVcbiAgfVxufSk7XG5cbmNvbnN0IFF1b3RlID0gbW9uZ29vc2UubW9kZWw8SVF1b3RlPignUXVvdGUnLCBxdW90ZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUXVvdGU7XG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuXG5pbnRlcmZhY2UgSVVzZXIge1xuICB1c2VybmFtZTogc3RyaW5nO1xuICB2YWx1ZXM6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5NaXhlZDtcbiAgc3RyaW5nczogeyBpZDogbnVtYmVyOyB0ZXh0OiBzdHJpbmcgfVtdO1xuICBhY2Nlc3M6IHN0cmluZztcbiAgcm9sZXM6IHN0cmluZ1tdO1xufVxuXG5jb25zdCB1c2VyID0gbmV3IG1vbmdvb3NlLlNjaGVtYTxJVXNlcj4oe1xuICB1c2VybmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB1bmlxdWU6IHRydWVcbiAgfSxcbiAgdmFsdWVzOiB7XG4gICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk1peGVkLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGZhdFlvc2hpV2VpZ2h0Q29udHJpYnV0ZWQ6IDBcbiAgICB9XG4gIH0sXG4gIHN0cmluZ3M6IFtcbiAgICB7XG4gICAgICBpZDogTnVtYmVyLFxuICAgICAgdGV4dDogU3RyaW5nXG4gICAgfVxuICBdLFxuICBhY2Nlc3M6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgZGVmYXVsdDogJ3VzZXInXG4gIH0sXG4gIHJvbGVzOiBbU3RyaW5nXVxufSk7XG5cbmNvbnN0IFVzZXIgPSBtb25nb29zZS5tb2RlbDxJVXNlcj4oJ1VzZXInLCB1c2VyKTtcbmV4cG9ydCBkZWZhdWx0IFVzZXI7XG4iLCJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuXG5pbnRlcmZhY2UgSVZhbHVlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBudW06IG51bWJlcjtcbn1cblxuY29uc3QgdmFsdWUgPSBuZXcgbW9uZ29vc2UuU2NoZW1hPElWYWx1ZT4oe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIHVuaXF1ZTogdHJ1ZVxuICB9LFxuICBudW06IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgZGVmYXVsdDogMFxuICB9XG59KTtcblxuY29uc3QgVmFsdWUgPSBtb25nb29zZS5tb2RlbDxJVmFsdWU+KCdWYWx1ZScsIHZhbHVlKTtcblxuZXhwb3J0IGRlZmF1bHQgVmFsdWU7XG4iLCJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuY29uc3QgdXNlckNvbnRyb2xsZXIgPSByZXF1aXJlKCcuLy4uL2NvbnRyb2xsZXJzL3VzZXJDb250cm9sbGVyJyk7XG5jb25zdCBhdXRoQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vLi4vY29udHJvbGxlcnMvYXV0aENvbnRyb2xsZXInKTtcblxuZXhwb3J0IGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbnJvdXRlclxuICAucm91dGUoJy9jcmVhdGVVc2VyJylcbiAgLnBvc3QoLyphdXRoQ29udHJvbGxlci5wcm90ZWN0LCovIHVzZXJDb250cm9sbGVyLmNyZWF0ZVVzZXIpO1xucm91dGVyLnJvdXRlKCcvZ2V0QWxsVXNlcnMnKS5nZXQodXNlckNvbnRyb2xsZXIuZ2V0QWxsVXNlcnMpO1xubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7XG4iLCJjb25zdCBkb3RlbnYgPSByZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcbmNvbnN0IG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKTtcbmltcG9ydCB0bWlDbGllbnQgZnJvbSAnLi9ib3QvdG1pQ2xpZW50JztcbmNvbnN0IHsgY29tbWFuZEhhbmRsZXIsIHJlZGVtcHRpb25IYW5kbGVyIH0gPSByZXF1aXJlKCcuL2JvdC9oYW5kbGVycycpO1xuY29uc3QgVmFsdWUgPSByZXF1aXJlKCcuL21vZGVscy9WYWx1ZScpO1xuY29uc3QgYXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcblxubW9uZ29vc2VcbiAgLmNvbm5lY3QocHJvY2Vzcy5lbnYuTU9OR09fVVJJLCB7XG4gICAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlXG4gIH0pXG4gIC50aGVuKChfY29uKSA9PiBjb25zb2xlLmxvZygnRGF0YWJhc2UgY29ubmVjdGlvbiBzdWNjZXNzZnVsLicpKTtcblxudG1pQ2xpZW50LmNvbm5lY3QoKTtcblxudG1pQ2xpZW50Lm9uKCdtZXNzYWdlJywgY29tbWFuZEhhbmRsZXIpO1xudG1pQ2xpZW50Lm9uKCdyZWRlZW0nLCByZWRlbXB0aW9uSGFuZGxlcik7XG5wcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIChlcnIpID0+IHtcbiAgY29uc29sZS5sb2coZXJyKTtcbiAgcHJvY2Vzcy5leGl0KDEpOyAvLyBjb2RlIDAgPSBzdWNjZXNzOyBjb2RlIDEgPSB1bmNhdWdodCBleGNlcHRpb25cbn0pO1xuXG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCA4MDAwO1xuY29uc3Qgc2VydmVyID0gYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7fSk7XG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAoX2VycikgPT4ge1xuICBzZXJ2ZXIuY2xvc2UoKCkgPT4ge1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfSk7XG59KTtcblxucHJvY2Vzcy5vbignU0lHVEVSTScsICgpID0+IHtcbiAgc2VydmVyLmNsb3NlKCgpID0+IHt9KTtcbn0pO1xuIiwiY2xhc3MgQVBJRmVhdHVyZXMge1xuICBxdWVyeTogYW55O1xuICBxdWVyeVN0cmluZzogYW55O1xuICBjb25zdHJ1Y3RvcihxdWVyeSwgcXVlcnlTdHJpbmcpIHtcbiAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgdGhpcy5xdWVyeVN0cmluZyA9IHF1ZXJ5U3RyaW5nO1xuICB9XG5cbiAgZmlsdGVyKCkge1xuICAgIGNvbnN0IHF1ZXJ5T2JqID0geyAuLi50aGlzLnF1ZXJ5U3RyaW5nIH07XG4gICAgY29uc3QgZXhjbHVkZWRGaWVsZHMgPSBbJ3BhZ2UnLCAnc29ydCcsICdsaW1pdCcsICdmaWVsZHMnXTtcbiAgICBleGNsdWRlZEZpZWxkcy5mb3JFYWNoKChlbCkgPT4gZGVsZXRlIHF1ZXJ5T2JqW2VsXSk7XG5cbiAgICBsZXQgcXVlcnlTdHIgPSBKU09OLnN0cmluZ2lmeShxdWVyeU9iaik7XG4gICAgcXVlcnlTdHIgPSBxdWVyeVN0ci5yZXBsYWNlKC9cXGIoZ3RlfGd0fGx0ZXxsdClcXGIvZywgKG1hdGNoKSA9PiBgJCR7bWF0Y2h9YCk7XG5cbiAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5xdWVyeS5maW5kKEpTT04ucGFyc2UocXVlcnlTdHIpKTtcbiAgICAvLyByZXR1cm4gZW50aXJlIG9iamVjdFxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNvcnQoKSB7XG4gICAgaWYgKHRoaXMucXVlcnlTdHJpbmcuc29ydCkge1xuICAgICAgY29uc3Qgc29ydEJ5ID0gdGhpcy5xdWVyeVN0cmluZy5zb3J0LnNwbGl0KCcsJykuam9pbignICcpO1xuICAgICAgdGhpcy5xdWVyeSA9IHRoaXMucXVlcnkuc29ydChzb3J0QnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5xdWVyeS5zb3J0KCctY3JlYXRlZEF0Jyk7XG4gICAgfVxuICAgIC8vIHJldHVybiBlbnRpcmUgb2JqZWN0XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgbGltaXRGaWVsZHMoKSB7XG4gICAgaWYgKHRoaXMucXVlcnlTdHJpbmcuZmllbGRzKSB7XG4gICAgICBjb25zdCBmaWVsZHMgPSB0aGlzLnF1ZXJ5U3RyaW5nLmZpZWxkcy5zcGxpdCgnLCcpLmpvaW4oJyAnKTtcbiAgICAgIHRoaXMucXVlcnkgPSB0aGlzLnF1ZXJ5LnNlbGVjdChmaWVsZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5xdWVyeS5zZWxlY3QoJy1fX3YnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgcGFnaW5hdGUoKSB7XG4gICAgY29uc3QgcGFnZSA9IHRoaXMucXVlcnlTdHJpbmcucGFnZSAqIDEgfHwgMTtcbiAgICBjb25zdCBsaW1pdCA9IHRoaXMucXVlcnlTdHJpbmcubGltaXQgKiAxIHx8IDEwMDtcbiAgICBjb25zdCBza2lwID0gKHBhZ2UgLSAxKSAqIGxpbWl0O1xuXG4gICAgdGhpcy5xdWVyeSA9IHRoaXMucXVlcnkuc2tpcChza2lwKS5saW1pdChsaW1pdCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBBUElGZWF0dXJlcztcbiIsImNsYXNzIEFwcEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBzdGF0dXNDb2RlOiBudW1iZXI7XG4gIHN0YXR1czogc3RyaW5nO1xuICBpc09wZXJhdGlvbmFsOiBib29sZWFuO1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBzdGF0dXNDb2RlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7IC8vIGNhbGxpbmcgY29uc3RydWN0b3Igb2YgcGFyZW50IGNsYXNzXG5cbiAgICB0aGlzLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xuICAgIHRoaXMuc3RhdHVzID0gYCR7c3RhdHVzQ29kZX1gLnN0YXJ0c1dpdGgoJzQnKSA/ICdmYWlsJyA6ICdlcnJvcic7XG4gICAgdGhpcy5pc09wZXJhdGlvbmFsID0gdHJ1ZTsgLy8gYWxsIGVycm9ycyBnZXQgdGhpcyBwcm9wZXJ0eSBzZXQgdG8gdHJ1ZSA7IHdlIGNhbiB0aGVuIHRlc3QgZm9yIHRoaXMgcHJvcGVydHkgYW5kIG9ubHkgc2VuZCBiYWNrIGVycm9yIG1lc3NhZ2VzIHRvIHRoZSBjbGllbnQgZm9yIHRoZXNlIG9wZXJhdGlvbmFsIGVycm9ycyB0aGF0IHdlIGNyZWF0ZWQgdXNpbmcgdGhpcyBjbGFzc1xuXG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7IC8vIHdoZW4gYSBuZXcgb2JqZWN0IGlzIGNyZWF0ZWQsIGFuZCBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlbiB0aGF0IGZ1bmN0aW9uIGNhbGwgaXMgbm90IGdvbm5hIGFwcGVhciBpbiB0aHMgdGFhY2sgdHJhY2UgYW5kIHdpbGwgbm90IHBvcGxsdXRlIGl0XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwRXJyb3I7XG4iLCJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XG5jb25zdCBjYXRjaEFzeW5jID0gKGZuOiBGdW5jdGlvbik6IEZ1bmN0aW9uID0+IHtcbiAgcmV0dXJuIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIGZuKHJlcSwgcmVzLCBuZXh0KS5jYXRjaChuZXh0KTtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNhdGNoQXN5bmM7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb29raWUtcGFyc2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzcy1tb25nby1zYW5pdGl6ZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLXJhdGUtbGltaXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGVsbWV0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhwcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9yZ2FuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidG1pLmpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwieHNzLWNsZWFuXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9zZXJ2ZXIudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=