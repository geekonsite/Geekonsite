const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sourceId, amountMoney, idempotencyKey } = await req.json()

    // Validate required fields
    if (!sourceId || !amountMoney || !idempotencyKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required payment fields' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Square credentials from environment
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN')
    const squareApplicationId = Deno.env.get('SQUARE_APPLICATION_ID')
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID')

    if (!squareAccessToken || !squareApplicationId || !squareLocationId) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Square configuration not found. Please configure SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID, and SQUARE_LOCATION_ID in your Supabase project settings under Edge Functions.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Determine if we're using sandbox or production based on application ID
    const isSandbox = squareApplicationId.startsWith('sandbox-sq0idb-');
    const squareApiUrl = isSandbox 
      ? 'https://connect.squareupsandbox.com/v2/payments'
      : 'https://connect.squareup.com/v2/payments';

    // Process payment with Square Payments API
    const squareResponse = await fetch(squareApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify({
        source_id: sourceId,
        amount_money: amountMoney,
        idempotency_key: idempotencyKey,
        location_id: squareLocationId,
        note: 'GeekOnSite Solutions Subscription Payment'
      })
    })

    const squareResult = await squareResponse.json()

    if (!squareResponse.ok) {
      console.error('Square payment error:', squareResult)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: squareResult.errors?.[0]?.detail || 'Payment processing failed' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Payment successful
    console.log('Payment processed successfully:', squareResult.payment.id)

    // In a real application, you would:
    // 1. Store the payment record in your database
    // 2. Create or update the customer subscription
    // 3. Send confirmation emails
    // 4. Update customer account status

    return new Response(
      JSON.stringify({ 
        success: true,
        payment: squareResult.payment,
        message: `Payment processed successfully${isSandbox ? ' (Sandbox Mode)' : ''}`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Payment processing failed. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})