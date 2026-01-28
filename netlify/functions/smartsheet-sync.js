// Netlify serverless function example for Smartsheet integration
// Add your Smartsheet API logic here

export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const data = JSON.parse(event.body)
    
    // Example: Send job card data to Smartsheet
    // const SMARTSHEET_API_KEY = process.env.SMARTSHEET_API_KEY
    // const SMARTSHEET_SHEET_ID = process.env.SMARTSHEET_SHEET_ID
    
    // Implement Smartsheet API call here
    // const response = await fetch(`https://api.smartsheet.com/2.0/sheets/${SMARTSHEET_SHEET_ID}/rows`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${SMARTSHEET_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ toTop: true, rows: [{ cells: data.cells }] })
    // })

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Data received successfully',
        data 
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
