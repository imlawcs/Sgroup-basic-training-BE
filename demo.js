//buoi4
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

//import file json
const users = require("./users.json");

// Hàm ghi dữ liệu vào tệp JSON
const saveUsersToFile = () => {
  fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    }
  });
};

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/api/users/", (req, res) => {
    // res.send(users);
    res.send(users);
})

app.get("/api/users/:id/", (req, res) => {
    const userId = parseInt(req.params.id);
    res.send(users.filter(user => user.id === userId)); 
    //dùng filter hoặc find
}) 

//validate
function validateInput(req, res, next) {
  const newUser = req.body;

  if (!newUser.age || !newUser.name) {
      return res.status(400).json({ error: 'Thiếu các trường bắt buộc.' });
  }
}

// Đường dẫn API POST với middleware xác thực đầu vào
app.post("/api/users/", validateInput, (req, res) => {
  const newUser = res.body;
  newUser.id = users.length ? users[users.length - 1] + 1 : 1;
  users.push(newUser);
  saveUsersToFile();
})

app.put("/api/users/:id/", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);
  Object.assign(user, req.body);
  saveUsersToFile();
})

app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  users.splice(userIndex, 1);
  saveUsersToFile();
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
