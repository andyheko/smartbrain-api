const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
  const {name, email, password} = req.body;
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   // Store hash in your password DB.
  //   console.log(hash);
  // });
  database.users.push(
    {
      id: '125',
      name: name,
      email: email,
      entrie: 0,
      joined: new Date()
    }
  )
  res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  database.users.forEach(user => {
    if(user.id === id){
      return res.json(user);
    }
  })
  res.status(404).json('not found');
})

app.put('/image', (req, res) => {
  const {id} = req.body;
  database.users.forEach(user => {
    if(user.id === id){
      user.entrie ++
      return res.json(user.entrie);
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
