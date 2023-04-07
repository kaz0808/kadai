const express = require('express');
const mysql=require('mysql');
const app = express();

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'kkkk'
  });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('top.ejs');
});
app.get('/usercreate', (req, res) => {
    res.render('usercreate.ejs');
});
app.post('/create',(req,res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        'INSERT INTO users (username,email,password) VALUES(?,?,?)',
        [username,email,password],
        (error,results)=>{
            res.render('create.ejs');
        }
    );
});
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.listen(3000);