import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEDULE_KEY = '@school_schedule';
const ROOMS_KEY = '@school_rooms';
const TIMING_KEY = '@school_timing';

export const saveSchedule = async (schedule) => {
  await AsyncStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
};

export const getSchedule = async () => {
  const data = await AsyncStorage.getItem(SCHEDULE_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveRooms = async (rooms) => {
  await AsyncStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

export const getRooms = async () => {
  const data = await AsyncStorage.getItem(ROOMS_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveTiming = async (timing) => {
  await AsyncStorage.setItem(TIMING_KEY, JSON.stringify(timing));
};

export const getTiming = async () => {
  const data = await AsyncStorage.getItem(TIMING_KEY);
  // default timing structure
  return data ? JSON.parse(data) : {
    startTime: '08:00',
    lessonDuration: 45,
    breaks: [] // e.g., [10, 15, 10, 20] means 10m after 1st, 15m after 2nd, etc.
  };
};
