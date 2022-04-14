const fs = require('fs');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/api/signup', (req, res) => {
    let result = signup(req.body);
    if(result.success)
        res.statusCode = 201;
    else
        res.statusCode = 400;
    res.send(result);
});

app.post('/api/login', (req, res) => {
    let result = login(req.body);
    if(result.success)
        res.render('profile', {
            username: result.user.username,
        });
    else {
        res.statusCode = 400;
        res.send(result);
    }
});

const signup = (data) => {
    const users = JSON.parse(fs.readFileSync('users.json'));
    if(users.find((user) => user.username === data.username)) {
        return {
            success: false,
            message: 'Username already exists.'
        }
    } else if (users.find((user) => user.email === data.email)) {
        return {
            success: false,
            message: 'Email already exists.'
        }
    } else {
        users.push(data);
        fs.writeFileSync('users.json', JSON.stringify(users));
        return {
            success: true,
            message: 'Signup successful.'
        }
    }
}


const login = (data) => {
    const users = JSON.parse(fs.readFileSync('users.json'));
    let index = users.findIndex((user) => user.email === data.email);
    if(index !== -1 && users[index].password === data.password) {
        return {
            success: true,
            message: 'Login successful.',
            user: users[index]
        }
    } else if(index !== -1 && users[index].password !== data.password) {
        return {
            success: false,
            message: 'Incorrect password.'
        }
    } else {
        return {
            success: false,
            message: 'Incorrect email.'
        }
    }
}

app.listen(3000);
