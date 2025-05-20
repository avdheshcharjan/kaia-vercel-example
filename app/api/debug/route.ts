import { NextResponse } from 'next/server';
import { getTransactionsByAccount } from '../../plugins/kaiascan/src/transactions/getTransactionsByAccount';
import { API_DEFAULTS } from '../../plugins/kaiascan/utils/constants';

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const address = url.searchParams.get('address') || '0x09e855b067bA0a5DcfC310E84fc4210B2448951C';
    const network = url.searchParams.get('network') || 'kairos';
    
    // Add your API key here for testing
    const KAIASCAN_API_KEY = process.env.KAIASCAN_API_KEY;
    
    // First check if the API endpoints are working
    const apiUrl = `${API_DEFAULTS.BASE_URL[network]}/${address}/txs?limit=10`;
    
    console.log('Testing API URL:', apiUrl);
    
    // Test the raw API call first
    const rawResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${KAIASCAN_API_KEY}`,
      },
    });
    
    // Check the raw response
    const rawStatus = rawResponse.status;
    const rawStatusText = rawResponse.statusText;
    let rawData = null;
    
    try {
      rawData = await rawResponse.json();
    } catch (e: any) {
      rawData = { error: 'Failed to parse response as JSON', message: e.message };
    }
    
    // Test the function directly
    const result = await getTransactionsByAccount(
      { address, network },
      { KAIA_KAIASCAN_API_KEY: KAIASCAN_API_KEY }
    );
    
    return NextResponse.json({
      success: true,
      apiDetails: {
        url: apiUrl,
        status: rawStatus,
        statusText: rawStatusText,
        response: rawData
      },
      result,
    });
  } catch (error: any) {
    console.error('Debug API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Unknown error',
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 