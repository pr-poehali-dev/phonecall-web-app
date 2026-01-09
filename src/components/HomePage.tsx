import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

type HomePageProps = {
  setCurrentPage: (page: 'auth' | 'home' | 'profile' | 'group') => void;
  handleCreateGroup: () => void;
  showJoinDialog: boolean;
  setShowJoinDialog: (show: boolean) => void;
  groupCode: string;
  setGroupCode: (code: string) => void;
  handleJoinGroup: () => void;
};

export default function HomePage({
  setCurrentPage,
  handleCreateGroup,
  showJoinDialog,
  setShowJoinDialog,
  groupCode,
  setGroupCode,
  handleJoinGroup,
}: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-fade-in">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center animate-glow">
              <img src="https://cdn.poehali.dev/files/оплоуыдлпоуоупкпкуды.PNG" alt="PhoneCall" className="w-12 h-12" />
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