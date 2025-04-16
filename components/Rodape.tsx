import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export default function Footer() {
  const router = useRouter(); 

  return (
    <View style={styles.footer}>
      {/* Botão Home */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(authenticated)/Dashboard')}
      >
        <Icon name="home" size={24} color="#2e3e5c" />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      {/* Botão Perfil */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(authenticated)/Perfil')}
      >
        <Icon name="person" size={24} color="#2e3e5c" />
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',   
    bottom: 0,              
    left: 0,               
    right: 0, 
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e3e5c',
    marginLeft: 5,
  },
});
