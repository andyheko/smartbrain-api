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
  // // // Load hash from your password DB.
  // // bcrypt.compare("bacon", hash, function(err, res) {
  // //     // res == true
  // // });
  // // bcrypt.compare("veggies", hash, function(err, res) {
  // //     // res = false
  // // });
  // if(req.body.email === database.users[0].email &&
  //     req.body.password === database.users[0].password){
  //   res.json(database.users[0])
  // }else{
  //   res.status(400).json('error logging in');
  // }
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(user => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res)=> {
  const {email, name, password} = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
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
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    console.log(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})
/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/ :userId --> GET = user
/image --> PUT --> user

*/
