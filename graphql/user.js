"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var promise = __importStar(require("bluebird"));
//import promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:jk123@localhost:5432/js5';
var db = pgp(connectionString);
// Redis
var Redis = require('ioredis');
var redis = new Redis();
// Promise
var Promise = require('promise');
exports.typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type Query {\n        hello: String,\n        users: [User],\n        useridsearch(userid: Int!): User,\n        usernamesearch(username: String!): [User],\n        usersinpage(page: Int!): [User],\n        usersinpagebyid(userid: Int): [User],\n        getfollowinglist(userid: Int!): [Friend],\n        getfollowerlist(userid: Int!): [Friend]\n    }\n\n    type Mutation {\n        createuser(username: String): User,\n        updateuser(userid: Int, username: String): User,\n        followuser(userid: Int, friendid: Int): String,\n        unfollowuser(userid: Int, friendid: Int): String\n    }\n\n    type User {\n        user_id: String,\n        username: String,\n        dateentered: String\n    }\n\n    type Friend {\n      id: String,\n      name: String\n    }\n"], ["\n    type Query {\n        hello: String,\n        users: [User],\n        useridsearch(userid: Int!): User,\n        usernamesearch(username: String!): [User],\n        usersinpage(page: Int!): [User],\n        usersinpagebyid(userid: Int): [User],\n        getfollowinglist(userid: Int!): [Friend],\n        getfollowerlist(userid: Int!): [Friend]\n    }\n\n    type Mutation {\n        createuser(username: String): User,\n        updateuser(userid: Int, username: String): User,\n        followuser(userid: Int, friendid: Int): String,\n        unfollowuser(userid: Int, friendid: Int): String\n    }\n\n    type User {\n        user_id: String,\n        username: String,\n        dateentered: String\n    }\n\n    type Friend {\n      id: String,\n      name: String\n    }\n"])));
exports.resolvers = {
    Query: {
        users: function (_, args, ctx) {
            function updateRedisZ() {
                return __awaiter(this, void 0, void 0, function () {
                    var pipeline, users;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pipeline = redis.pipeline();
                                return [4 /*yield*/, db.any("select * from users")];
                            case 1:
                                users = _a.sent();
                                users.map(function (user) {
                                    pipeline.zadd("users", Math.floor(user.dateentered), user.user_id);
                                });
                                pipeline.exec();
                                return [2 /*return*/, users];
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
                return new Promise(function (resolve, reject) {
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
            ;
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
                                promise.map(users, function (user, index, arr) {
                                    return pipeline.hmset('user:' + user.user_id, 'user_id', user.user_id, 'username', user.username, 'dateentered', user.dateentered)
                                        .exec();
                                }).catch(console.error);
                                return [2 /*return*/, users];
                        }
                    });
                });
            }
            ;
            return checkRedis();
        },
        hello: function () { return 'Hello world!'; },
        useridsearch: function (_, param) { return __awaiter(_this, void 0, void 0, function () {
            var id, key, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = param.userid;
                        key = "user:" + id;
                        return [4 /*yield*/, redis.exists(key)];
                    case 1:
                        user = _a.sent();
                        if (user == 1) {
                            return [2 /*return*/, redis.hgetall(key)];
                        }
                        else {
                            return [2 /*return*/, db.one("select * from users where user_id = " + id)];
                        }
                        return [2 /*return*/];
                }
            });
        }); },
        usernamesearch: function (_, param) {
            var usernameSearchQuery = "select * from users where username ilike ('%' || " + param.username + " || '%')";
            return db.any(usernameSearchQuery);
        },
        usersinpage: function (obj, param) {
            var usersinpageQuery = "select * from users\n          order by dateentered \n          offset (5 * (" + param.page + " - 1)) rows \n          fetch next 5 rows only";
            return db.any(usersinpageQuery);
        },
        usersinpagebyid: function (_, param) { return __awaiter(_this, void 0, void 0, function () {
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
                                    pipeline.zadd("users", Math.floor(e.dateentered), e.user_id);
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
                                return [4 /*yield*/, redis.zrank('users', param.userid)];
                            case 1:
                                userIndex = _a.sent();
                                return [4 /*yield*/, redis.zrange('users', userIndex + 1, userIndex + 5)];
                            case 2:
                                userIds = _a.sent();
                                userIds.map(function (val) {
                                    pipeline.hgetall("users:" + val);
                                });
                                return [4 /*yield*/, pipeline.exec().then(function (data) {
                                        return data.map(function (e) { return e[1]; });
                                    })];
                            case 3: return [2 /*return*/, _a.sent()];
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
        }); },
        getfollowinglist: function (_, param) {
            return db.any("select friend_id as id, friendname as name from friend_list where user_id = " + param.userid);
        },
        getfollowerlist: function (_, param) {
            return db.any("select user_id as id, username as name from friend_list where friend_id = " + param.userid);
        }
    },
    Mutation: {
        createuser: function (_, input) { return __awaiter(_this, void 0, void 0, function () {
            var pipeline, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pipeline = redis.pipeline();
                        return [4 /*yield*/, db.one('insert into users(username) values ($1) returning *', input.username)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, pipeline.hmset("user:" + user.user_id, 'user_id', user.user_id, 'username', user.username, 'dateentered', user.dateentered)
                                .hgetall('user:' + user.user_id).exec().then(function (result) {
                                return result[1][1];
                            })];
                }
            });
        }); },
        updateuser: function (_, input) { return __awaiter(_this, void 0, void 0, function () {
            var pipeline, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pipeline = redis.pipeline();
                        return [4 /*yield*/, db.one("update users set username = " + input.username + " where user_id = " + input.userid + " returning *")];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, pipeline.hmset("user:" + user.user_id, 'username', user.username).hgetall('user:' + user.user_id).exec()
                                .then(function (result) {
                                return result[1][1];
                            })];
                }
            });
        }); },
        followuser: function (_, input) { return __awaiter(_this, void 0, void 0, function () {
            var user, message, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.one("with row as (insert into friendlist(user_id, friend_id) values(" + input.userid + ", " + input.friendid + ") returning friend_id as id) \n                select username from users where user_id = (select id from row)")];
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
        }); },
        unfollowuser: function (_, input) { return __awaiter(_this, void 0, void 0, function () {
            var user, message, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.one("with row as (delete from friendlist where user_id = " + input.userid + " and friend_id = " + input.friendid + " returning friend_id as id)\n            select username from users where user_id = (select id from row)")];
                    case 1:
                        user = _a.sent();
                        message = user.username + " deleted from your friend list.";
                        return [2 /*return*/, message];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, "user id " + input.userid + " is not in your friend list"];
                    case 3: return [2 /*return*/];
                }
            });
        }); }
    },
};
var templateObject_1;
//export default [typeDefs, resolvers];
