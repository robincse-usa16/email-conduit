import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface GmailAccount {
  id: string;
  email_address: string;
  display_name: string;
  is_active: boolean;
  last_sync: string;
  created_at: string;
}

interface Email {
  id: string;
  subject: string;
  sender: string;
  body_preview: string;
  is_read: boolean;
  is_starred: boolean;
  received_at: string;
  gmail_account_id: string;
  body_html?: string;
  body_text?: string;
  recipient?: string;
  is_important?: boolean;
  labels?: string[];
  thread_id?: string;
  gmail_message_id: string;
}

export const useGmailAccounts = () => {
  const [accounts, setAccounts] = useState<GmailAccount[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchAccounts = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('gmail_accounts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Gmail accounts",
        variant: "destructive"
      });
    }
  };

  const fetchEmails = async (accountId?: string) => {
    if (!session?.user) return;

    try {
      let query = supabase
        .from('emails')
        .select(`
          *,
          gmail_accounts!inner(user_id)
        `)
        .eq('gmail_accounts.user_id', session.user.id)
        .order('received_at', { ascending: false })
        .limit(50);

      if (accountId) {
        query = query.eq('gmail_account_id', accountId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast({
        title: "Error", 
        description: "Failed to fetch emails",
        variant: "destructive"
      });
    }
  };

  const addGmailAccount = async () => {
    if (!session?.access_token) return;

    try {
      // Get OAuth URL
      const response = await supabase.functions.invoke('gmail-oauth', {
        body: { action: 'auth-url' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;

      const { authUrl } = response.data;
      
      // Open OAuth popup
      const popup = window.open(authUrl, 'gmail-oauth', 'width=500,height=600');
      
      // Listen for messages from popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.success) {
          toast({
            title: "Success",
            description: `Connected Gmail account: ${event.data.email}`,
          });
          // Refresh accounts after successful OAuth
          fetchAccounts();
          fetchEmails();
        } else if (event.data.error) {
          toast({
            title: "Error",
            description: event.data.error,
            variant: "destructive"
          });
        }
        
        window.removeEventListener('message', messageListener);
      };
      
      window.addEventListener('message', messageListener);
      
      // Also check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
        }
      }, 1000);

    } catch (error) {
      console.error('Error adding Gmail account:', error);
      toast({
        title: "Error",
        description: "Failed to add Gmail account",
        variant: "destructive"
      });
    }
  };

  const syncAccount = async (accountId: string) => {
    if (!session?.access_token) return;

    setSyncing(true);
    try {
      const response = await supabase.functions.invoke('gmail-sync', {
        body: { gmail_account_id: accountId },
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;

      const { synced, total } = response.data;
      
      toast({
        title: "Sync Complete",
        description: `Synced ${synced} of ${total} emails`,
      });

      // Refresh data
      await Promise.all([fetchAccounts(), fetchEmails()]);

    } catch (error) {
      console.error('Error syncing account:', error);
      toast({
        title: "Error",
        description: "Failed to sync Gmail account", 
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchAccounts();
      fetchEmails();
      setLoading(false);

      // Set up realtime subscriptions
      const accountsSubscription = supabase
        .channel('gmail_accounts_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'gmail_accounts',
          filter: `user_id=eq.${session.user.id}`
        }, () => {
          fetchAccounts();
        })
        .subscribe();

      const emailsSubscription = supabase
        .channel('emails_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public', 
          table: 'emails'
        }, () => {
          fetchEmails();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(accountsSubscription);
        supabase.removeChannel(emailsSubscription);
      };
    }
  }, [session?.user]);

  return {
    accounts,
    emails,
    loading,
    syncing,
    addGmailAccount,
    syncAccount,
    fetchEmails,
    refetch: () => Promise.all([fetchAccounts(), fetchEmails()])
  };
};