
const express = require('express');
const fs = require("fs")
const app = express(); 
const port = process.env.PORT || 5000; 
const crypto = require('crypto')
let password = null;

function encryptFile(filePath, key) {
  // Чтение исходного файла
  const data = fs.readFileSync(filePath, 'utf8');

  // Создание шифратора с использованием ключа
  const cipher = crypto.createCipher('aes-256-cbc', key);

  // Шифрование данных
  const encryptedData = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

  // Запись зашифрованных данных во временный файл
  fs.writeFileSync('src/files/users.txt', encryptedData, 'utf8');
}

function decryptFile(filePath, key) {
  // Чтение зашифрованных данных из временного файла
  const encryptedData = fs.readFileSync(filePath, 'utf8');

  // Создание дешифратора с использованием ключа
  const decipher = crypto.createDecipher('aes-256-cbc', key);

  // Расшифровка данных
  const decryptedData = decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8');

  // Возвращение расшифрованных данных
  return decryptedData;
}

function checkPassword(filePath, password) {
  // Расшифровка файла с использованием введенной парольной фразы
  const decryptedData = decryptFile(filePath, password);

  // Проверка наличия учетной записи администратора
  return decryptedData.includes('ADMIN');
}


app.use(express.json())

const server = app.listen(port, () => console.log(`Listening on port ${port}`)); 

process.on("SIGINT", () => {
  const filePath = 'src/files/users.txt.tmp';
  const decryptedFilePath = 'src/files/users.txt';
  
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        console.error('Ошибка чтения файла:', err);
      } else {
        const lines = content.split('\n'); 
        const parsedUsers = lines.map((line) => {
          const trimmedLine = line.trim();
          if (trimmedLine === '') return null;
          const [role, login, isBlock, isIndividual, password] = trimmedLine.split(' ');
          return { role, login, isBlock, isIndividual, password };
        });
        const encryptedData = encryptData(JSON.stringify(parsedUsers));
        fs.writeFile(decryptedFilePath, encryptedData, (err) => {
          if (err) {
            console.error('Ошибка записи расшифрованного файла:', err);
          }
        });
        fs.unlinkSync(filePath);
      }
    });
  }

  server.close((err) => {
    if (err) {
      console.error('Ошибка при закрытии сервера:', err);
    }
    process.exit();
  });
});

app.get('/make_file', (req, res) => { // Запрос на создание текстового файла в случае его отсутствия 
  password = 'password'
  if (!fs.existsSync('src/files/users.txt')) { 
    fs.writeFile('src/files/users.txt.tmp', '1 ADMIN 0 0', 'utf-8', err => { // Дефолтная строка (данные аккаунта админа без пароля)
      if (err) {
        console.error('An error occurred while creating the file:', err);
      } else {
        console.log('File created and initial data written successfully');
        encryptFile('src/files/users.txt.tmp', 'password');
      }
    });
  }
  else if (!fs.existsSync('src/files/users.txt.tmp')) {
    const encData = decryptFile('src/files/users.txt', password);
    const userDataArray = JSON.parse(encData) || [];
  
    let formattedData = "";
    for (let i = 0; i < userDataArray.length; i++) {
      const userData = userDataArray[i];
      if (userData) {
        console.log(userData);
        const formattedUser = `${userData.role} ${userData.login} ${userData.isBlock} ${userData.isIndividual} ${userData.password !== 'undefined' || !userData.password ? userData.password : ''}`;
        formattedData += formattedUser + "\n";
      }
    }
    fs.writeFile('src/files/users.txt.tmp', formattedData, 'utf8', (err) => {
      if (err) {
        console.error('An error occurred while creating the file:', err);
      } else {
        console.log('File created and initial data written successfully');
      }
    });
  }
})

app.get('/check_password', (req, res) => {
  const password = req.query.password; 
  const result = checkPassword('src/files/users.txt', password);
  res.send(result ? 'Парольная фраза верна' : 'Парольная фраза неверна');
});

app.get('/get_users', (req, res) => { 
  const filePath = 'src/files/users.txt.tmp';
  password = 'password'
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
      console.log(lines); 
      const parsedUsers = lines.map((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return null;
        const [role, login, isBlock, isIndividual, password] = trimmedLine.split(' ');
        return { role, login, isBlock, isIndividual, password };
      });
      res.json(parsedUsers);
    }
  });
});

app.get('/express_backend', (req, res) => { 
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
});

app.post('/rewrite_file', (req, res) => {
  const { users } = req.body;
  fs.writeFile('src/files/users.txt.tmp', users, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Failed to rewrite encrypted file' });
    }
  });
});

function encryptData(data) {
  const cipher = crypto.createCipher('aes-256-cbc', password);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}

