import Footer from "@/components/Rodape";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, SafeAreaView, StatusBar, Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface ITransacoesProps {
    contraparte: {
        apelido: string;
        nome: string;
    },
    data: string;
    descricao: string;
    id: number;
    tipo: string;
    valor: number;
}

export default function Dashboard() {

    
const [saldo, setSaldo] = useState(0);
const [transacoes, setTransacoes] = useState<ITransacoesProps[]>([]);
const [carregandoSaldo, setCarregandoSaldo] = useState(true);
const [carregandoTransacoes, setCarregandoTransacoes] = useState(true);
const [atualizando, setAtualizando] = useState(false);

const { token, usuario } = useAuth();
const router = useRouter();

// Função para formatar valores monetários
const formatarMoeda = (valor: string) => {
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
};

// Função para formatar data
const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
};

// Função para buscar o saldo
const buscarSaldo = async () => {
    if (token === "") {
        return;
    }

    setCarregandoSaldo(true);
    try {
        const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/contas/saldo', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const dados = await resposta.json();
        setSaldo(dados.saldo);
    } catch (erro) {
        console.error('Erro ao buscar saldo:', erro);
        Alert.alert('Erro', 'Não foi possível carregar seu saldo');
    } finally {
        setCarregandoSaldo(false);
    }
};

// Função para buscar transações
const buscarTransacoes = async () => {
    if (token === "") {
        return;
    }

    setCarregandoTransacoes(true);
    try {
        const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/contas/resumos-transacoes', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const dados = await resposta.json();
        setTransacoes(dados);
    } catch (erro) {
        console.error('Erro ao buscar transações:', erro);
        Alert.alert('Erro', 'Não foi possível carregar suas transações');
    } finally {
        setCarregandoTransacoes(false);
    }
};

// Função para atualizar os dados ao puxar para baixo
const onRefresh = async () => {
    setAtualizando(true);
    await Promise.all([buscarSaldo(), buscarTransacoes()]);
    setAtualizando(false);
};

// Carregar dados ao montar o componente
useEffect(() => {
    buscarSaldo();
    buscarTransacoes();
}, [token]);

// Renderiza cada item da lista de transações
const renderTransacao = ({ item }: { item: ITransacoesProps }) => {
    const isEntrada = item.tipo === 'recebida';

    return (
        <View style={styles.transacaoItem}>
            <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
            <Text style={styles.transacaoValor}>{isEntrada ? `+${formatarMoeda(String(item.valor))}` : `-${formatarMoeda(String(item.valor))}`}</Text>
            <Text style={styles.transacaoData}>{formatarData(item.data)}</Text>
        </View>
    );
};

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <View  style={styles.userInfo}>
                <Text style={styles.title}>Olá! 👋 </Text>
                <Text style={styles.subtitle}>{usuario?.nome}</Text>
                </View>
               
            

            {/* Saldo */}
            <View style={styles.cardSaldo}>
                <Text style={styles.tituloSaldo}>Saldo total</Text>
                <View style={styles.cardConteudo}>
                    {carregandoSaldo ? (
                        <ActivityIndicator size="large" color="#4a7df3" />
                    ) : (
                        <Text style={styles.valorSaldo}>{formatarMoeda(String(saldo))}</Text>
                    )}
                </View>
                <TouchableOpacity onPress={buscarSaldo}>
                    <Text style={styles.buttonAtualizar}>Atualizar</Text>
                </TouchableOpacity>
            </View>

            {/* Transferir / Receber */}
            <View style={styles.botoesTransacao}>
                <TouchableOpacity onPress={() => router.push('/Enviar')} style={styles.button}>
                    <Text style={styles.buttonText}>Transferir →</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/Receber')} style={styles.button}>
                    <Text style={styles.buttonText}>Receber ←</Text>
                </TouchableOpacity>
            </View>
            </View>

            {/* Transações */}
            <View style={styles.transacoesContainer}>
                <View style={styles.transacoesHeader}>
                    <Text style={styles.tituloTransacoes}>Transações</Text>
                    <TouchableOpacity onPress={() => router.push('/Transictions/Transictions')}>
                        <Text style={styles.redirectText}>Ver todas</Text>
                    </TouchableOpacity>
                </View>

                {carregandoTransacoes ? (
                    <ActivityIndicator style={styles.carregando} size="large" color="#4a7df3" />
                ) : (
                    <FlatList
                        data={transacoes}
                        renderItem={renderTransacao}
                        keyExtractor={item => String(item.id)}
                        refreshControl={
                            <RefreshControl
                                refreshing={atualizando}
                                onRefresh={onRefresh}
                                colors={['#4a7df3']}
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.semTransacoes}>
                                <Text style={styles.semTransacoesTexto}>Nenhuma transação encontrada</Text>
                            </View>
                        }
                    />
                )}
            </View>
            <Footer/>
        </SafeAreaView>
        
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    header: {
      backgroundColor: '#5a45fe',
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: 32,
    },
    title: {
      fontSize: 20,
      color: 'rgba(189, 181, 255, 1)',
      marginTop: 30,
      marginLeft: 10,
    },
    subtitle: {
      fontSize: 30,
      color: 'white',
      marginLeft: 10,
      fontWeight: 'bold',
    },
    userInfo: {
        paddingTop: 30,
        paddingLeft: 20,
        paddingBottom: 30,
      },
      
    cardSaldo: {
      marginHorizontal: 20,
      marginBottom: 20,
      alignItems: 'flex-start',
      
    },
    tituloSaldo: {
      fontSize: 18,
      color: '#d0cfff',
      marginLeft: 10,
    },
    cardConteudo: {
        paddingTop: 10,
        borderRadius: 12,
        width: '100%',
      },
    valorSaldo: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'white',
      marginLeft: 10,
    },
    buttonAtualizar: {
        marginLeft: 10,
        color: 'rgba(189, 181, 255, 1)',
        fontWeight: 'bold',
        marginTop: 10,
    },
    botoesTransacao: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 40,
      marginBottom: 20,
      backgroundColor: '#7b6afe',
      borderRadius: 10,
      padding: 12,
      gap: 16,
    },
    button: {
      flex: 1,
      backgroundColor: '#ec0c7a',
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 6,
      elevation: 2,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    transacoesContainer: {
      flex: 1,
    },
    transacoesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      marginBottom: 10,
    },
    tituloTransacoes: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    carregando: {
      marginTop: 20,
    },
    semTransacoes: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    semTransacoesTexto: {
      color: '#666',
      fontSize: 16,
    },
    redirectText: {
      fontSize: 14,
      color: '#ec0c7a',
      fontWeight: '500',
    },
    transacaoItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    transacaoDescricao: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    transacaoValor: {
      fontSize: 14,
      color: '#ec0c7a',
    },
    transacaoData: {
      fontSize: 12,
      color: '#rgba(189, 181, 255, 1)',
    },
  });
  