import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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

type Page = 'auth' | 'home' | 'profile' | 'group';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [groupCode, setGroupCode] = useState('');
  const [currentGroup, setCurrentGroup] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [myMicOn, setMyMicOn] = useState(false);
  const [myCameraOn, setMyCameraOn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: '',
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }
    setUser({ ...formData, avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}` });
    setCurrentPage('home');
    toast({
      title: '🎉 Вы успешно авторизовались!',
      description: 'Добро пожаловать в PhoneCall',
    });
  };

  const handleCreateGroup = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCurrentGroup(code);
    setGroupMembers([
      {
        name: user!.name,
        phone: user!.phone,
        avatar: user!.avatar,
        isMicOn: false,
        isCameraOn: false,
      },
    ]);
    setCurrentPage('group');
    toast({
      title: 'Группа создана!',
      description: `Код группы: ${code}`,
    });
  };

  const handleJoinGroup = () => {
    if (!groupCode) {
      toast({
        title: 'Ошибка',
        description: 'Введите код группы',
        variant: 'destructive',
      });
      return;
    }
    setCurrentGroup(groupCode);
    setGroupMembers([
      {
        name: user!.name,
        phone: user!.phone,
        avatar: user!.avatar,
        isMicOn: false,
        isCameraOn: false,
      },
      {
        name: 'Анна Смирнова',
        phone: '+7 999 111 22 33',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
        isMicOn: true,
        isCameraOn: true,
      },
    ]);
    setShowJoinDialog(false);
    setCurrentPage('group');
    toast({
      title: 'Вы присоединились к группе!',
      description: `Код: ${groupCode}`,
    });
  };

  const handleLeaveGroup = () => {
    setCurrentGroup(null);
    setGroupMembers([]);
    setMyMicOn(false);
    setMyCameraOn(false);
    setShowChat(false);
    setCurrentPage('home');
    toast({
      title: 'Вы покинули группу',
    });
  };

  const copyGroupCode = () => {
    navigator.clipboard.writeText(currentGroup!);
    toast({
      title: 'Код скопирован!',
      description: currentGroup,
    });
  };

  const toggleMic = () => {
    if (!myMicOn) {
      toast({
        title: 'Предоставьте разрешение',
        description: 'Разрешите доступ к микрофону в левом верхнем углу браузера',
      });
    }
    setMyMicOn(!myMicOn);
  };

  const toggleCamera = () => {
    if (!myCameraOn) {
      toast({
        title: 'Предоставьте разрешение',
        description: 'Разрешите доступ к камере в левом верхнем углу браузера',
      });
    }
    setMyCameraOn(!myCameraOn);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...formData, avatar: formData.avatar || user!.avatar });
    setIsEditProfile(false);
    toast({
      title: 'Профиль обновлён!',
    });
  };

  const startEditProfile = () => {
    setFormData({
      name: user!.name,
      phone: user!.phone,
      avatar: user!.avatar,
    });
    setIsEditProfile(true);
  };

  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-fade-in">
        <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-white/80 border-2 border-white/50 shadow-2xl animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary mb-4 animate-glow">
              <Icon name="Phone" size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              PhoneCall
            </h1>
            <p className="text-muted-foreground">Войдите, чтобы начать звонок</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-base font-semibold">Имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите ваше имя"
                className="mt-2 h-12 text-base border-2 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-base font-semibold">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 999 123 45 67"
                className="mt-2 h-12 text-base border-2 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="avatar" className="text-base font-semibold">Ссылка на аватар (опционально)</Label>
              <Input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="mt-2 h-12 text-base border-2 focus:border-primary"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              Войти
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-fade-in">
        <div className="max-w-7xl mx-auto p-6">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center animate-glow">
                <Icon name="Phone" size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PhoneCall
              </h1>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentPage('profile')}
                className="border-2 hover:border-primary hover:scale-105 transition-all"
              >
                <Icon name="User" size={20} className="mr-2" />
                Профиль
              </Button>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto mt-16">
            <Card
              onClick={handleCreateGroup}
              className="p-8 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 animate-slide-up"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Icon name="Plus" size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">Создать группу</h2>
                <p className="text-muted-foreground">Начните новый видео-звонок до 4 человек</p>
              </div>
            </Card>

            <Card
              onClick={() => setShowJoinDialog(true)}
              className="p-8 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                  <Icon name="Search" size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">Найти группу</h2>
                <p className="text-muted-foreground">Присоединитесь к звонку по коду</p>
              </div>
            </Card>
          </div>
        </div>

        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Введите код группы</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                placeholder="ABCDEF"
                className="h-12 text-center text-2xl font-bold tracking-widest"
                maxLength={6}
              />
              <Button onClick={handleJoinGroup} className="w-full h-12 bg-gradient-to-r from-accent to-primary">
                Присоединиться
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-fade-in">
        <div className="max-w-3xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('home')}
            className="mb-6 hover:scale-105 transition-transform"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>

          <Card className="p-8 backdrop-blur-xl bg-white/80 border-2 border-white/50 animate-scale-in">
            {!isEditProfile ? (
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-32 h-32 border-4 border-primary shadow-xl">
                    <AvatarImage src={user!.avatar} />
                    <AvatarFallback className="text-3xl">{user!.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-3xl font-black mb-2">{user!.name}</h2>
                    <p className="text-xl text-muted-foreground">{user!.phone}</p>
                  </div>
                </div>

                <Button
                  onClick={startEditProfile}
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-secondary"
                >
                  <Icon name="Edit" size={20} className="mr-2" />
                  Изменить профиль
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <h2 className="text-2xl font-bold mb-6">Редактирование профиля</h2>

                <div>
                  <Label htmlFor="edit-name" className="text-base font-semibold">Имя</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 h-12 text-base border-2"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-phone" className="text-base font-semibold">Номер телефона</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 h-12 text-base border-2"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-avatar" className="text-base font-semibold">Ссылка на аватар</Label>
                  <Input
                    id="edit-avatar"
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="mt-2 h-12 text-base border-2"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary">
                    Сохранить
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditProfile(false)}
                    className="flex-1 h-12 border-2"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    );
  }

  if (currentPage === 'group') {
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
              <div className="h-64 overflow-auto mb-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-center text-muted-foreground text-sm">Здесь будут сообщения чата</p>
              </div>
              <Input placeholder="Написать сообщение..." className="h-12" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
