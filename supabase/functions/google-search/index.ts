import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRequest {
  inputType: 'wallet' | 'token' | 'dapp';
  inputValue: string;
  userId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { inputType, inputValue, userId }: SearchRequest = await req.json()

    if (!inputType || !inputValue) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if this input has been scanned before
    const { data: existingScan } = await supabase
      .from('search_results')
      .select('*')
      .eq('input_type', inputType)
      .eq('input_value', inputValue)
      .single()

    if (existingScan) {
      // Return existing scan result
      return new Response(
        JSON.stringify({ 
          scanResult: existingScan,
          isNewScan: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Perform Google search simulation (you would replace this with actual Google Search API)
    const searchQuery = `${inputValue} scam fraud fake malicious rug pull honeypot`
    
    // Simulate search results with flagged keywords
    const flaggedKeywords = ['scam', 'fraud', 'fake', 'malicious', 'rug pull', 'honeypot', 'phishing', 'unsafe']
    const detectedKeywords: string[] = []
    
    // Simple keyword detection simulation
    const searchResults = [
      { 
        title: `Analysis of ${inputValue}`, 
        snippet: inputValue.toLowerCase().includes('scam') 
          ? "Multiple users have reported this address as suspicious. Exercise extreme caution."
          : "No major red flags found in community reports.",
        url: `https://example.com/analysis/${inputValue}`
      }
    ]

    // Analyze content for red flags
    let isFlagged = false
    let riskScore = 25 // Base score

    if (inputValue.toLowerCase().includes('scam') || inputValue.toLowerCase().includes('fake')) {
      detectedKeywords.push('scam', 'fake')
      isFlagged = true
      riskScore = 85
    } else if (inputValue.toLowerCase().includes('test') || inputValue.length < 10) {
      detectedKeywords.push('suspicious')
      riskScore = 55
    }

    // Determine scan status
    let scanStatus: 'safe' | 'suspicious' | 'scam' = 'safe'
    if (riskScore >= 80) scanStatus = 'scam'
    else if (riskScore >= 50) scanStatus = 'suspicious'

    // Generate result summary
    const resultSummary = scanStatus === 'scam' 
      ? "HIGH RISK: Multiple indicators suggest this may be a scam. Do not interact."
      : scanStatus === 'suspicious'
      ? "CAUTION: Some suspicious patterns detected. Proceed with extreme caution."
      : "Analysis shows no major red flags, but always verify independently."

    // Save new scan result
    const { data: newScan, error } = await supabase
      .from('search_results')
      .insert({
        input_type: inputType,
        input_value: inputValue,
        result_summary: resultSummary,
        submitted_by: userId,
        google_snippets: searchResults,
        is_flagged: isFlagged,
        scan_status: scanStatus,
        flagged_keywords: detectedKeywords,
        risk_score: riskScore
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        scanResult: newScan,
        isNewScan: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in google-search function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})