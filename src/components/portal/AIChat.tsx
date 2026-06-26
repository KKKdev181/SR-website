import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';
import { getAIResponse, Message } from '@/lib/ai';

interface AIChatProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AIChat({ open: openProp, onOpenChange }: AIChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a helpful assistant for the Elm Request Guide. Help users match their needs to the right request by using the request catalog.',
    },
    {
      role: 'assistant',
      content: "Hi! I'm here to help you find the right service request at Elm. What do you need assistance with?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const dialogOpen = openProp ?? open;
  const handleOpenChange = onOpenChange ?? setOpen;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const response = await getAIResponse([...messages, userMessage]);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon" className="fixed bottom-5 right-5 z-50 bg-primary text-primary-foreground shadow-lg shadow-slate-900/10 hover:bg-primary/90">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages
              .filter((message) => message.role !== 'system')
              .map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-900'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600">Thinking...</div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2 p-4 border-t border-slate-200">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your need..."
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
