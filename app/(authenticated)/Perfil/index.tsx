import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

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
            const response = await fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/contas", {
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
        <SafeAreaView>
            <TouchableOpacity onPress={() => router.back()}>
                <Text>←</Text>
            </TouchableOpacity>

            <View>
                <Text>Profile</Text>
            </View>

            <View>
                <Text>{usuario?.nome || 'Usuário'}</Text>
            </View>

            <View>
                <Text>Nome</Text>
                <TextInput
                    placeholder="nome"
                    value={nome}
                    onChangeText={setNome}
                />
            </View>

            <View>
                <Text>Apelido</Text>
                <TextInput
                    placeholder="apelido"
                    value={apelido}
                    onChangeText={setApelido}
                />
            </View>

            <View>
                <Text>Email</Text>
                <TextInput
                    placeholder="email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>

            <TouchableOpacity onPress={handleSalvar} disabled={carregando}>
                <Text>{carregando ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
