const level = require('level');

(function main() {
    const db = connectToDatabase('admssion-db');
    listAllStudents(db);
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

async function getNext(iterator) {
    return new Promise((resolve, reject) => {
        iterator.next((err, key, value) => {
            if (err) {
                reject(err);
            } else if (key && value) {
                resolve({key: key, value: value});
            } else {
                iterator.end(() => {
                    resolve(undefined);
                })
            }
        });
    })
}
async function listAllStudents(db) {
    let iterator = db.iterator();
    let nextKeyValue;
    do {
        nextKeyValue = await getNext(iterator);
        if (nextKeyValue) {
            const student = nextKeyValue.value;
            console.log(student.id, student.name, student.address);
        }
    } while (nextKeyValue);
}

