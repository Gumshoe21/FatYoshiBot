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
// An async fn. that returns a call of setInterval, which executes the provided callback fn. You provide the interval duration. This way we can await a setInterval call in our timerHandler fn. in bot/handlers.ts.
exports.setAsyncInterval = (cb, interval = 0) => __awaiter(void 0, void 0, void 0, function* () {
    setInterval(() => {
        cb();
    }, interval);
});
//# sourceMappingURL=setAsyncInterval.js.map