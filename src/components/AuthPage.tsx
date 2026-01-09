import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type AuthPageProps = {
  formData: { name: string; phone: string; avatar: string };
  setFormData: (data: { name: string; phone: string; avatar: string }) => void;
  handleAuth: (e: React.FormEvent) => void;
};

export default function AuthPage({ formData, setFormData, handleAuth }: AuthPageProps) {
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
