import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { getSchedule, getRooms, saveRooms } from '../utils/storage';

export default function RoomsSetupScreen() {
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [rooms, setRooms] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const schedule = await getSchedule();
    const savedRooms = await getRooms();
    
    const subjectsSet = new Set();
    Object.values(schedule).forEach(daySubjects => {
      daySubjects.forEach(sub => subjectsSet.add(sub));
    });
    
    setUniqueSubjects(Array.from(subjectsSet));
    setRooms(savedRooms || {});
  };

  const updateRoom = async (subject, roomNumber) => {
    const newRooms = { ...rooms, [subject]: roomNumber };
    setRooms(newRooms);
    await saveRooms(newRooms);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.info}>
          НАЙДЕНО ПРЕДМЕТОВ: {uniqueSubjects.length}
        </Text>
        <Text style={styles.subInfo}>
          Впишите номер кабинета рядом с каждым предметом.
        </Text>
      </View>
      
      {uniqueSubjects.map((sub, index) => (
        <View key={sub} style={styles.row}>
          <Text style={styles.subjectText}>{index + 1}. {sub}</Text>
          <TextInput
            style={styles.input}
            placeholder="Каб."
            placeholderTextColor="#aaa"
            value={rooms[sub] || ''}
            onChangeText={(text) => updateRoom(sub, text)}
          />
        </View>
      ))}

      {uniqueSubjects.length === 0 && (
        <Text style={styles.emptyText}>Сначала добавьте уроки в разделе Расписание.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fafafa' },
  headerBox: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  info: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 5 },
  subInfo: { fontSize: 14, fontWeight: '500', color: '#666' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderColor: '#eee' },
  subjectText: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1, marginRight: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, width: 80, textAlign: 'center', fontSize: 15, fontWeight: '600', color: '#111', backgroundColor: '#fff' },
  emptyText: { fontSize: 15, fontWeight: '600', textAlign: 'center', marginTop: 40, color: '#888' }
});
