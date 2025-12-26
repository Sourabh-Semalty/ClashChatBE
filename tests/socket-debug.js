const io = require('socket.io-client');

// Test connection WITHOUT token (should fail with auth error)
console.log('Test 1: Connecting without token...');
const socket1 = io('http://localhost:5000', {
  transports: ['polling', 'websocket']
});

socket1.on('connect', () => {
  console.log('✅ Connected without token (unexpected!)');
  socket1.disconnect();
});

socket1.on('connect_error', (error) => {
  console.log('❌ Connection error (expected):', error.message);
  socket1.disconnect();
  
  // Test connection WITH a dummy token (should also fail)
  console.log('\nTest 2: Connecting with invalid token...');
  const socket2 = io('http://localhost:5000', {
    auth: {
      token: 'invalid-token-12345'
    },
    transports: ['polling', 'websocket']
  });
  
  socket2.on('connect', () => {
    console.log('✅ Connected with invalid token (unexpected!)');
    socket2.disconnect();
    process.exit(0);
  });
  
  socket2.on('connect_error', (error) => {
    console.log('❌ Connection error (expected):', error.message);
    socket2.disconnect();
    
    console.log('\n📝 To test with a valid token:');
    console.log('1. Login via Postman to get a valid access token');
    console.log('2. Set TOKEN environment variable: export TOKEN="your-token-here"');
    console.log('3. Run: node tests/socket-debug.js');
    process.exit(0);
  });
});

// If TOKEN is provided, test with it
if (process.env.TOKEN) {
  setTimeout(() => {
    console.log('\nTest 3: Connecting with provided token...');
    const socket3 = io('http://localhost:5000', {
      auth: {
        token: process.env.TOKEN
      },
      transports: ['polling', 'websocket']
    });
    
    socket3.on('connect', () => {
      console.log('✅ Successfully connected with valid token!');
      console.log('Socket ID:', socket3.id);
      socket3.disconnect();
      process.exit(0);
    });
    
    socket3.on('connect_error', (error) => {
      console.log('❌ Connection failed with provided token:', error.message);
      socket3.disconnect();
      process.exit(1);
    });
  }, 2000);
}
