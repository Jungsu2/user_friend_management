"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("../class/user"));
var friend_1 = __importDefault(require("../class/friend"));
var apollo_server_express_1 = require("apollo-server-express");
var typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type Mutation {\n        createuser(username: String): User,\n        updateuser(userid: Int, username: String): User,\n        followuser(userid: Int, friendid: Int): String,\n        unfollowuser(userid: Int, friendid: Int): String\n    }\n"], ["\n    type Mutation {\n        createuser(username: String): User,\n        updateuser(userid: Int, username: String): User,\n        followuser(userid: Int, friendid: Int): String,\n        unfollowuser(userid: Int, friendid: Int): String\n    }\n"])));
var resolvers = {
    Mutation: {
        createuser: function (_, input) { return user_1.default.createuser(input.username); },
        updateuser: function (_, input) { return user_1.default.updateuser(input.userid, input.username); },
        followuser: function (_, input) { return friend_1.default.followuser(input.userid, input.friendid); },
        unfollowuser: function (_, input) { return friend_1.default.unfollowuser(input.userid, input.friendid); }
    }
};
exports.default = { typeDefs: typeDefs, resolvers: resolvers };
var templateObject_1;
