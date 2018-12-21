import Bluebird from 'bluebird';
const options = {
    promiseLib: Bluebird
};

// pg
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://postgres:jk123@localhost:5432/js5';
const db = pgp(connectionString);

// Redis
import Redis = require('ioredis');
const redis = new Redis();

export default class User {
    public user_id: string;
    public username: string;
    public dateentered: string;

    constructor(user_id: string, user_name: string, dataentered: string) {
        this.user_id = user_id;
        this.username = user_name;
        this.dateentered = dataentered;
    }

    public static async getusers(): Bluebird<User[]> {
        // async function updateRedisZ() {
        //     let pipeline = redis.pipeline();
        //     let users: User[] = await db.any(`select * from users`);
        //     users.map((user: User) => {
        //         pipeline.zadd(`users`, user.dateentered, user.user_id);
        //     });
        //     pipeline.exec();
        //     return users;
        // }

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
            return new Bluebird<User[]>((resolve, reject) => {
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
            Bluebird.map<User, void>(users, (user, _index, _arr) => {
                return pipeline.hmset('user:' + user.user_id, 'user_id', user.user_id, 'username', user.username, 'dateentered', user.dateentered)
                    .exec();
            }).catch(console.error);
            return users;
        };
        return checkRedis();
    }
    // Example 
    public async followUser(_user: User): Bluebird<boolean> {
        return true;
    }

    public static usernamesearch(username: String): User[] {
        return db.any(`select * from users where username ilike ('%' || $1 || '%')`, username);
    }

    public static async useridsearch(userid: string): Bluebird<User> {
        var key: string = "user:" + userid;
        let user: number = await redis.exists(key);
        if (user == 1) {
            return redis.hgetall(key);
        } else {
            return db.one(`select * from users where user_id = $1`, userid);
        }
    }

    public static usersinpage(pagenumber: string) {
        const usersinpageQuery = `select * from users
          order by dateentered 
          offset (5 * ($1 - 1)) rows 
          fetch next 5 rows only`
        return db.any(usersinpageQuery, pagenumber);
    }

    public static async usersinpagebyid(userid: string): Bluebird<User[]> {
        async function updateRedis() {
            const pipeline = redis.pipeline();
            let users: User[] = await db.any('select * from users');
            users.map(e => {
                pipeline.zadd(`users`, e.dateentered, e.user_id);
            })
            await pipeline.exec();
            return console.log('Redis updated');
        }

        async function fromRedis() {
            const pipeline = redis.pipeline();

            let userIndex: number = await redis.zrank('users', userid);
            let userIds: number[] = await redis.zrange('users', userIndex + 1, userIndex + 5);
            userIds.map(val => {
                pipeline.hgetall(`users:${val}`)
            })
            return pipeline.exec().then((data) => {
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
    }

    public static async createuser(username: string): Bluebird<User> {
        var pipeline = redis.pipeline();
        let user: User = await db.one('insert into users(username) values ($1) returning *', username);
        return pipeline.hmset(`user:${user.user_id}`, 'user_id', user.user_id, 'username', user.username, 'dateentered', user.dateentered)
            .hgetall('user:' + user.user_id).exec().then((result: any) => {
                return result[1][1];
            });
    }

    public static async updateuser(userid: string, username: string): Bluebird<User> {
        var pipeline = redis.pipeline();
        let user: User = await db.one(`update users set username = ${username} where user_id = ${userid} returning *`);
        return pipeline.hmset(`user:${user.user_id}`, 'username', user.username).hgetall('user:' + user.user_id).exec()
            .then((result: any) => {
                return result[1][1];
            })
    }


}



// const newUser1 = new User('1', 'user1', '0');
// const newUser2 = new User('2', 'user2', '1');
// newUser1.followUser(newUser2);

