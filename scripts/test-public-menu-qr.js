const fetch = require('node-fetch');

// Function to test the publicMenuQRGenerator cloud function
async function testPublicMenuQRGenerator() {
  // URL for the Cloud Function
  const functionUrl = 'https://us-central1-cravely-f2914.cloudfunctions.net/publicMenuQRGenerator';
  
  // Sample restaurant ID (replace with a valid ID from your Firestore)
  const restaurantId = 'test-restaurant-' + Date.now();
  
  // Sample table labels
  const tableLabels = ['Table A', 'Table B', 'Counter 1'];
  
  // Request body
  const requestBody = {
    restaurantId,
    tableLabels
  };
  
  console.log('Testing publicMenuQRGenerator function with:', requestBody);
  
  try {
    // Make the request to the Cloud Function
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Log the response status
    console.log('Response status:', response.status);
    
    // If response is not OK, get error details
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      try {
        // Try to parse as JSON
        const errorJson = JSON.parse(errorText);
        console.error('Server error:', errorJson.message || errorJson.error);
      } catch (e) {
        // If not valid JSON, log the raw text
        console.error('Raw error:', errorText);
      }
      return;
    }
    
    // Parse and log the successful response
    const responseData = await response.json();
    console.log('Success! Created QR codes for tables:');
    
    // Print out the results in a readable format
    if (responseData.tables) {
      Object.entries(responseData.tables).forEach(([tableId, qrUrl]) => {
        console.log(`- Table ID: ${tableId}`);
        console.log(`  QR URL: ${qrUrl}`);
        console.log(`  This QR code links to: https://cravely.app/r/${restaurantId}/t/${tableId}/menu`);
        console.log('');
      });
    }
    
    console.log('Summary:', responseData.message);
  } catch (error) {
    console.error('Error testing function:', error);
  }
}

// Run the test
testPublicMenuQRGenerator().then(() => {
  console.log('Test completed.');
});
