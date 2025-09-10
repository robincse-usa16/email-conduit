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
    
    // Get the authorization header
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

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { gmail_account_id } = await req.json();

    if (!gmail_account_id) {
      return new Response(JSON.stringify({ error: 'Missing gmail_account_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Gmail account
    const { data: gmailAccount, error: accountError } = await supabase
      .from('gmail_accounts')
      .select('*')
      .eq('id', gmail_account_id)
      .eq('user_id', user.id)
      .single();

    if (accountError || !gmailAccount) {
      return new Response(JSON.stringify({ error: 'Gmail account not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Refresh token if needed
    let accessToken = gmailAccount.access_token;
    if (new Date(gmailAccount.token_expires_at) <= new Date()) {
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          refresh_token: gmailAccount.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      const refreshData = await refreshResponse.json();
      if (refreshData.access_token) {
        accessToken = refreshData.access_token;
        
        // Update token in database
        await supabase
          .from('gmail_accounts')
          .update({
            access_token: accessToken,
            token_expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
          })
          .eq('id', gmail_account_id);
      }
    }

    // Fetch emails from Gmail API
    const gmailResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=50',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const gmailData = await gmailResponse.json();
    
    if (!gmailData.messages) {
      return new Response(JSON.stringify({ 
        success: true, 
        synced: 0,
        message: 'No messages found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let syncedCount = 0;

    // Process each message
    for (const message of gmailData.messages.slice(0, 20)) { // Limit to 20 for performance
      try {
        // Get full message details
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const messageData = await messageResponse.json();
        const headers = messageData.payload.headers;
        
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
        const from = headers.find((h: any) => h.name === 'From')?.value || '';
        const to = headers.find((h: any) => h.name === 'To')?.value || '';
        const date = headers.find((h: any) => h.name === 'Date')?.value || '';

        // Extract body text
        let bodyText = '';
        let bodyHtml = '';
        
        if (messageData.payload.body?.data) {
          bodyText = atob(messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (messageData.payload.parts) {
          for (const part of messageData.payload.parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
              bodyText = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            } else if (part.mimeType === 'text/html' && part.body?.data) {
              bodyHtml = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            }
          }
        }

        // Check if email already exists
        const { data: existingEmail } = await supabase
          .from('emails')
          .select('id')
          .eq('gmail_account_id', gmail_account_id)
          .eq('gmail_message_id', message.id)
          .single();

        if (!existingEmail) {
          // Insert new email
          const { error: insertError } = await supabase
            .from('emails')
            .insert({
              gmail_account_id,
              gmail_message_id: message.id,
              thread_id: messageData.threadId,
              subject,
              sender: from,
              recipient: to,
              body_preview: bodyText.substring(0, 200),
              body_text: bodyText,
              body_html: bodyHtml,
              is_read: !messageData.labelIds.includes('UNREAD'),
              is_starred: messageData.labelIds.includes('STARRED'),
              is_important: messageData.labelIds.includes('IMPORTANT'),
              labels: messageData.labelIds,
              received_at: new Date(date).toISOString(),
            });

          if (!insertError) {
            syncedCount++;
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }

    // Update last sync time
    await supabase
      .from('gmail_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', gmail_account_id);

    return new Response(JSON.stringify({ 
      success: true, 
      synced: syncedCount,
      total: gmailData.messages.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});