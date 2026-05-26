export const getGreeting = (date = new Date()): string => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return 'Chào buổi sáng! ☀️';
  if (hour >= 11 && hour < 13) return 'Chào buổi trưa! 🍱';
  if (hour >= 13 && hour < 18) return 'Chào buổi chiều! 🌤️';
  return 'Chào buổi tối! 🌙';
};

export const formatMenuTime = (date: Date): string =>
  date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

export const formatMenuDate = (date: Date): string =>
  date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
