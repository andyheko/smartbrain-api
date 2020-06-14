const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'andyko',
    password : '',
    database : 'smart-brain'
  }
});

// db.select('*').from('users').then(data => {
//   console.log(data);
// })

const app = express();

const database = {
  users: [
    {
      id: '123',
      name: 'Andy',
      email: 'andyko@gmail.com',
      password: 'cake',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'io',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res)=> {
  // // Load hash from your password DB.
  // bcrypt.compare("bacon", hash, function(err, res) {
  //     // res == true
  // });
  // bcrypt.compare("veggies", hash, function(err, res) {
  //     // res = false
  // });
  if(req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password){
    res.json(database.users[0])
  }else{
    res.status(400).json('error logging in');
  }
})

app.post('/register', (req, res)=> {
  const {email, name, password} = req.body;
  return db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   // Store hash in your password DB.
  //   console.log(hash);
  // });
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(404).json('Not found');
      }
    })
  // database.users.forEach(user => {
  //   if(user.id === id){
  //     return res.json(user);
  //   }
  // })
})

app.put('/image', (req, res) => {
  const {id} = req.body;
  database.users.forEach(user => {
    if(user.id === id){
      user.entries++
      return res.json(user.entries);
    }
  })
  res.status(404).json('not found');
})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/ :userId --> GET = user
/image --> PUT --> user

*/
