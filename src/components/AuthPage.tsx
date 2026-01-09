import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

type AuthPageProps = {
  formData: { name: string; phone: string; avatar: string };
  setFormData: (data: { name: string; phone: string; avatar: string }) => void;
  handleAuth: (e: React.FormEvent) => void;
};

export default function AuthPage({ formData, setFormData, handleAuth }: AuthPageProps) {
  const [previewAvatar, setPreviewAvatar] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewAvatar(result);
        setFormData({ ...formData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-fade-in">
      <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-white/80 border-2 border-white/50 shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-4 animate-glow">
            <img src="https://cdn.poehali.dev/files/оплоуыдлпоуоупкпкуды.PNG" alt="PhoneCall" className="w-16 h-16" />
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
            <Label htmlFor="avatar" className="text-base font-semibold">Загрузить аватар (опционально)</Label>
            <div className="mt-2 flex items-center gap-4">
              {(previewAvatar || formData.avatar) && (
                <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarImage src={previewAvatar || formData.avatar} />
                  <AvatarFallback>{formData.name[0] || '?'}</AvatarFallback>
                </Avatar>
              )}
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="h-12 text-base border-2 focus:border-primary flex-1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
            Войти
          </Button>
        </form>
      </Card>
    </div>
  );
}