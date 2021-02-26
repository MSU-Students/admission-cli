const level = require('level');

(function main() {
    const db = connectToDatabase('admssion-db');
    const studentId = "1234";
    const studentName = "Luffy";
    const studentAge = 20;
    const studentAddress = "wano";
    acceptStudent(db, studentId, studentName, studentAge, studentAddress);
}());

function connectToDatabase(dbName) {
    const options = { 
        valueEncoding: 'json'
    };
    return level(dbName, options);
}

async function acceptStudent(db, studentId, studentName, studentAge, studentAddress) {
    const studentInfo = {
        id : studentId,
        name: studentName,
        age: studentAge,
        address: studentAddress
    };
    return  db.put(studentId,  studentInfo);
}