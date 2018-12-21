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
var typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type Query {\n        hello: String,\n        getusers: [User],\n        useridsearch(userid: Int!): User,\n        usernamesearch(username: String!): [User],\n        usersinpage(page: Int!): [User],\n        usersinpagebyid(userid: Int): [User],\n        getfollowinglist(userid: Int!): [Friend],\n        getfollowerlist(userid: Int!): [Friend]\n    }\n"], ["\n    type Query {\n        hello: String,\n        getusers: [User],\n        useridsearch(userid: Int!): User,\n        usernamesearch(username: String!): [User],\n        usersinpage(page: Int!): [User],\n        usersinpagebyid(userid: Int): [User],\n        getfollowinglist(userid: Int!): [Friend],\n        getfollowerlist(userid: Int!): [Friend]\n    }\n"])));
var resolvers = {
    Query: {
        getusers: function () { return user_1.default.getusers(); },
        hello: function () { return 'Hello world!'; },
        useridsearch: function (_, param) { return user_1.default.useridsearch(param.userid); },
        usernamesearch: function (_, param) { return user_1.default.usernamesearch(param.username); },
        usersinpage: function (_, param) { return user_1.default.usersinpage(param.page); },
        usersinpagebyid: function (_, param) { return user_1.default.usersinpagebyid(param.userid); },
        getfollowinglist: function (_, param) { return friend_1.default.getfollowinglist(param.userid); },
        getfollowerlist: function (_, param) { return friend_1.default.getfollowerlist(param.userid); }
    }
};
exports.default = { typeDefs: typeDefs, resolvers: resolvers };
var templateObject_1;
