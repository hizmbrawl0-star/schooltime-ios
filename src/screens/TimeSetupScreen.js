import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { getTiming, saveTiming, getSchedule } from '../utils/storage';

export default function TimeSetupScreen() {
  const [timing, setTiming] = useState({ startTime: '08:00', lessonDuration: 45, breaks: [] });
  const [maxLessons, setMaxLessons] = useState(8);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const t = await getTiming();
    const sched = await getSchedule();
    
    let max = 0;
    Object.values(sched).forEach(day => {
      if (day.length > max) max = day.length;
    });
    const lessonsCount = max > 0 ? max : 8;
    setMaxLessons(lessonsCount);
    
    const currentBreaks = t.breaks || [];
    while (currentBreaks.length < lessonsCount) {
      currentBreaks.push(10);
    }
    t.breaks = currentBreaks;
    
    setTiming({ ...t });
  };

  const updateBreak = (index, val) => {
    const newBreaks = [...timing.breaks];
    newBreaks[index] = val; 
    const newTiming = { ...timing, breaks: newBreaks };
    setTiming(newTiming);
    
    const safeBreaks = newBreaks.map(b => parseInt(b) || 0);
    saveTiming({ ...newTiming, breaks: safeBreaks });
  };

  const updateBaseTime = (key, val) => {
    const newTiming = { ...timing, [key]: val };
    setTiming(newTiming);
    
    if (key === 'lessonDuration') {
      saveTiming({ ...newTiming, lessonDuration: parseInt(val) || 0 });
    } else {
      saveTiming(newTiming);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.label}>Начало первого урока (ЧЧ:ММ):</Text>
        <TextInput 
          style={styles.inputMain} 
          value={timing.startTime} 
          onChangeText={(val) => updateBaseTime('startTime', val)}
          placeholder="08:00"
          placeholderTextColor="#aaa"
        />
        
        <Text style={styles.label}>Длительность урока (мин):</Text>
        <TextInput 
          style={styles.inputMain} 
          value={String(timing.lessonDuration)} 
          onChangeText={(val) => updateBaseTime('lessonDuration', val)}
          keyboardType="numeric"
          placeholder="45"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={styles.breaksTitle}>Перемены (в минутах):</Text>
      
      {Array.from({ length: Math.max(0, maxLessons - 1) }).map((_, idx) => (
        <View key={idx} style={styles.breakRow}>
          <Text style={styles.breakText}>После {idx + 1}-го урока</Text>
          <TextInput
            style={styles.inputSmall}
            value={String(timing.breaks[idx] !== undefined ? timing.breaks[idx] : '')}
            onChangeText={(val) => updateBreak(idx, val)}
            keyboardType="numeric"
            placeholder="10"
            placeholderTextColor="#aaa"
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fafafa' },
  headerBox: { paddingBottom: 20, marginBottom: 20, borderBottomWidth: 1, borderColor: '#ddd' },
  label: { fontSize: 15, fontWeight: '700', marginTop: 15, color: '#333' },
  inputMain: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, fontSize: 18, fontWeight: '600', marginTop: 8, color: '#111', backgroundColor: '#fff' },
  breaksTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#222' },
  breakRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  breakText: { fontSize: 15, fontWeight: '600', color: '#444' },
  inputSmall: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, width: 70, textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#111', backgroundColor: '#fff' }
});
