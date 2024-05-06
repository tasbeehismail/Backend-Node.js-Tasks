const http = require("http");
const fs = require('fs');

// How to load data from json file 
const studentsPathFile = 'student.json';
let students = [];
try{
    const data = fs.readFileSync(studentsPathFile, 'utf-8');
    students = JSON.parse(data);
}catch (err){
    console.log('Error reading students file:', err);
}

const coursesPathFile = 'courses.json';
let courses = [];
try{
    const data = fs.readFileSync(coursesPathFile, 'utf-8');
    courses = JSON.parse(data);
}catch (err){
    console.log('Error reading courses file:', err);
}

const departmentPathFile = 'department.json';
let department = [];
try{
    const data = fs.readFileSync(departmentPathFile, 'utf-8');
    department = JSON.parse(data);
}catch (err){
    console.log('Error reading department file:', err);
}

let server = http.createServer((req, res) => {
    let {url, method} = req;
    res.setHeader("content-type", "application/json")
    /* ----------------------------Student APIs--------------------------- */
    if(method == "GET" && url == "/students"){ // Get All students
        res.end(JSON.stringify(students));
    }else if (method == "POST" && url == "/addStudent"){ // Add student
        req.on("data", (chunk) =>{
            const data = JSON.parse(chunk);
            let isUniqueEmail = true;
            students.forEach(element => {
                isUniqueEmail &= (element.email != data.email) // & for at least one false element make it false
            });
            if(isUniqueEmail){
                data.id = students.length + 1;
                students.push(data);
                fs.writeFile(studentsPathFile, JSON.stringify(students, null, 2), err => {
                    if (err) {
                        console.error('Error writing to students file:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal server error' }));
                    } else {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Student added successfully', students: data }));
                    }
                });
            }else{
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify("Email must be unique"));
            }
        });
    }else if(method == "GET" && url == "/students-with-departments-and-courses"){ // Get all students with their department and courses related to the department
        let data = [...students]; // deep copy of it
        data.forEach(student => { // 1 -> tasbeeh
            let index = department.findIndex(department => parseInt(student.deptID) === department.id);
            let deptStudent = department[index];
            student.department = deptStudent;
            student.courses = [];
            courses.forEach(course => { // 1 -> Algorithm
                if(course.deptID == deptStudent.id){
                    student.courses.push(course);
                }
            });
        });
        res.end(JSON.stringify(data));
    }else if(method == "DELETE" && url.startsWith("/students/")){ // delete student
        const studentId = url.split('/')[2];
        let index = students.findIndex(students => parseInt(studentId) === students.id);
        students.splice(index, 1);
        fs.writeFile(studentsPathFile, JSON.stringify(students, null, 2), err => {
            if (err) {
                console.error('Error writing to students file:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            } else {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Student removed successfully', students}));
            }
        });
    }else if(method == "PUT" && url.startsWith("/students/")){ // update student
        const studentId = url.split('/')[2];
        let index = students.findIndex(students => parseInt(studentId) === students.id);
        req.on("data", (chunk) =>{
            const data = JSON.parse(chunk);
            const newDeptID = data.deptID;
            students[index].deptID = newDeptID;
            fs.writeFile(studentsPathFile, JSON.stringify(students, null, 2), err => {
                if (err) {
                    console.error('Error writing to students file:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Student updated successfully', students}));
                }
            });
        });
    }else if(method == "GET" && url.startsWith("/students/")){ // search for a student by ID
        const studentId = url.split('/')[2];
        let index = students.findIndex(students => parseInt(studentId) === students.id);
        if(index != -1){
            let data = students[index];
            res.end(JSON.stringify({ message: 'Student is founded', student: data}));
        }else{
            res.end(JSON.stringify({ message: 'Student is not founded'}));
        }
    }

    /* ----------------------------Courses APIs--------------------------- */
    if(method == "GET" && url == "/courses"){ // Get All courses
        res.end(JSON.stringify(courses))
    }else if(method == "GET" && url.startsWith("/courses/")){ // Get specific course by ID
        const courseId = url.split('/')[2];
        let index = courses.findIndex(courses => parseInt(courseId) === courses.id);
        let data = courses[index];
        res.end(JSON.stringify({ message: 'Data of course by ID', data}));
    }else if(method == "POST" && url == ("/addCourse")){ // Add course
        req.on("data", (chunk) => {
            const data = JSON.parse(chunk);
            data.id = courses.length + 1;
            courses.push(data);
            fs.writeFile(coursesPathFile, JSON.stringify(courses, null, 2), err => {
                if (err) {
                    console.error('Error writing to courses file:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Course added successfully', courses }));
                }
            });
        });
    }else if(method == "PUT" && url.startsWith("/courses/")){ // Update course
        const courseId = url.split('/')[2];
        let index = courses.findIndex(courses => parseInt(courseId) === courses.id);
        req.on("data", (chunk) =>{
            const data = JSON.parse(chunk);
            const newDeptID = data.deptID;
            courses[index].deptID = newDeptID;
            fs.writeFile(coursesPathFile, JSON.stringify(courses, null, 2), err => {
                if (err) {
                    console.error('Error writing to courses file:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Course updated successfully', courses}));
                }
            });
        });
    }else if(method == "DELETE" && url.startsWith("/courses/")){ // Delete course
        const courseId = url.split('/')[2];
        let index = courses.findIndex(courses => parseInt(courseId) === courses.id);
        courses.splice(index, 1);
        fs.writeFile(coursesPathFile, JSON.stringify(courses, null, 2), err => {
            if (err) {
                console.error('Error writing to courses file:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            } else {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Course removed successfully', courses}));
            }
        });
    }

    /* ----------------------------Department APIs--------------------------- */
    if(method == "GET" && url == "/departments"){ // Get All departments
        res.end(JSON.stringify(department))
    }else if(method == "GET" && url.startsWith("/department/")){ // Get specific department by ID
        const departmentId = url.split('/')[2];
        let index = department.findIndex(department => parseInt(departmentId) === department.id);
        let data = department[index];
        res.end(JSON.stringify({ message: 'Data of department by ID', data}));
    }else if(method == "POST" && url == ("/addDepartment")){ // Add course
        req.on("data", (chunk) => {
            const data = JSON.parse(chunk);
            data.id = department.length + 1;
            department.push(data);
            fs.writeFile(departmentPathFile, JSON.stringify(department, null, 2), err => {
                if (err) {
                    console.error('Error writing to department file:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Department added successfully', department }));
                }
            });
        });
    }else if(method == "PUT" && url.startsWith("/department/")){ // Update course
        const departmentId = url.split('/')[2];
        let index = department.findIndex(department => parseInt(departmentId) === department.id);
        req.on("data", (chunk) =>{
            const data = JSON.parse(chunk);
            const newDeptName = data.name;
            department[index].name = newDeptName;
            fs.writeFile(departmentPathFile, JSON.stringify(department, null, 2), err => {
                if (err) {
                    console.error('Error writing to department file:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Department updated successfully', department}));
                }
            });
        });
    }else if(method == "DELETE" && url.startsWith("/department/")){ // Delete course
        const departmentId = url.split('/')[2];
        let index = department.findIndex(department => parseInt(departmentId) === department.id);
        department.splice(index, 1);
        fs.writeFile(departmentPathFile, JSON.stringify(department, null, 2), err => {
            if (err) {
                console.error('Error writing to department file:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            } else {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Department removed successfully', department}));
            }
        });
    }
});


server.listen(3000, () =>{
    console.log("server running");
})