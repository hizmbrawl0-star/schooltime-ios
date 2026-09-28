import * as Notifications from 'expo-notifications';
import { getSchedule, getRooms, getTiming } from './storage';

export const setupNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Пожалуйста, разрешите уведомления в настройках телефона, иначе расписание не сработает!');
  }
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

export const sendTestNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Тестовый звонок 🔔',
      body: 'Уведомления работают отлично! Именно так будут приходить напоминания об уроках.',
      sound: 'default',
    },
    trigger: { seconds: 3 }, // Сработает через 3 секунды
  });
};

const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
};

export const scheduleAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  const schedule = await getSchedule();
  const rooms = await getRooms();
  const timing = await getTiming();
  
  if (!timing.startTime) return;
  
  const baseTime = parseTime(timing.startTime);

  for (let day = 1; day <= 5; day++) {
    const subjects = schedule[day];
    if (!subjects || subjects.length === 0) continue;
    
    let currentMinutesOfDay = baseTime.hours * 60 + baseTime.minutes;
    
    for (let i = 0; i < subjects.length; i++) {
      const currentSubject = subjects[i];
      const currentRoom = rooms[currentSubject] || '-';
      
      currentMinutesOfDay += timing.lessonDuration;
      const endHour = Math.floor(currentMinutesOfDay / 60) % 24;
      const endMinute = currentMinutesOfDay % 60;
      
      const breakDuration = timing.breaks[i] || 0;
      currentMinutesOfDay += breakDuration; 
      
      let title = '';
      let body = '';
      
      if (i < subjects.length - 1) {
        const nextSubject = subjects[i + 1];
        const nextRoom = rooms[nextSubject] || '-';
        title = `Урок окончен! Перемена ${breakDuration} мин.`;
        body = `Прошел: ${currentSubject} (Каб. ${currentRoom})\nСледующий: ${nextSubject} (Каб. ${nextRoom})`;
      } else {
        title = 'Уроки закончились! 🎉';
        body = `Прошел последний урок: ${currentSubject} (Каб. ${currentRoom}). Можно идти домой!`;
      }
      
      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: 'default' },
        trigger: { weekday: day + 1, hour: endHour, minute: endMinute, repeats: true },
      });
    }
  }
};
