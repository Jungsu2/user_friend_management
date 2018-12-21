"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bluebird_1 = __importDefault(require("bluebird"));
var options = {
    promiseLib: bluebird_1.default
};
// pg
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:jk123@localhost:5432/js5';
var db = pgp(connectionString);
// Redis
//import Redis = require('ioredis');
//const redis = new Redis();
var Friend = /** @class */ (function () {
    function Friend(friend_id, friendname) {
        this.friend_id = friend_id;
        this.friendname = friendname;
    }
    Friend.getfollowinglist = function (user_id) {
        return db.any("select friend_id as id, friendname as name from friend_list where user_id = $1", user_id);
    };
    Friend.getfollowerlist = function (user_id) {
        return db.any("select user_id as id, username as name from friend_list where friend_id = $1", user_id);
    };
    Friend.followuser = function (user_id, friend_id) {
        return __awaiter(this, void 0, bluebird_1.default, function () {
            var user, message, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.one("with row as (insert into friendlist(user_id, friend_id) values($1, $2) returning friend_id as id) \n            select username from users where user_id = (select id from row)", [user_id, friend_id])];
                    case 1:
                        user = _a.sent();
                        message = user.username + " added in your friend list.";
                        return [2 /*return*/, message];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, 'Already in your friend list'];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Friend.unfollowuser = function (user_id, friend_id) {
        return __awaiter(this, void 0, bluebird_1.default, function () {
            var user, message, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.one("with row as (delete from friendlist where user_id = $1 and friend_id = $2 returning friend_id as id)\n        select username from users where user_id = (select id from row)", [user_id, friend_id])];
                    case 1:
                        user = _a.sent();
                        message = user.username + " deleted from your friend list.";
                        return [2 /*return*/, message];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, "user id " + user_id + " is not in your friend list"];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Friend;
}());
exports.default = Friend;
