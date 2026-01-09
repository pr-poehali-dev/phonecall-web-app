import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import AuthPage from '@/components/AuthPage';
import HomePage from '@/components/HomePage';
import ProfilePage from '@/components/ProfilePage';
import GroupPage from '@/components/GroupPage';

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
  const [activeGroups, setActiveGroups] = useState<Map<string, GroupMember[]>>(new Map());
  const [myMicOn, setMyMicOn] = useState(false);
  const [myCameraOn, setMyCameraOn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ author: string; text: string; avatar: string }>>([]);
  const [messageText, setMessageText] = useState('');
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
    const newMember: GroupMember = {
      name: user!.name,
      phone: user!.phone,
      avatar: user!.avatar,
      isMicOn: false,
      isCameraOn: false,
    };
    
    const newGroups = new Map(activeGroups);
    newGroups.set(code, [newMember]);
    setActiveGroups(newGroups);
    
    setCurrentGroup(code);
    setGroupMembers([newMember]);
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
    
    const existingGroup = activeGroups.get(groupCode);
    if (!existingGroup) {
      toast({
        title: 'Такой комнаты не существует',
        description: 'Проверьте код и попробуйте снова',
        variant: 'destructive',
      });
      return;
    }
    
    if (existingGroup.length >= 4) {
      toast({
        title: 'Группа заполнена',
        description: 'В группе может быть максимум 4 человека',
        variant: 'destructive',
      });
      return;
    }
    
    const newMember: GroupMember = {
      name: user!.name,
      phone: user!.phone,
      avatar: user!.avatar,
      isMicOn: false,
      isCameraOn: false,
    };
    
    const updatedMembers = [...existingGroup, newMember];
    const newGroups = new Map(activeGroups);
    newGroups.set(groupCode, updatedMembers);
    setActiveGroups(newGroups);
    
    setCurrentGroup(groupCode);
    setGroupMembers(updatedMembers);
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

  const copyGroupCode = async () => {
    try {
      await navigator.clipboard.writeText(currentGroup!);
      toast({
        title: 'Код скопирован!',
        description: currentGroup!,
      });
    } catch (error) {
      toast({
        title: 'Не удалось скопировать',
        description: 'Скопируйте код вручную: ' + currentGroup,
        variant: 'destructive',
      });
    }
  };

  const toggleMic = async () => {
    if (!myMicOn) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMyMicOn(true);
        toast({
          title: 'Микрофон включен',
        });
      } catch (error) {
        toast({
          title: 'Доступ запрещен',
          description: 'Разрешите доступ к микрофону в настройках браузера',
          variant: 'destructive',
        });
      }
    } else {
      setMyMicOn(false);
    }
  };

  const toggleCamera = async () => {
    if (!myCameraOn) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setMyCameraOn(true);
        toast({
          title: 'Камера включена',
        });
      } catch (error) {
        toast({
          title: 'Доступ запрещен',
          description: 'Разрешите доступ к камере в настройках браузера',
          variant: 'destructive',
        });
      }
    } else {
      setMyCameraOn(false);
    }
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

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    setChatMessages([...chatMessages, {
      author: user!.name,
      text: messageText,
      avatar: user!.avatar,
    }]);
    setMessageText('');
  };

  const handleMessageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (currentPage === 'auth') {
    return (
      <AuthPage
        formData={formData}
        setFormData={setFormData}
        handleAuth={handleAuth}
      />
    );
  }

  if (currentPage === 'home') {
    return (
      <HomePage
        setCurrentPage={setCurrentPage}
        handleCreateGroup={handleCreateGroup}
        showJoinDialog={showJoinDialog}
        setShowJoinDialog={setShowJoinDialog}
        groupCode={groupCode}
        setGroupCode={setGroupCode}
        handleJoinGroup={handleJoinGroup}
      />
    );
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage
        user={user!}
        setCurrentPage={setCurrentPage}
        isEditProfile={isEditProfile}
        formData={formData}
        setFormData={setFormData}
        startEditProfile={startEditProfile}
        handleUpdateProfile={handleUpdateProfile}
        setIsEditProfile={setIsEditProfile}
      />
    );
  }

  if (currentPage === 'group') {
    return (
      <GroupPage
        groupMembers={groupMembers}
        copyGroupCode={copyGroupCode}
        handleLeaveGroup={handleLeaveGroup}
        showChat={showChat}
        setShowChat={setShowChat}
        toggleMic={toggleMic}
        toggleCamera={toggleCamera}
        myMicOn={myMicOn}
        myCameraOn={myCameraOn}
        chatMessages={chatMessages}
        messageText={messageText}
        setMessageText={setMessageText}
        sendMessage={sendMessage}
        handleMessageKeyPress={handleMessageKeyPress}
      />
    );
  }

  return null;
}
