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
var Redis = require("ioredis");
var redis = new Redis();
var User = /** @class */ (function () {
    function User(user_id, user_name, dataentered) {
        this.user_id = user_id;
        this.username = user_name;
        this.dateentered = dataentered;
    }
    User.getusers = function () {
        return __awaiter(this, void 0, bluebird_1.default, function () {
            // async function updateRedisZ() {
            //     let pipeline = redis.pipeline();
            //     let users: User[] = await db.any(`select * from users`);
            //     users.map((user: User) => {
            //         pipeline.zadd(`users`, user.dateentered, user.user_id);
            //     });
            //     pipeline.exec();
            //     return users;
            // }
            function checkRedis() {
                return __awaiter(this, void 0, void 0, function () {
                    var flag;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, redis.exists('users')];
                            case 1:
                                flag = _a.sent();
                                if (flag == 1) {
                                    console.log('from Redis');
                                    return [2 /*return*/, getUsersInRedis()];
                                }
                                else {
                                    console.log('Redis updated');
                                    return [2 /*return*/, updateRedis()];
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            }
            function getUsersInRedis() {
                var pipeline = redis.pipeline();
                var stream = redis.scanStream({
                    match: 'user:*',
                    count: 100
                });
                return new bluebird_1.default(function (resolve, reject) {
                    stream.on('data', function (resultKeys) {
                        resultKeys.map(function (val) {
                            pipeline.hgetall(val);
                        });
                    });
                    stream.on('end', function () {
                        pipeline.exec().then(function (result) {
                            var userList = result.map(function (user) { return user[1]; });
                            resolve(userList);
                        });
                    });
                    stream.on('error', reject);
                });
            }
            function updateRedis() {
                return __awaiter(this, void 0, void 0, function () {
                    var pipeline, users;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pipeline = redis.pipeline();
                                return [4 /*yield*/, db.any('select * from users')];
                            case 1:
                                users = _a.sent();
                                bluebird_1.default.map(users, function (user, _index, _arr) {
                                    return pipeline.hmset('user:' + user.user_id, 'user_id', user.user_id, 'username', user.username, 'dateentered', user.dateentered)
                                        .exec();
                                }).catch(console.error);
                                return [2 /*return*/, users];
                        }
                    });
                });
            }
            return __generator(this, function (_a) {
                ;
                ;
                return [2 /*return*/, checkRedis()];
            });
        });
    };
    // Example 
    User.prototype.followUser = function (_user) {
        return __awaiter(this, void 0, bluebird_1.default, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    User.usernamesearch = function (username) {
        return db.any("select * from users where username ilike ('%' || $1 || '%')", username);
    };
    User.useridsearch = function (userid) {
        return __awaiter(this, void 0, bluebird_1.default, function () {
            var key, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = "user:" + userid;
                        return [4 /*yield*/, redis.exists(key)];
                    case 1:
                        user = _a.sent();
                        if (user == 1) {
                            return [2 /*return*/, redis.hgetall(key)];
                        }
                        else {
                            return [2 /*return*/, db.one("select * from users where user_id = $1", userid)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    User.usersinpage = function (pagenumber) {
        var usersinpageQuery = "select * from users\n          order by dateentered \n          offset (5 * ($1 - 1)) rows \n          fetch next 5 rows only";
        return db.any(usersinpageQuery, pagenumber);
    };
    User.usersinpagebyid = function (userid) {
        return __awaiter(this, void 0, bluebird_1.default, function () {
            function updateRedis() {
                return __awaiter(this, void 0, void 0, function () {
                    var pipeline, users;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pipeline = redis.pipeline();
                                return [4 /*yield*/, db.any('select * from users')];
                            case 1:
                                users = _a.sent();
                                users.map(function (e) {
                                    pipeline.zadd("users", e.dateentered, e.user_id);
                                });
                                return [4 /*yield*/, pipeline.exec()];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, console.log('Redis updated')];
                        }
                    });
                });
            }
            function fromRedis() {
                return __awaiter(this, void 0, void 0, function () {
                    var pipeline, userIndex, userIds;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pipeline = redis.pipeline();
                                return [4 /*yield*/, redis.zrank('users', userid)];
                            case 1:
                                userIndex = _a.sent();
                                return [4 /*yield*/, redis.zrange('users', userIndex + 1, userIndex + 5)];
                            case 2:
                                userIds = _a.sent();
                                userIds.map(function (val) {
                                    pipeline.hgetall("users:" + val);
                                });
                                return [2 /*return*/, pipeline.exec().then(function (data) {
                                        return data.map(function (e) { return e[1]; });
                                    })];
                        }
                    });
                });
            }
            function checkRedis() {
                return __awaiter(this, void 0, void 0, function () {
                    var flag;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, redis.exists('users')];
                            case 1:
                                flag = _a.sent();
                                if (!(flag == 1)) return [3 /*break*/, 2];
                                return [2 /*return*/, fromRedis()];
                            case 2: return [4 /*yield*/, updateRedis()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, fromRedis()];
                        }
                    });
                });
            }
            return __generator(this, function (_a) {
                return [2 /*return*/, checkRedis()];
            });
        });
    };
    User.createuser = function (username) {
        return __awaiter(this, void 0, bluebird_1.default, function () {
            var pipeline, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pipeline = redis.pipeline();
                        return [4 /*yield*/, db.one('insert into users(username) values ($1) returning *', username)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, pipeline.hmset("user:" + user.user_id, 'user_id', user.user_id, 'username', user.username, 'dateentered', user.dateentered)
                                .hgetall('user:' + user.user_id).exec().then(function (result) {
                                return result[1][1];
                            })];
                }
            });
        });
    };
    User.updateuser = function (userid, username) {
        return __awaiter(this, void 0, bluebird_1.default, function () {
            var pipeline, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pipeline = redis.pipeline();
                        return [4 /*yield*/, db.one("update users set username = " + username + " where user_id = " + userid + " returning *")];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, pipeline.hmset("user:" + user.user_id, 'username', user.username).hgetall('user:' + user.user_id).exec()
                                .then(function (result) {
                                return result[1][1];
                            })];
                }
            });
        });
    };
    return User;
}());
exports.default = User;
// const newUser1 = new User('1', 'user1', '0');
// const newUser2 = new User('2', 'user2', '1');
// newUser1.followUser(newUser2);
