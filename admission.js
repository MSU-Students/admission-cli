const level = require('level');

(function main() {
    const db = connectToDatabase('admssion-db');
    const args = process.argv.splice(2);
    let studentId;
    switch (args[0]) {
        case 'accept':
            studentId = args[1];
            const studentName = args[2];
            const studentAge = args[3];
            const studentAddress = args[4];
            acceptStudent(db, studentId, studentName, studentAge, studentAddress);
            break;
        case 'sched-interview':
            studentId = args[1];
            const interviewDate = args[2];            
            scheduleInterview(db, studentId, interviewDate);
            break;
        case 'list':
            listAllStudents(db);
            break;
        default:
            console.log('Commands:', 'accept', 'list', 'sched-interview');
    }
}());

function connectToDatabase(dbName) {
    const options = {
        valueEncoding: 'json'
    };
    return level(dbName, options);
}

async function acceptStudent(db, studentId, studentName, studentAge, studentAddress) {
    const studentInfo = {
        id: studentId,
        name: studentName,
        age: studentAge,
        address: studentAddress
    };
    return db.put(studentId, studentInfo);
}

async function getNext(iterator) {
    return new Promise((resolve, reject) => {
        iterator.next((err, key, value) => {
            if (err) {
                reject(err);
            } else if (key && value) {
                resolve({ key: key, value: value });
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
            console.log(student.id, student.name, student.age, student.address, student.interviewSched);
        }
    } while (nextKeyValue);
}

async function scheduleInterview(db, studentId, interviewDate) {
    try {
        const student =  await db.get(studentId);
        student.interviewSched = interviewDate;
        db.put(studentId, student);
    } catch (error) {
        console.log('invalid id', studentId);
    }
}