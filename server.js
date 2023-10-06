
const express = require('express');
const fs = require("fs")
const app = express(); 
const port = process.env.PORT || 5000; 


app.use(express.json())

app.listen(port, () => console.log(`Listening on port ${port}`)); 

app.get('/make_file', (req, res) => {
  if (!fs.existsSync('src/files/users.txt')) {
    fs.writeFile('src/files/users.txt', '1 ADMIN 0 0', 'utf8', err => {
      if (err) {
        console.error('An error occurred while creating the file:', err);
      } else {
        console.log('File created and initial data written successfully');
      }
    });
  }
})

app.get('/get_users', (req, res) => {
  const filePath = 'src/files/users.txt';

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      if (err.code === 'ENOENT') {
        res.status(404).send('File not found');
      } else {
        res.status(500).send('Internal server error');
      }
    } else {
      const lines = content.split('\n');
      const parsedUsers = lines.map((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return null;
        const [role, login, isBlock, isIndividual, password] = trimmedLine.split(' ');
        return { role, login, isBlock, isIndividual, password };
      });
      res.json(parsedUsers);
    }
  });
})

app.get('/express_backend', (req, res) => { 
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 

app.post('/rewrite_file', (req, res) => {
  const { users } = req.body
  fs.writeFile('src/files/users.txt', users, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Failed to rewrite file' });
      return;
    }
  });
});