import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function Login() {
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View>
        <Text>Bem-vindo de volta</Text>
        <Text>Entre na sua conta</Text>
      </View>

      <View>
        <Text>Apelido</Text>
        <TextInput
          placeholder="Digite seu apelido"
          value={apelido}
          onChangeText={setApelido}
          autoCapitalize="none"
        />

        <Text>Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/Registro")}>
          <Text>Cadastre-se</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
