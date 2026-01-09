import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type User = {
  name: string;
  phone: string;
  avatar: string;
};

type ProfilePageProps = {
  user: User;
  setCurrentPage: (page: 'auth' | 'home' | 'profile' | 'group') => void;
  isEditProfile: boolean;
  formData: { name: string; phone: string; avatar: string };
  setFormData: (data: { name: string; phone: string; avatar: string }) => void;
  startEditProfile: () => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  setIsEditProfile: (value: boolean) => void;
};

export default function ProfilePage({
  user,
  setCurrentPage,
  isEditProfile,
  formData,
  setFormData,
  startEditProfile,
  handleUpdateProfile,
  setIsEditProfile,
}: ProfilePageProps) {
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
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-3xl font-black mb-2">{user.name}</h2>
                  <p className="text-xl text-muted-foreground">{user.phone}</p>
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
