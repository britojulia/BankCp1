import Footer from "@/components/Rodape";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";

export default function Perfil() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(false);

    const { token, usuario } = useAuth();

    const [nome, setNome] = useState(usuario?.nome || '');
    const [apelido, setApelido] = useState(usuario?.apelido || '');
    const [email, setEmail] = useState(usuario?.email || '');

    async function handleSalvar() {
        setCarregando(true);
        try {
            const response = await fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/contas/perfil", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome,
                    apelido,
                    email
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar dados');
            }

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        } catch (error) {
            Alert.alert('Erro');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.voltarButton}>
                <Text style={styles.voltarText}>← Voltar</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.title}>Perfil</Text>
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userName}>{usuario?.nome || 'Usuário'}</Text>
            </View>

            <View style={styles.formWrapper}>
                {/* Nome */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="black" 
                    value={nome}
                    onChangeText={setNome}
                    />
                </View>

                {/* Apelido */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Apelido</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Apelido"
                    placeholderTextColor="black" 
                    value={apelido}
                    onChangeText={setApelido}
                    />
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="black" 
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    />
                </View>

                <TouchableOpacity onPress={handleSalvar} disabled={carregando} style={[styles.button, carregando && styles.buttonDisabled]}>
                    <Text style={styles.buttonText}>{carregando ? 'Salvando...' : 'Salvar'}</Text>
                </TouchableOpacity>
                </View>

            
            <Footer/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    formWrapper: {
        paddingHorizontal: 22,
      },
      
    container: {
      gap: 2,
      flex: 1,
      padding: 24, // espaçamento lateral e vertical
      backgroundColor: '#ffffff',
      justifyContent: 'flex-start',
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
      alignItems: 'center',
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
      textAlign: 'center',
      marginBottom: 24,
    },
    userInfo: {
      marginBottom: 32,
      alignItems: 'center',
    },
    userName: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#ec0c7a', 
      marginBottom: 8,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: 'black',
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
  