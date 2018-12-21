import User from './user';

import Bluebird from 'bluebird';
const options = {
    promiseLib: Bluebird
};

// pg
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://postgres:jk123@localhost:5432/js5';
const db = pgp(connectionString);

// Redis
//import Redis = require('ioredis');
//const redis = new Redis();

export default class Friend {
    public friend_id;
    public friendname;

    constructor(friend_id: string, friendname: string) {
        this.friend_id = friend_id;
        this.friendname = friendname;
    }

    public static getfollowinglist(user_id: string): Friend {
        return db.any(`select friend_id as id, friendname as name from friend_list where user_id = $1`, user_id);
    }

    public static getfollowerlist(user_id: string): Friend {
        return db.any(`select user_id as id, username as name from friend_list where friend_id = $1`, user_id);
    }

    public static async followuser(user_id: string, friend_id: string): Bluebird<string> {
        try {
            let user: User = await db.one(`with row as (insert into friendlist(user_id, friend_id) values($1, $2) returning friend_id as id) 
            select username from users where user_id = (select id from row)`, [user_id, friend_id]);
            let message = `${user.username} added in your friend list.`;
            return message;
        } catch (error) {
            return 'Already in your friend list';
        }
    }

    public static async unfollowuser(user_id: string, friend_id: string): Bluebird<string> {
        try {
            let user: User = await db.one(`with row as (delete from friendlist where user_id = $1 and friend_id = $2 returning friend_id as id)
        select username from users where user_id = (select id from row)`, [user_id, friend_id]);
            var message: string = `${user.username} deleted from your friend list.`;
            return message;
        } catch (error) {
            return `user id ${user_id} is not in your friend list`;
        }
    }

}