import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { getSchedule, saveSchedule } from '../utils/storage';
import { SUBJECTS, DAYS } from '../utils/subjects';

export default function ScheduleSetupScreen() {
  const [schedule, setSchedule] = useState({});
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    getSchedule().then(data => setSchedule(data || {}));
  }, []);

  const addSubject = async (subject) => {
    const daySchedule = schedule[currentDay] || [];
    const newSchedule = { ...schedule, [currentDay]: [...daySchedule, subject] };
    setSchedule(newSchedule);
    await saveSchedule(newSchedule);
  };

  const clearDay = async () => {
    const newSchedule = { ...schedule, [currentDay]: [] };
    setSchedule(newSchedule);
    await saveSchedule(newSchedule);
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysRow}>
        {DAYS.map(day => (
          <TouchableOpacity 
            key={day.id} 
            style={[styles.dayTab, currentDay === day.id && styles.dayTabActive]}
            onPress={() => setCurrentDay(day.id)}
          >
            <Text style={[styles.dayText, currentDay === day.id && styles.dayTextActive]}>{day.short}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.leftPanel}>
          <Text style={styles.panelTitle}>УРОКИ ({DAYS.find(d => d.id === currentDay)?.short})</Text>
          <ScrollView style={styles.selectedList}>
            {(schedule[currentDay] || []).length === 0 && <Text style={styles.emptyText}>Нет уроков</Text>}
            {(schedule[currentDay] || []).map((sub, idx) => (
              <Text key={idx} style={styles.selectedSubject}>{idx + 1}. {sub}</Text>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.clearBtn} onPress={clearDay}>
            <Text style={styles.clearBtnText}>ОЧИСТИТЬ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightPanel}>
          <Text style={styles.panelTitle}>ДОБАВИТЬ</Text>
          <FlatList
            data={SUBJECTS}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.subjectItem} onPress={() => addSubject(item)}>
                <Text style={styles.subjectItemText}>{item}</Text>
                <Text style={styles.addIcon}>+</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  daysRow: { flexDirection: 'row', backgroundColor: '#111', paddingVertical: 12, paddingHorizontal: 5 },
  dayTab: { flex: 1, alignItems: 'center', paddingVertical: 10, marginHorizontal: 3, borderWidth: 1, borderColor: '#333', backgroundColor: '#fff', borderRadius: 8 },
  dayTabActive: { backgroundColor: '#333', borderColor: '#333' },
  dayText: { color: '#111', fontWeight: '700', fontSize: 14 },
  dayTextActive: { color: '#fff' },
  content: { flex: 1, flexDirection: 'row' },
  leftPanel: { flex: 1, padding: 12, borderRightWidth: 1, borderColor: '#ddd' },
  rightPanel: { flex: 1.5, padding: 12 },
  panelTitle: { fontWeight: '700', fontSize: 15, marginBottom: 15, textAlign: 'center', color: '#333' },
  selectedList: { flex: 1 },
  emptyText: { color: '#999', fontWeight: '600', textAlign: 'center', marginTop: 20 },
  selectedSubject: { fontSize: 15, fontWeight: '600', marginVertical: 8, color: '#111' },
  subjectItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  subjectItemText: { fontSize: 15, fontWeight: '500', color: '#222', flex: 1 },
  addIcon: { fontSize: 18, fontWeight: '600', color: '#666', marginLeft: 10 },
  clearBtn: { marginTop: 15, padding: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  clearBtnText: { color: '#555', textAlign: 'center', fontWeight: '700' }
});
