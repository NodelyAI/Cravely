// Test script for enhancedQRCodeGenerator function
const fetch = require('node-fetch');

async function testRealQRGenerator() {
  const functionUrl = 'https://us-central1-cravely-f2914.cloudfunctions.net/realQRGenerator';
  console.log('Testing real QR code function at:', functionUrl);
  
  const requestBody = {
    restaurantId: 'OctLgckMM9qzwkExWj51',
    tableLabels: ['Real QR Table 1', 'Real QR Table 2']
  };
  
  try {
    console.log('Sending request with payload:', JSON.stringify(requestBody));
    
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
      
      // Check if QR codes were generated successfully
      if (responseData.success && responseData.tables) {
        console.log('QR Codes generated successfully!');
        console.log('Table IDs:', Object.keys(responseData.tables));
        
        // Print the QR URLs for verification
        for (const [tableId, qrUrl] of Object.entries(responseData.tables)) {
          console.log(`Table ID: ${tableId}`);
          console.log(`QR URL: ${qrUrl}`);
          
          // Test if QR URL is accessible
          try {
            const qrResponse = await fetch(qrUrl);
            console.log(`QR image status: ${qrResponse.status} ${qrResponse.statusText}`);
            
            if (qrResponse.ok) {
              console.log('QR code image is accessible and valid');
            } else {
              console.error('QR code image is not accessible!');
            }
          } catch (qrError) {
            console.error('Error accessing QR code image:', qrError);
          }
        }
      }
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
    }
    
  } catch (error) {
    console.error('Error making request:', error);
  }
}

testRealQRGenerator();
