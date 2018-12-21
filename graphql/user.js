"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type User {\n        user_id: String,\n        username: String,\n        dateentered: String\n    }\n"], ["\n    type User {\n        user_id: String,\n        username: String,\n        dateentered: String\n    }\n"])));
exports.default = { typeDefs: exports.typeDefs };
var templateObject_1;
