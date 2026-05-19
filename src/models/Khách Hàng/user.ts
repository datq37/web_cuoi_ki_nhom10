import { useState } from 'react';

export default function useUserModel() {
  const [role, setRole] = useState<'employee'>('employee');
  const [currentUser, setCurrentUser] = useState({
    id: 'U1',
    avatar: 'MA',
    name: 'Nguyễn Minh Anh',
    phone: '0987654321',
    email: 'minhanh.nguyen@company.com',
    dept: 'IT / Engineering',
    building: 'Tòa nhà A',
    floor: 'Tầng 5',
    desk: 'Bàn 502'
  });

  const updateProfile = (newProfile: any) => {
    setCurrentUser(prev => ({
      ...prev,
      ...newProfile
    }));
  };

  return {
    role,
    setRole,
    currentUser,
    updateProfile
  };
}
