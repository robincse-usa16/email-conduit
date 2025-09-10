import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Star, 
  Archive, 
  Trash2, 
  Reply, 
  ReplyAll, 
  Forward,
  Clock,
  User
} from 'lucide-react';

interface Email {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  body_preview: string;
  body_text: string;
  body_html: string;
  is_read: boolean;
  is_starred: boolean;
  is_important: boolean;
  labels: string[];
  received_at: string;
}

interface EmailViewerProps {
  email: Email | null;
  onBack: () => void;
}

const EmailViewer = ({ email, onBack }: EmailViewerProps) => {
  const [viewMode, setViewMode] = useState<'text' | 'html'>('text');

  if (!email) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <p>Select an email to view</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inbox
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Star className={`h-4 w-4 ${email.is_starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <CardTitle className="text-xl mb-2">{email.subject}</CardTitle>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{email.sender}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatDate(email.received_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {email.labels.map((label, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('text')}
            >
              Text
            </Button>
            <Button
              variant={viewMode === 'html' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('html')}
            >
              HTML
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-none">
            {viewMode === 'text' ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {email.body_text || email.body_preview}
              </pre>
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: email.body_html || email.body_text || email.body_preview 
                }}
              />
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-muted/20">
          <div className="flex items-center space-x-2">
            <Button variant="email" size="sm" className="flex-1">
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <ReplyAll className="h-4 w-4 mr-2" />
              Reply All
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailViewer;