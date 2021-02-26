const level = require('level');

(function main() {
    connectToDatabase('admssion-db');
}());

function connectToDatabase(dbName) {
    const options = { 
        valueEncoding: 'json'
    };
    return level(dbName, options);
}
