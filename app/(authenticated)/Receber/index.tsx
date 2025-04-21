import Footer from '@/components/Rodape';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StyleSheet,
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
      Alert.alert('Compartilhar', `Apelido: ${apelido}`);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível compartilhar sua chave Pix');
    }
  };

  const copiarApelido = () => {
    Alert.alert('Copiado', 'Chave Pix copiada para a área de transferência');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarButton}>
            <Text style={styles.voltarText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Receber Dinheiro</Text>
        </View>

        {carregando ? (
          <View style={styles.carregandoContainer}>
            <ActivityIndicator size="large" color="#4a7df3" />
            <Text style={styles.carregandoText}>Carregando suas informações...</Text>
          </View>
        ) : (
          <View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadosTitle}>Receber como</Text>
              <Text style={styles.dadosText}>{nomeUsuario}</Text>
            </View>

            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>QR Code</Text>
              <Text style={styles.qrSubtitle}>(Simulação)</Text>
              <Text style={styles.qrText}>Peça para a pessoa escanear este QR Code</Text>
            </View>

            <View style={styles.apelidoContainer}>
              <Text style={styles.apelidoTitle}>Seu Apelido</Text>
              <View style={styles.apelidoContent}>
                <Text style={styles.apelidoText}>{apelido}</Text>
                <TouchableOpacity onPress={copiarApelido} style={styles.copiarButton}>
                  <Text style={styles.copiarText}>Copiar</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.apelidoShareText}>Ou compartilhe seu apelido diretamente</Text>
              <TouchableOpacity onPress={compartilharApelido} style={styles.compSharingButton}>
                <Text style={styles.compSharingText}>Compartilhar Apelido</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 16,
  },
  voltarButton: {
    marginBottom: 20,
  },
  voltarText: {
    fontSize: 16,
    color: '#ec0c7a',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e3e5c',
    marginBottom: 8,
    alignItems: 'center',
    
  },
  carregandoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  carregandoText: {
    fontSize: 16,
    color: '#7b8bb2',
    marginTop: 8,
  },
  dadosContainer: {
    marginBottom: 24,
  },
  dadosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e3e5c',
  },
  dadosText: {
    fontSize: 16,
    color: '#7b8bb2',
  },
  qrContainer: {
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e3e5c',
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#7b8bb2',
  },
  qrText: {
    fontSize: 16,
    color: '#7b8bb2',
    marginTop: 8,
  },
  apelidoContainer: {
    marginBottom: 24,
  },
  apelidoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e3e5c',
  },
  apelidoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  apelidoText: {
    fontSize: 16,
    color: '#2e3e5c',
    marginRight: 10,
  },
  copiarButton: {
    backgroundColor: '#ec0c7a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  copiarText: {
    color: '#ffffff',
    fontSize: 14,
  },
  apelidoShareText: {
    fontSize: 14,
    color: '#7b8bb2',
    marginTop: 8,
  },
  compSharingButton: {
    backgroundColor: '#ec0c7a',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  compSharingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
