import bcrypt from 'bcryptjs';

const hashedPassword = '$2a$10$AFdw2Lw2XJuWcLBdqbqTjeDDEbnwL5Pxft.0/VI3bHkDNqPMKfYoG'; // Replace with the current hash
const password = 'password123'; // Replace with the password you want to check

bcrypt.compare(password, hashedPassword).then((isMatch) => {
  console.log('Passwords Match:', isMatch);
}).catch((error) => {
  console.error('Error comparing passwords:', error);
});
