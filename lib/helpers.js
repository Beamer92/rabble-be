import {client} from '../redis'

export let fetchGames = () => {
    return new Promise((resolve, reject) => {
        client().then(
            res => {
                res.lrangeAsync("games", 0, -1).then(
                    games => {
                        resolve(games);
                    },
                    err => {
                        reject(err);
                    }
                );
            },
            err => {
                reject("Redis connection failed: " + err);
            }
        );
    });
};

export let createGame = game => {
    return new Promise((resolve, reject) => {
        client().then(
            res => {
                res
                    .multi()
                    .rpush("games", game)
                    .execAsync()
                    .then(
                        res => {
                            resolve(res);
                        },
                        err => {
                            reject(err);
                        }
                    );
            },
            err => {
                reject("Redis connection failed: " + err);
            }
        );
    });
};