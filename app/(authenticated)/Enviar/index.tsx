import Footer from "@/components/Rodape";
import { useAuth } from "@/hooks/useAuth";
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
  StyleSheet,
} from "react-native";

export default function Enviar() {
  const [contaDestino, setContaDestino] = useState('');
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
    if (!contaDestino.trim()) {
      Alert.alert('Erro', 'Informe a conta de destino');
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
      contaDestino, 
      valor: valorNumerico,
      descricao,
    };

    setCarregando(true);

    try {
      const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      router.push("/Dashboard");
      return;
    }

    setToken(t);
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.voltarButton}>
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Transferir Dinheiro</Text>
        <Text style={styles.subtitle}>Protegido</Text>

        {/* Valor */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Digite o valor</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            keyboardType="numeric"
            value={valor}
            onChangeText={formatarValor}
          />
        </View>

        {/* Conta de destino */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Para quem você deseja enviar?</Text>
          <TextInput
            style={styles.input}
            placeholder="Conta de destino"
            value={contaDestino}
            onChangeText={setContaDestino}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Descrição */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        {/* Botão */}
        <TouchableOpacity
          onPress={enviarTransacao}
          disabled={carregando}
          style={[styles.button, carregando && styles.buttonDisabled]}
        >
          {carregando ? (
            <Text style={styles.buttonText}>Enviando...</Text>
          ) : (
            <Text style={styles.buttonText}>Enviar Dinheiro</Text>
          )}
        </TouchableOpacity>
        <Footer />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'flex-start', 
  },
  voltarButton: {
    marginBottom: 20,
  },
  voltarText: {
    fontSize: 16,
    color: '#ec0c7a',
  },
  
  titlesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e3e5c',
    marginBottom: 8,
    textAlign: 'center', 
  },
  subtitle: {
    fontSize: 16,
    color: '#ec0c7a',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    marginHorizontal: 16, 
  },
  label: {
    fontSize: 14,
    color: '#7b8bb2',
    marginBottom: 8,
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
    marginTop: 24,
    marginHorizontal: 16, 
  },
  buttonDisabled: {
    backgroundColor: '#b0c4de',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});