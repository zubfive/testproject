import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Timer from './timer';
import { IMAGES } from './assets/images';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Audio } from 'expo-av';

const Stack = createStackNavigator();
const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const isRunning = await AsyncStorage.getItem('isRunning');
    const time = parseInt(await AsyncStorage.getItem('time'), 10);

    if (isRunning === 'true' && time > 0) {
      const newTime = time - 1;
      await AsyncStorage.setItem('time', newTime.toString());

      if (newTime === 0) {
        // Play alarm
        const { sound } = await Audio.Sound.createAsync(
          require('./assets/alarm.mp3') // Replace with the path to your alarm sound file
        );
        await sound.playAsync();
        await AsyncStorage.setItem('isRunning', 'false');
      }
    }

    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.log('Error in background task:', error);
    return BackgroundFetch.Result.Failed;
  }
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60, // fetch interval in seconds
    stopOnTerminate: false, // android only
    startOnBoot: true, // android only
  });
}

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    if (username === 'dineshhomes' && password === 'password') {
      try {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        Alert.alert('Login Successful', `Welcome, ${username}!`);
        navigation.navigate('Timer'); // Navigate to Timer screen
      } catch (e) {
        Alert.alert('Login Failed', 'An error occurred while logging in');
      }
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={IMAGES.LOGO} // Replace with your image URL
        style={styles.logo}
      />
      <Text style={styles.title}>Dinesh Homes</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}

function TimerScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.replace('Login'); // Navigate to Login screen
  };

  return <Timer onLogout={handleLogout} />;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('isLoggedIn');
        if (value === 'true') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        console.error('Failed to load login status.');
      }
      setIsLoading(false);
    };

    checkLoginStatus();
    registerBackgroundFetchAsync(); // Register the background fetch task
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Timer" : "Login"}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Remove the header
        />
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={{ headerShown: false }} // Remove the header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
