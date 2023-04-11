const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const app = express();

const connection = mysql.createConnection({
    host: '127.0.0.1',
    database: 'userauth',
    user: 'root',
    password: 'kkkk'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL server!');
});
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(
    session({
        secret: 'kadai_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1 * 60 * 1000 },
    })
);
app.use((req, res, next) => {
    if (req.session && req.session.expires && req.session.expires < Date.now()) {
        req.session.destroy();
    }
    next();
});
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});



app.get('/', (req, res) => {
    if (req.session.userId == undefined) {
        console.log('ログインなし');
    } else {
        console.log('ログイン中');
    }
    res.render('top.ejs');
});
app.get('/usercreate', (req, res) => {
    res.render('usercreate.ejs');
});
app.post('/createcheck', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        'INSERT INTO users (username,email,password) VALUES(?,?,?)',
        [username, email, password],
        (error, results) => {
            res.render('createcheck.ejs');
        }
    );
});
app.get('/login', (req, res) => {
    res.render('login.ejs');
});
app.post('/logincheck', (req, res) => {
    const email = req.body.email;
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if (results.length > 0) {
                if (req.body.password === results[0].password) {
                    req.session.userId = results[0].id;
                    res.redirect('/');
                }
                else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/login');
            }
        }
    );
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
app.get('/useredit', (req, res) => {
    const id = req.session.userId;
    connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (error, results) => {
            username = results[0].username;
            email = results[0].email;
            password = results[0].password;
            res.render('useredit.ejs');
        });
}
);
app.post('/edit', (req, res) => {
    const id = req.session.userId;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    connection.query(
        'UPDATE users SET username = ?,email = ?,password = ? WHERE id=?',
        [username, email, password, id],
        (error, results) => {
            res.redirect('/useredit');
        });
});



app.listen(3000);