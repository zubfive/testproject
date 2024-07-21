// // LoginScreen.js
// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, Image } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { IMAGES } from './assets/images';

// function LoginScreen({ navigation }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async () => {
//     setIsLoading(true);
//     if (username === 'dineshhomes' && password === 'password') {
//       try {
//         await AsyncStorage.setItem('isLoggedIn', 'true');
//         Alert.alert('Login Successful', `Welcome, ${username}!`);
//         navigation.replace('Timer'); // Use replace to prevent going back to login screen
//       } catch (e) {
//         Alert.alert('Login Failed', 'An error occurred while logging in');
//       }
//     } else {
//       Alert.alert('Login Failed', 'Invalid username');

//       setIsLoading(false);
//     };
  
//     return (
//       <View style={styles.container}>
//         <Image
//           source={IMAGES.LOGO} // Replace with your image URL
//           style={styles.logo}
//         />
//         <Text style={styles.title}>Login</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Username"
//           value={username}
//           onChangeText={setUsername}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//         <Button title="Login" onPress={handleLogin} />
//         {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
//       </View>
//     );
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#fff',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: 20,
//     },
//     logo: {
//       width: 150,
//       height: 150,
//       marginBottom: 80,
//     },
//     title: {
//       fontSize: 24,
//       marginBottom: 20,
//     },
//     input: {
//       height: 40,
//       width: '100%',
//       borderColor: 'gray',
//       borderWidth: 1,
//       marginBottom: 20,
//       paddingHorizontal: 10,
//     },
//   });
// }
