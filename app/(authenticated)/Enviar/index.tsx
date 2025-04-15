import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Enviar() {
  const [emailDestino, setEmailDestino] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [token, setToken] = useState('');
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const formatarValor = (texto: string) => {
    const apenasNumeros = texto.replace(/[^\d]/g, '');
    if (apenasNumeros) {
      const valorNumerico = parseFloat(apenasNumeros) / 100;
      setValor(valorNumerico.toFixed(2).replace('.', ','));
    } else {
      setValor('');
    }
  };

  const enviarTransacao = async () => {
    if (!emailDestino.trim()) {
      Alert.alert('Erro', 'Informe o e-mail do destinatário');
      return;
    }

    if (!valor) {
      Alert.alert('Erro', 'Informe o valor da transação');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'O valor deve ser maior que zero');
      return;
    }

    const dados = {
      emailDestino,
      valor: valorNumerico,
      descricao,
    };

    setCarregando(true);

    try {
      const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        throw new Error('Erro na requisição');
      }

      const resultado = await resposta.json();

      Alert.alert('Sucesso', 'Transação realizada com sucesso', [
        { text: 'OK', onPress: () => router.push('/Dashboard') },
      ]);
    } catch (erro) {
      console.error(erro);
      Alert.alert('Erro', 'Não foi possível realizar a transação');
    } finally {
      setCarregando(false);
    }
  };

  const getToken = async () => {
    const t = await AsyncStorage.getItem("@token");

    if (!t) {
      router.push("/Login");
      return;
    }

    setToken(t);
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Text>← Voltar</Text>
        </TouchableOpacity>

        <Text>Transferir Dinheiro</Text>
        <Text>Protegido</Text>

        {/* Valor */}
        <View>
          <Text>Digite o valor</Text>
          <TextInput
            placeholder="0,00"
            keyboardType="numeric"
            value={valor}
            onChangeText={formatarValor}
          />
        </View>

        {/* E-mail do destinatário */}
        <View>
          <Text>Para quem você deseja enviar?</Text>
          <TextInput
            placeholder="E-mail do destinatário"
            value={emailDestino}
            onChangeText={setEmailDestino}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Descrição */}
        <View>
          <Text>Descrição (opcional)</Text>
          <TextInput
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        {/* Botão */}
        <TouchableOpacity onPress={enviarTransacao} disabled={carregando}>
          {carregando ? (
            <Text>Enviando...</Text>
          ) : (
            <Text>Enviar Dinheiro</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
