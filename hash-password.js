import bcrypt from 'bcryptjs';

const password = 'password123'; // Replace with the desired password
bcrypt.hash(password, 10).then((hash) => {
  console.log('Generated Hash:', hash);
});

