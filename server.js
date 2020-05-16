const express = require('express');

const app = express();

const database = {
  users: [
    {
      id: '123',
      name: 'Andy',
      mail: 'andyko@gmail.com',
      password: 'cake',
      entrie: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      mail: 'sallyei@gmail.com',
      password: 'io',
      entrie: 0,
      joined: new Date()
    }
  ]
}

app.use(express.json())

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res)=> {
  if(req.body.email === database.users[0].email &
      req.body.password === database.users[0].password){
    res.json('signing')
  }else{
    res.status(400).json('error logging in');
  }
})

app.post('/register', (req, res)=> {
  const {name, email, password} = req.body;
  database.users.push(
    {
      id: '125',
      name: name,
      mail: email,
      password: password,
      entrie: 0,
      joined: new Date()
    }
  )
  res.json(database.users[database.users.length-1]);
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
