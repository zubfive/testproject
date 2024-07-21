import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Timer({ onLogout }) {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  useEffect(() => {
    const timerRef = doc(db, 'timers', 'globalTimer');

    const unsubscribe = onSnapshot(timerRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setTime(data.time);
        setIsRunning(data.isRunning);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(async () => {
        setTime(async (prevTime) => {
          const newTime = prevTime - 1;
          await setDoc(doc(db, 'timers', 'globalTimer'), { time: newTime, isRunning: true });
          await AsyncStorage.setItem('time', newTime.toString());
          return newTime;
        });
      }, 1000);
    } else if (time === 0) {
      playAlarm();
      setIsRunning(false);
      AsyncStorage.setItem('isRunning', 'false');
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAlarm = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/alarm.mp3') // Replace with the path to your alarm sound file
    );
    setSound(sound);
    await sound.playAsync();
    setIsAlarmPlaying(true);
    Alert.alert('Time’s up!', 'Your timer is over.');
  };

  const stopAlarm = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsAlarmPlaying(false);
    }
  };

  const startTimer = async () => {
    setIsRunning(true);
    await AsyncStorage.setItem('isRunning', 'true');
    await setDoc(doc(db, 'timers', 'globalTimer'), { time, isRunning: true });
  };

  const setTimer = async (minutes) => {
    const newTime = minutes * 60;
    setTime(newTime);
    await AsyncStorage.setItem('time', newTime.toString());
    await AsyncStorage.setItem('isRunning', 'false');
    await setDoc(doc(db, 'timers', 'globalTimer'), { time: newTime, isRunning: false });
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalDuration = 25 * 60; // Total duration for the timer (25 minutes)

  return (
    <View style={styles.container}>
      <View style={styles.timerButtonsContainer}>
        <TouchableOpacity style={styles.timerButton} onPress={() => setTimer(25)}>
          <Text style={styles.timerButtonText}>Empty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timerButton} onPress={() => setTimer(15)}>
          <Text style={styles.timerButtonText}>Half</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.timeDisplayContainer}>
        <Text style={styles.timeText}>{formatTime(time)}</Text>
      </View>
      <View style={styles.testTubeContainer}>
        <Image
          source={{ uri: 'https://your-image-url.com/test-tube.png' }} // Replace with your test tube image URL
          style={styles.testTubeImage}
        />
        <View
          style={[
            styles.waterLevel,
            {
              height: `${((totalDuration - time) / totalDuration) * 100}%`
            }
          ]}
        />
      </View>
      <TouchableOpacity style={styles.startButton} onPress={startTimer}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
      {isAlarmPlaying && (
        <TouchableOpacity style={styles.stopButton} onPress={stopAlarm}>
          <Text style={styles.stopButtonText}>Stop Alarm</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  goalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  timerButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  timerButton: {
    backgroundColor: '#29B6F6',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  timeDisplayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  timeText: {
    fontSize: 48,
  },
  testTubeContainer: {
    position: 'relative',
    width: 150,
    height: 300,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  testTubeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  waterLevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E88E5', // Change this to your desired water color
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  startButton: {
    backgroundColor: '#4FC3F7',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  stopButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
