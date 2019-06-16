const Discord = require("discord.js");
const mysql = require("mysql");
const utils = require("./utils.js");
const moment = require("moment");
const fetch = require('node-fetch');
const SteamAPI = require('steamapi');
const config = require("../config.json");
const bot = require('../CorruptionBot.js')
const steam = new SteamAPI(config.SteamAIPKey);

var watchcon = mysql.createConnection({
    host: config.WatchHost,
    user: config.WatchUser,
    password: config.WatchPass,
    database: config.WatchDB,
    charset: 'utf8mb4'
});
watchcon.connect(err => {
    if (err) console.log(err)
    console.log("Connected To Database");
})
watchcon.on('error', error => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        watchcon = mysql.createConnection({
            host: config.WatchHost,
            user: config.WatchUser,
            password: config.WatchPass,
            database: config.WatchDB,
            charset: 'utf8mb4'
        });
    } else console.log(error)
})

module.exports.watcher = (client, message) => {
    if (message.member.roles.find(role => role.id === "567167097373720598") || message.member.hasPermission("ADMINISTRATOR")) {
        let mArgs = message.content.split(' ');
        let mName = message.author.username.replace(/'/g, '');
        let Value = mArgs[1].replace(/'/g, "");
        if (!mArgs[1]) return message.reply("you need to state an IP >:(");

        switch (mArgs[1]) {
            case "?widadd":
                AddUID(message, mArgs, mName, Value);
                break;
            case "?wgipadd":
                AddGameIP(message, mArgs, mName, Value);
                break;
            case "?wauthadd":
                AddAuthIP(message, mArgs, mName, Value);
                break;
            case "?widdel":
                DelUID(message, mArgs, mName, Value);
                break;
            case "?wgipdel":
                DelGameIP(message, mArgs, mName, Value);
                break;
            case "?wauthdel":
                DelAuthIP(message, mArgs, mName, Value);
                break;
            case "?widupdate":
                UpdateUID(message, mArgs, mName, Value);
                break;
            case "?wgipupdate":
                UpdateGameIP(message, mArgs, mName, Value);
                break;
            case "?wauthupdate":
                UpdateAuthIP(message, mArgs, mName, Value);
                break;
            default:
                break;
        }
    }
}

function AddUID(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM uid WHERE Value = '${Value}'`, (err, check) => {
        if (check.rows < 1) {
            if (!mArgs[2]) return message.reply("you need to state a reason >:(");
            var Reason = mArgs.slice(2).join(' ').replace(/'/g, "");

            watchcon.query(`INSERT INTO uid (Value, Reason, AddedBy) VALUES ('${Value}', '${Reason}', '${mName}')`);
            setTimeout(function () {
                watchcon.query(`SELECT * FROM uid WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error adding that user to the database! " + err);
                    else if (!rows || rows.length < 1) return message.channel.send("I encountered an error when validating the addition!\nGo ree at <@124241068727336963>");
                    else message.channel.send(`User ||${Value}|| was sucessfully added to the database!`);
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user is already in the database");
            message.delete();
        }
    })
}
function AddGameIP(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM game_ip WHERE Value = '${Value}'`, (err, check) => {
        if (check.rows < 1) {
            if (!mArgs[2]) return message.reply("you need to state a reason >:(");
            var Reason = mArgs.slice(2).join(' ').replace(/'/g, "");

            watchcon.query(`INSERT INTO game_ip (Value, Reason, AddedBy) VALUES ('${Value}', '${Reason}', '${mName}')`);
            setTimeout(function () {
                watchcon.query(`SELECT * FROM game_ip WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error adding that user to the database! " + err);
                    else if (!rows || rows.length < 1) return message.channel.send("I encountered an error when validating the addition!\nGo ree at <@124241068727336963>");
                    else message.channel.send(`User ||${Value}|| was sucessfully added to the database!`);
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user is already in the database");
            message.delete();
        }
    })
}
function AddAuthIP(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM auth_ip WHERE Value = '${Value}'`, (err, check) => {
        if (check.rows < 1) {
            if (!mArgs[2]) return message.reply("you need to state a reason >:(");
            var Reason = mArgs.slice(2).join(' ').replace(/'/g, "");

            watchcon.query(`INSERT INTO auth_ip (Value, Reason, AddedBy) VALUES ('${Value}', '${Reason}', '${mName}')`);
            setTimeout(function () {
                watchcon.query(`SELECT * FROM auth_ip WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error adding that user to the database! " + err);
                    else if (!rows || rows.length < 1) return message.channel.send("I encountered an error when validating the addition!\nGo ree at <@124241068727336963>");
                    else message.channel.send(`User ||${Value}|| was sucessfully added to the database!`);
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user is already in the database");
            message.delete();
        }
    })
}

function DelUID(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM uid WHERE Value = '${Value}'`, (err, check) => {
        if (check.length > 1) {
            watchcon.query(`DELETE FROM uid WHERE Value = '${Value}'`);

            setTimeout(function () {
                watchcon.query(`SELECT * FROM uid WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error adding that user to the database! " + err);
                    else if (!rows || rows.length < 1) message.channel.send(`User ||${Value}|| was sucessfully removed from the database!`);
                    else return message.channel.send("I encountered an error when validating the removal!\nGo ree at <@124241068727336963>");
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user does not exist in the database");
            message.delete();
        }
    })
}
function DelGameIP(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM game_ip WHERE Value = '${Value}'`, (err, check) => {
        if (check.length > 1) {
            watchcon.query(`DELETE FROM game_ip WHERE Value = '${Value}'`);

            setTimeout(function () {
                watchcon.query(`SELECT * FROM game_ip WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error adding that user to the database! " + err);
                    else if (!rows || rows.length < 1) message.channel.send(`User ||${Value}|| was sucessfully removed from the database!`);
                    else return message.channel.send("I encountered an error when validating the removal!\nGo ree at <@124241068727336963>");
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user does not exist in the database");
            message.delete();
        }
    })
}
function DelAuthIP(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM auth_ip WHERE Value = '${Value}'`, (err, check) => {
        if (check.length > 1) {
            watchcon.query(`DELETE FROM auth_ip WHERE Value = '${Value}'`);

            setTimeout(function () {
                watchcon.query(`SELECT * FROM auth_ip WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error adding that user to the database! " + err);
                    else if (!rows || rows.length < 1) message.channel.send(`User ||${Value}|| was sucessfully removed from the database!`);
                    else return message.channel.send("I encountered an error when validating the removal!\nGo ree at <@124241068727336963>");
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user does not exist in the database");
            message.delete();
        }
    })
}

function UpdateUID(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM uid WHERE Value = '${Value}'`, (err, check) => {
        if (check.length > 1) {
            if (!mArgs[2]) return message.reply("you need to state a reason >:(");
            var Reason = mArgs.slice(2).join(' ').replace(/'/g, "");

            watchcon.query(`UPDATE uid SET Reason = '${Reason}' WHERE Value = '${Value}'`);

            setTimeout(function () {
                watchcon.query(`SELECT * FROM uid WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error updating that user on the database! " + err);
                    else if (!rows || rows.length < 1) return message.channel.send("I encountered an error when validating the addition!\nGo ree at <@124241068727336963>");
                    else message.channel.send(`User ||${Value}|| was sucessfully updated!`);
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user does not exist in the database");
            message.delete();
        }
    })
}
function UpdateGameIP(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM game_ip WHERE Value = '${Value}'`, (err, check) => {
        if (check.length > 1) {
            if (!mArgs[2]) return message.reply("you need to state a reason >:(");
            var Reason = mArgs.slice(2).join(' ').replace(/'/g, "");

            watchcon.query(`UPDATE game_ip SET Reason = '${Reason}' WHERE Value = '${Value}'`);

            setTimeout(function () {
                watchcon.query(`SELECT * FROM game_ip WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error updating that user on the database! " + err);
                    else if (!rows || rows.length < 1) return message.channel.send("I encountered an error when validating the addition!\nGo ree at <@124241068727336963>");
                    else message.channel.send(`User ||${Value}|| was sucessfully updated!`);
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user does not exist in the database");
            message.delete();
        }
    })
}
function UpdateAuthIP(message, mArgs, mName, Value) {
    watchcon.query(`SELECT * FROM auth_ip WHERE Value = '${Value}'`, (err, check) => {
        if (check.length > 1) {
            if (!mArgs[2]) return message.reply("you need to state a reason >:(");
            var Reason = mArgs.slice(2).join(' ').replace(/'/g, "");

            watchcon.query(`UPDATE auth_ip SET Reason = '${Reason}' WHERE Value = '${Value}'`);

            setTimeout(function () {
                watchcon.query(`SELECT * FROM auth_ip WHERE Value = '${Value}'`, (err, rows) => {
                    if (err) return message.channel.send("There was an error updating that user on the database! " + err);
                    else if (!rows || rows.length < 1) return message.channel.send("I encountered an error when validating the addition!\nGo ree at <@124241068727336963>");
                    else message.channel.send(`User ||${Value}|| was sucessfully updated!`);
                    message.delete();
                })
            }, 300)
        }
        else {
            message.channel.send("That user does not exist in the database");
            message.delete();
        }
    })
}