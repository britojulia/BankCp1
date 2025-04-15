import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const { handleLogin } = useAuth();

  function submit(){
    handleLogin(apelido, senha)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.subtitle}>Entre na sua conta</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Apelido</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu apelido"
          value={apelido}
          onChangeText={setApelido}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={submit}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/Registro")}>
          <Text style={styles.link}>Cadastre-se</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // LOGIN
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e3e5c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7b8bb2',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: '#7b8bb2',
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2e3e5c',
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#ec0c7a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 14,
    color: '#ec0c7a',
    textAlign: 'center',
    marginTop: 12,
  },
});
