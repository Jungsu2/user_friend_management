var promise = require('bluebird');
var options = {
    promiseLib: promise
};

// postgresql
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:jk123@localhost:5432/js5'
var db = pgp(connectionString);

// redis
var Redis = require('ioredis');
var redis = new Redis();


db.any('select * from users')
.then((data)=>{
    // const promise = [];

    // data.forEach(e => {
    //     promise.push(redis.del("user:" + e.user_id)
    //         .then(redis.hmset("user:" + e.user_id, "user_id", e.user_id, "username", e.username, "dateentered", e.dateentered)))
    // });

    // return promise.all(promise)

    return promise.map(e => {
        return redis.del("user:" + e.user_id)
            .then(redis.hmset("user:" + e.user_id, "user_id", e.user_id, "username", e.username, "dateentered", e.dateentered))
    });

}).then(() => console.info("finished"));

db.any('select * from users')
.then((data) => {
    data.forEach(e => {
        redis.zadd("users", Math.floor(e.dateentered), e.user_id);
    });
});

redis.set('users:version', Date.now());
