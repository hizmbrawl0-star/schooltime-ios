import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { setupNotifications, scheduleAllNotifications, sendTestNotification } from '../utils/notifications';

export default function HomeScreen({ navigation }) {
  React.useEffect(() => {
    setupNotifications();
  }, []);

  const handleApply = async () => {
    await scheduleAllNotifications();
    Alert.alert(
      'ГОТОВО',
      'Расписание сохранено. Уведомления рассчитаны и запущены на всю неделю!',
      [{ text: 'ОТЛИЧНО', style: 'default' }]
    );
  };

  const handleTest = () => {
    sendTestNotification();
    Alert.alert('Ждите...', 'Сверните приложение. Уведомление придет через 3 секунды!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ШКОЛЬНОЕ ВРЕМЯ</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ScheduleSetup')}>
        <Text style={styles.buttonText}>1. РАСПИСАНИЕ ПО ДНЯМ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RoomsSetup')}>
        <Text style={styles.buttonText}>2. ВЫБОР КАБИНЕТОВ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TimeSetup')}>
        <Text style={styles.buttonText}>3. ВРЕМЯ И ПЕРЕМЕНЫ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.testButton]} onPress={handleTest}>
        <Text style={[styles.buttonText, styles.testButtonText]}>🔔 ПРОТЕСТИРОВАТЬ ПУШ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>АКТИВИРОВАТЬ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#fafafa' },
  title: { fontSize: 30, fontWeight: '700', textAlign: 'center', marginBottom: 40, color: '#111', letterSpacing: 1 },
  button: { backgroundColor: '#fff', padding: 16, borderWidth: 2, borderColor: '#333', marginVertical: 8, borderRadius: 12 },
  buttonText: { color: '#222', fontSize: 15, fontWeight: '600', textAlign: 'center', letterSpacing: 0.5 },
  testButton: { backgroundColor: '#f0f0f0', borderColor: '#aaa', marginTop: 25 },
  testButtonText: { color: '#444' },
  applyButton: { backgroundColor: '#111', padding: 18, marginVertical: 15, borderRadius: 12 },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center', letterSpacing: 1 }
});
