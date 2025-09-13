import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { method } = req;
    const url = new URL(req.url);

    // Handle OAuth callback (GET request from Google)
    if (method === 'GET' && url.pathname.includes('/callback')) {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        return new Response(`
          <html>
            <body>
              <script>
                window.opener?.postMessage({ error: '${error}' }, '*');
                window.close();
              </script>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      if (!code || !state) {
        return new Response(`
          <html>
            <body>
              <script>
                window.opener?.postMessage({ error: 'Missing code or state' }, '*');
                window.close();
              </script>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      try {
        const redirectUri = `${url.origin}${url.pathname}`;
        
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          }),
        });

        const tokens = await tokenResponse.json();
        
        if (!tokens.access_token) {
          throw new Error('Failed to get access token');
        }

        // Get user's Gmail profile
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
          },
        });

        const profile = await profileResponse.json();

        // Store Gmail account in database
        const { error: insertError } = await supabase
          .from('gmail_accounts')
          .upsert({
            user_id: state,
            email_address: profile.email,
            display_name: profile.name,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString(),
            is_active: true,
            last_sync: new Date().toISOString(),
          }, {
            onConflict: 'user_id,email_address'
          });

        if (insertError) {
          console.error('Database error:', insertError);
          throw new Error('Failed to save Gmail account');
        }

        return new Response(`
          <html>
            <body>
              <script>
                window.opener?.postMessage({ 
                  success: true, 
                  email: '${profile.email}',
                  name: '${profile.name}' 
                }, '*');
                window.close();
              </script>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });

      } catch (error) {
        return new Response(`
          <html>
            <body>
              <script>
                window.opener?.postMessage({ error: '${error.message}' }, '*');
                window.close();
              </script>
            </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
    }

    // For POST requests, require authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (method === 'POST') {
      const body = await req.json();
      
      if (body.action === 'auth-url') {
        // Generate OAuth URL
        const redirectUri = `${url.origin}/functions/v1/gmail-oauth/callback`;
        const scope = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email';
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent(scope)}&` +
          `response_type=code&` +
          `access_type=offline&` +
          `prompt=consent&` +
          `state=${user.id}`;

        return new Response(JSON.stringify({ authUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('OAuth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});