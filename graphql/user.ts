import { ApolloServer, gql } from 'apollo-server-express';
import User from "../type/user";

import * as promise from 'bluebird';
//import promise = require('bluebird');
const options = {
    promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://postgres:jk123@localhost:5432/js5'
const db = pgp(connectionString);

// Redis
const Redis = require('ioredis');
const redis = new Redis();

// Promise
const Promise = require('promise');

export const typeDefs = gql`
    type Query {
        hello: String,
        users: [User],
        useridsearch(userid: Int!): User,
        usernamesearch(username: String!): [User],
        usersinpage(page: Int!): [User],
        usersinpagebyid(userid: Int): [User],
        getfollowinglist(userid: Int!): [Friend],
        getfollowerlist(userid: Int!): [Friend]
    }

    type Mutation {
        createuser(username: String): User,
        updateuser(userid: Int, username: String): User,
        followuser(userid: Int, friendid: Int): String,
        unfollowuser(userid: Int, friendid: Int): String
    }

    type User {
        user_id: String,
        username: String,
        dateentered: String
    }

    type Friend {
      id: String,
      name: String
    }
`;

export const resolvers = {
    Query: {
        users: (_: any, args: any, ctx: any) => {
            async function updateRedisZ() {
                let pipeline = redis.pipeline();
                let users: User[] = await db.any(`select * from users`);
                users.map((user: User) => {
                    pipeline.zadd(`users`, Math.floor(user.dateentered), user.user_id);
                });
                pipeline.exec();
                return users;
            }
            async function checkRedis() {
                let flag = await redis.exists('users');
                if (flag == 1) {
                    console.log('from Redis');
                    return getUsersInRedis();
                }
                else {
                    console.log('Redis updated');
                    return updateRedis();
                }
            }

            function getUsersInRedis() {
                var pipeline = redis.pipeline();
                var stream = redis.scanStream({
                    match: 'user:*',
                    count: 100
                });
                return new Promise((resolve: any, reject: string) => {
                    stream.on('data', (resultKeys: string[]) => {
                        resultKeys.map((val: string) => {
                            pipeline.hgetall(val);
                        });
                    });
                    stream.on('end', () => {
                        pipeline.exec().then((result: any[]) => {
                            let userList: User[] = result.map(user => user[1]);
                            resolve(userList);
                        });
                    });
                    stream.on('error', reject);
                });
            };

            async function updateRedis() {
                let pipeline = redis.pipeline();
                let users: User[] = await db.any('select * from users');
                promise.map(users, (user: User, index: number, arr: User[]) => {
                    return pipeline.hmset('user:' + user.user_id, 'user_id', user.user_id, 'username', user.username, 'dateentered', user.dateentered)
                        .exec();
                }).catch(console.error);
                return users;
            };
            return checkRedis();
        },
        hello: () => 'Hello world!',
        useridsearch: async (_: any, param: any) => {
            var id: string = param.userid;
            var key: string = "user:" + id;
            let user: number = await redis.exists(key);
            if (user == 1) {
                return redis.hgetall(key);
            } else {
                return db.one(`select * from users where user_id = ${id}`);
            }
        },
        usernamesearch: (_: any, param: any) => {
            const usernameSearchQuery = `select * from users where username ilike ('%' || ${param.username} || '%')`;
            return db.any(usernameSearchQuery);
        },
        usersinpage: (obj: any, param: any) => {
            const usersinpageQuery = `select * from users
          order by dateentered 
          offset (5 * (${param.page} - 1)) rows 
          fetch next 5 rows only`
            return db.any(usersinpageQuery);
        },
        usersinpagebyid: async (_: any, param: any) => {
            async function updateRedis() {
                const pipeline = redis.pipeline();
                let users: User[] = await db.any('select * from users');
                users.map(e => {
                    pipeline.zadd(`users`, Math.floor(e.dateentered), e.user_id);
                })
                await pipeline.exec();
                return console.log('Redis updated');
            }

            async function fromRedis() {
                const pipeline = redis.pipeline();

                let userIndex: number = await redis.zrank('users', param.userid);
                let userIds: number[] = await redis.zrange('users', userIndex + 1, userIndex + 5);
                userIds.map(val => {
                    pipeline.hgetall(`users:${val}`)
                })
                return await pipeline.exec().then((data: any) => {
                    return data.map(e => e[1]);
                })
            }

            async function checkRedis() {
                let flag: number = await redis.exists('users');
                if (flag == 1) {
                    return fromRedis();
                } else {
                    await updateRedis();
                    return fromRedis();
                }
            }
            return checkRedis();
        },
        getfollowinglist: (_: any, param: any) => {
            return db.any(`select friend_id as id, friendname as name from friend_list where user_id = ${param.userid}`);
        },
        getfollowerlist: (_: any, param: any) => {
            return db.any(`select user_id as id, username as name from friend_list where friend_id = ${param.userid}`);
        }
    },
    Mutation: {
        createuser: async (_: any, input: any) => {
            var pipeline = redis.pipeline();
            let user: User = await db.one('insert into users(username) values ($1) returning *', input.username);
            return pipeline.hmset(`user:${user.user_id}`, 'user_id', user.user_id, 'username', user.username, 'dateentered', user.dateentered)
                .hgetall('user:' + user.user_id).exec().then((result: any) => {
                    return result[1][1];
                })
        },
        updateuser: async (_: any, input: any) => {
            var pipeline = redis.pipeline();
            let user: User = await db.one(`update users set username = ${input.username} where user_id = ${input.userid} returning *`);
            return pipeline.hmset(`user:${user.user_id}`, 'username', user.username).hgetall('user:' + user.user_id).exec()
                .then((result: any) => {
                    return result[1][1];
                })
        },
        followuser: async (_: any, input: any) => {
            try {
                let user: User = await db.one(`with row as (insert into friendlist(user_id, friend_id) values(${input.userid}, ${input.friendid}) returning friend_id as id) 
                select username from users where user_id = (select id from row)`);
                let message = `${user.username} added in your friend list.`;
                return message;
            } catch (error) {
                return 'Already in your friend list';
            }
        },
        unfollowuser: async (_: any, input: any) => {
            try {
                let user: User = await db.one(`with row as (delete from friendlist where user_id = ${input.userid} and friend_id = ${input.friendid} returning friend_id as id)
            select username from users where user_id = (select id from row)`);
                var message: string = `${user.username} deleted from your friend list.`;
                return message;
            } catch (error) {
                return `user id ${input.userid} is not in your friend list`;
            }
        }
    },
};

//export default [typeDefs, resolvers];