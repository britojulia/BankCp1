import React, { useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  StyleSheet
} from "react-native";
import { router, useRouter } from "expo-router";

export default function Registro() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();

  const formatarCPF = (texto: string) => {
    const numeros = texto.replace(/\D/g, '');
    let cpfFormatado = numeros;

    if (numeros.length > 3) cpfFormatado = numeros.substring(0, 3) + '.' + numeros.substring(3);
    if (numeros.length > 6) cpfFormatado = cpfFormatado.substring(0, 7) + '.' + numeros.substring(6);
    if (numeros.length > 9) cpfFormatado = cpfFormatado.substring(0, 11) + '-' + numeros.substring(9, 11);

    setCpf(cpfFormatado.substring(0, 14));
  };

  const handleCadastro = async () => {
    try {
      if (!nome || !cpf || !apelido || !senha) {
        Alert.alert('Todos os campos são obrigatórios');
        return;
      }

      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(cpf)) {
        Alert.alert('Erro', 'CPF inválido. Use o formato: 123.456.789-00');
        return;
      }

      if (senha.length < 6) {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
        return;
      }

      const userData = { nome, cpf, apelido, senha };

      const response = await fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/contas", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const dataError = await response.json();
        throw new Error(dataError?.message);
      }

      Alert.alert(
        'Cadastro realizado',
        `Usuário ${apelido} cadastrado com sucesso!`,
        [{ text: 'OK', onPress: () => router.push("/Dashboard") }]
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro inesperado';
      Alert.alert('Erro', msg);
    }
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo ao JuBank</Text>
            <Text style={styles.subtitle}>Crie uma conta gratuita para explorar diversas possibilidades com nosso banco!</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="black" 
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="123.456.789-00"
              placeholderTextColor="black" 
              value={cpf}
              onChangeText={formatarCPF}
              keyboardType="numeric"
              maxLength={14}
            />

            <Text style={styles.label}>Apelido</Text>
            <TextInput
              style={styles.input}
              placeholder="Como gostaria de ser chamado?"
              placeholderTextColor="black" 
              value={apelido}
              onChangeText={setApelido}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="mínimo de 6 caracteres"
              placeholderTextColor="black" 
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.loginRedirect}>
              <Text style={styles.redirectText}>Já possui uma conta?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Faça Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // REGISTRO
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    padding: 24,
    flexGrow: 1,
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
    color: 'black',
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
  button: {
    backgroundColor: '#ec0c7a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginRedirect: {
    marginTop: 24,
    alignItems: 'center',
  },
  redirectText: {
    fontSize: 14,
    color: '#7b8bb2',
  },
  loginLink: {
    fontSize: 14,
    color: '#ec0c7a',
    marginTop: 8,
    fontWeight: '500',
  },
});
