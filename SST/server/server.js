const express = require('express');
const app = express();
app.use(express.json());
app.use(require('./razorpay'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});