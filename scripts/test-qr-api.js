// Test script for QR code generation API
const fetch = require('node-fetch');

async function testQRCodeAPI() {
  const functionUrl = 'https://us-central1-cravely-f2914.cloudfunctions.net/generateTableQRCodesHttpMock';
  console.log('Testing QR code function at:', functionUrl);
  
  const requestBody = {
    restaurantId: 'OctLgckMM9qzwkExWj51',
    tableLabels: ['Test Table 1']
  };
  
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    try {
      const responseData = JSON.parse(responseText);
      console.log('Parsed JSON response:', responseData);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
    }
    
  } catch (error) {
    console.error('Error making request:', error);
  }
}

testQRCodeAPI();
