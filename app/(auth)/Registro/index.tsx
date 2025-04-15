import React, { useState } from "react";
import { ScrollView, SafeAreaView, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, Platform, Alert } from "react-native";
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
     if (numeros.length > 3) {
       cpfFormatado = numeros.substring(0, 3) + '.' + numeros.substring(3);
     }
     if (numeros.length > 6) {
       cpfFormatado = cpfFormatado.substring(0, 7) + '.' + numeros.substring(6);
     }
     if (numeros.length > 9) {
       cpfFormatado = cpfFormatado.substring(0, 11) + '-' + numeros.substring(9, 11);
     }
 
    
     cpfFormatado = cpfFormatado.substring(0, 14);
 
     setCpf(cpfFormatado);
   };
 
   // Validação e envio do formulário
   const handleCadastro = async () => {
    try {
      // Validação básica dos campos
      if (!nome || !cpf || !apelido || !senha) {
       Alert.alert('Todos os campos são obrigatórios');
       return;
     }
 
     // Validação de CPF (formato básico)
     const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
     if (!cpfRegex.test(cpf)) {
       Alert.alert('Erro', 'CPF inválido. Use o formato: 123.456.789-00');
       return;
     }
 
     // Validação de senha
     if (senha.length < 6) {
       Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
       return;
     }
 
     // Criar objeto com os dados do usuário
     const userData = {
       nome,
       cpf,
       apelido,
       senha
     };
 
     
     const response = await
       fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/contas", {
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
       [
         {
           text: 'OK',
           onPress: () => {
             router.push("/Login")
           }
         }
       ]
     );
    } catch (error) {
     Alert.alert(error?.message)
    }
   };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : 'height'} >
        <ScrollView>
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
            <TextInput placeholder="Como gostaria de ser chamado?" value={apelido} onChangeText={setApelido} autoCapitalize="none" />

            <Text>Senha</Text>
            <TextInput placeholder="mínimo de 6 caracteres" value={senha} onChangeText={setSenha} secureTextEntry />

            <TouchableOpacity onPress={handleCadastro}>
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
