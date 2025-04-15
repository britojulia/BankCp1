import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function Receber() {
  const [carregando, setCarregando] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [apelido, setApelido] = useState('');

  const router = useRouter();

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      setCarregando(true);
      try {
        setTimeout(() => {
          setNomeUsuario('João Silva');
          setApelido('joaozinho');
          setCarregando(false);
        }, 1000);
      } catch (erro) {
        console.error('Erro ao carregar dados do usuário:', erro);
        Alert.alert('Erro', 'Não foi possível carregar seus dados');
        setCarregando(false);
      }
    };

    carregarDadosUsuario();
  }, []);

  const compartilharApelido = async () => {
    try {
      // Aqui você pode usar o `Share` do React Native
      Alert.alert('Compartilhar', `Apelido: ${apelido}`);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível compartilhar sua chave Pix');
    }
  };

  const copiarApelido = () => {
    Alert.alert('Copiado', 'Chave Pix copiada para a área de transferência');
  };

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>←</Text>
        </TouchableOpacity>
        <Text>Receber Dinheiro</Text>
      </View>

      {carregando ? (
        <View>
          <ActivityIndicator size="large" color="#4a7df3" />
          <Text>Carregando suas informações...</Text>
        </View>
      ) : (
        <View>
          <View>
            <Text>Receber como</Text>
            <Text>{nomeUsuario}</Text>
          </View>

          <View>
            <View>
              <Text>QR Code</Text>
              <Text>(Simulação)</Text>
            </View>
            <Text>Peça para a pessoa escanear este QR Code</Text>
          </View>

          <View>
            <Text>Seu Apelido</Text>
            <View>
              <Text>{apelido}</Text>
              <TouchableOpacity onPress={copiarApelido}>
                <Text>Copiar</Text>
              </TouchableOpacity>
            </View>
            <Text>Ou compartilhe seu apelido diretamente</Text>
            <TouchableOpacity onPress={compartilharApelido}>
              <Text>Compartilhar Apelido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
