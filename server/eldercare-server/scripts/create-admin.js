const axios = require('axios');

const createAdmin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/users', {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123456',
      role: 'admin'
    });
    console.log('Admin created successfully:', response.data);
  } catch (error) {
    console.error('Error creating admin:', error.response ? error.response.data : error.message);
  }
};

createAdmin();
