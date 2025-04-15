import React, { useState } from "react";
import { ScrollView, SafeAreaView, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { router } from "expo-router";

export default function Registro() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View>
            <Text>Bem-vindo ao JuBank</Text>
            <Text>Crie uma conta gratuita para explorar diversas possibilidades com nosso banco!</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text>Nome Completo</Text>
            <TextInput placeholder="Digite seu nome completo" value={nome} onChangeText={setNome} autoCapitalize="words" />

            <Text>CPF</Text>
            <TextInput placeholder="123.456.789-00" value={cpf} onChangeText={setCpf} keyboardType="numeric" maxLength={14} />

            <Text>Apelido</Text>
            <TextInput placeholder="Como gostaria de ser chamado?" value={apelido} onChangeText={setApelido} />

            <Text>Senha</Text>
            <TextInput placeholder="mínimo de 6 caracteres" value={senha} onChangeText={setSenha} secureTextEntry />

            <TouchableOpacity>
              <Text>Cadastrar</Text>
            </TouchableOpacity>

            <View>
              <Text>Já possui uma conta?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text>Faça Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
