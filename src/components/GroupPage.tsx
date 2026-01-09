import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type User = {
  name: string;
  phone: string;
  avatar: string;
};

type GroupMember = User & {
  isMicOn: boolean;
  isCameraOn: boolean;
};

type GroupPageProps = {
  groupMembers: GroupMember[];
  copyGroupCode: () => void;
  handleLeaveGroup: () => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  myMicOn: boolean;
  myCameraOn: boolean;
  chatMessages: Array<{ author: string; text: string; avatar: string }>;
  messageText: string;
  setMessageText: (text: string) => void;
  sendMessage: () => void;
  handleMessageKeyPress: (e: React.KeyboardEvent) => void;
};

export default function GroupPage({
  groupMembers,
  copyGroupCode,
  handleLeaveGroup,
  showChat,
  setShowChat,
  toggleMic,
  toggleCamera,
  myMicOn,
  myCameraOn,
  chatMessages,
  messageText,
  setMessageText,
  sendMessage,
  handleMessageKeyPress,
}: GroupPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-fade-in">
      <div className="h-screen flex flex-col">
        <header className="p-4 bg-white/80 backdrop-blur-xl border-b-2 border-white/50 flex items-center justify-between">
          <Badge variant="secondary" className="text-sm font-bold px-4 py-2">
            <Icon name="Users" size={16} className="mr-2" />
            {groupMembers.length} участников
          </Badge>

          <div className="flex gap-3">
            <Button
              onClick={copyGroupCode}
              variant="outline"
              className="border-2 hover:scale-105 transition-transform"
            >
              <Icon name="Copy" size={18} className="mr-2" />
              Скопировать код
            </Button>
            <Button
              onClick={handleLeaveGroup}
              variant="destructive"
              className="hover:scale-105 transition-transform"
            >
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
            {groupMembers.map((member, idx) => (
              <Card
                key={idx}
                className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-white/20 overflow-hidden animate-scale-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {member.isCameraOn ? (
                    <div className="text-white text-center">
                      <Icon name="Video" size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Камера включена</p>
                    </div>
                  ) : (
                    <Avatar className="w-32 h-32 border-4 border-white/30">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-3xl">{member.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <Avatar className="w-8 h-8 border-2 border-white">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-semibold">{member.name}</span>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-2">
                  {member.isMicOn ? (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="Mic" size={20} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center">
                      <Icon name="MicOff" size={20} className="text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <footer className="p-6 bg-white/80 backdrop-blur-xl border-t-2 border-white/50">
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <Button
              onClick={() => setShowChat(!showChat)}
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 border-2 hover:scale-110 transition-transform"
            >
              <Icon name="MessageCircle" size={24} />
            </Button>

            <Button
              onClick={toggleMic}
              size="lg"
              className={`rounded-full w-16 h-16 hover:scale-110 transition-all ${
                myMicOn ? 'bg-primary' : 'bg-destructive'
              }`}
            >
              <Icon name={myMicOn ? 'Mic' : 'MicOff'} size={24} />
            </Button>

            <Button
              onClick={toggleCamera}
              size="lg"
              className={`rounded-full w-16 h-16 hover:scale-110 transition-all ${
                myCameraOn ? 'bg-primary' : 'bg-destructive'
              }`}
            >
              <Icon name={myCameraOn ? 'Video' : 'VideoOff'} size={24} />
            </Button>
          </div>
        </footer>

        {showChat && (
          <div className="fixed right-6 bottom-32 w-80 h-96 bg-white/95 backdrop-blur-xl border-2 border-white/50 rounded-2xl shadow-2xl p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Чат</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="hover:scale-110 transition-transform"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="h-64 overflow-auto mb-4 p-4 bg-muted/30 rounded-lg space-y-3">
              {chatMessages.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm">Здесь будут сообщения чата</p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2 animate-fade-in">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>{msg.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs font-semibold mb-1">{msg.author}</p>
                      <p className="text-sm bg-white p-2 rounded-lg shadow-sm">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Написать сообщение..."
                className="h-12 flex-1"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleMessageKeyPress}
              />
              <Button
                onClick={sendMessage}
                size="lg"
                className="h-12 w-12 p-0 rounded-full bg-gradient-to-r from-primary to-secondary"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
