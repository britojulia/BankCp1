import Footer from '@/components/Rodape';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    StatusBar,
} from 'react-native';

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

export default function Transactions() {
    const [transacoes, setTransacoes] = useState<ITransacoesProps[]>([]);
    const [filtroAtual, setFiltroAtual] = useState('todas');
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [pagina, setPagina] = useState(1);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [finalLista, setFinalLista] = useState(false);
    const [token, setToken] = useState('');

    const router = useRouter();

    const formatarMoeda = (valor: number) => {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`; // Garantir que o valor seja tratado como número
    };
    

    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
    };

    const buscarTransacoes = async () => {
        if (!token) {
            console.log("Token não encontrado.");
            return;
        }

        try {
            const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const dados = await resposta.json();
            setTransacoes(dados);
        } catch (erro) {
            console.error('Erro ao buscar transações:', erro);
        } finally {
            setCarregando(false);
            setCarregandoMais(false);
        }
    };

    const getToken = async () => {
        const storedToken = await AsyncStorage.getItem("@token");
        if (!storedToken) {
            router.push("/Dashboard");
        } else {
            setToken(storedToken);
        }
    };

    useEffect(() => {
        getToken();
    }, []);

    useEffect(() => {
        if (token) {
            setPagina(1);
            buscarTransacoes();
        }
    }, [filtroAtual, token]);

    const onRefresh = async () => {
        setAtualizando(true);
        setPagina(1);
        setFinalLista(false);
        await buscarTransacoes();
        setAtualizando(false);
    };

    const carregarMais = () => {
        if (carregandoMais || finalLista) return;

        const proximaPagina = pagina + 1;
        setPagina(proximaPagina);
        buscarTransacoes();
    };

    const realizarBusca = () => {
        setPagina(1);
        setFinalLista(false);
        buscarTransacoes();
    };

    const renderTransacao = ({ item }: { item: ITransacoesProps }) => {
        const isEntrada = item.tipo === 'recebida';

        return (
            <TouchableOpacity
                style={styles.transacaoItem}
                onPress={() => router.push('/(authenticated)/TransictionDetail')}
            >
                <View style={styles.transacaoIcone}>
                    <View style={[styles.iconeCirculo, { backgroundColor: isEntrada ? 'rgba(75, 181, 67, 0.1)' : 'rgba(242, 78, 30, 0.1)' }]}>
                        <Text style={[styles.iconeTexto, { color: isEntrada ? '#4BB543' : '#F24E1E' }]}>
                            {isEntrada ? '↓' : '↑'}
                        </Text>
                    </View>
                </View>

                <View style={styles.transacaoInfo}>
                    <View style={styles.transacaoLinha1}>
                        <Text style={styles.transacaoDescricao} numberOfLines={1} ellipsizeMode="tail">
                            {item.descricao}
                        </Text>
                        <Text style={[styles.transacaoValor, { color: isEntrada ? '#4BB543' : '#F24E1E' }]}>
                            {isEntrada ? '+' : '-'}{formatarMoeda(item.valor)}
                        </Text>
                    </View>

                    <View style={styles.transacaoLinha2}>
                        <Text style={styles.transacaoPessoa} numberOfLines={1} ellipsizeMode="tail">
                            {isEntrada ? `De: ${item.contraparte.apelido}` : `Para: ${item.contraparte.apelido}`}
                        </Text>
                        <Text style={styles.transacaoData}>{formatarData(item.data)}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    };

    const ListHeader = () => (
        <View style={styles.buscaContainer}>
            <TextInput
                style={styles.inputBusca}
                placeholder="Buscar transações..."
                value={termoBusca}
                onChangeText={setTermoBusca}
                onSubmitEditing={realizarBusca}
                returnKeyType="search"
            />

            <View style={styles.filtros}>
                <TouchableOpacity
                    style={[styles.filtroBotao, filtroAtual === 'todas' && styles.filtroBotaoAtivo]}
                    onPress={() => setFiltroAtual('todas')}
                >
                    <Text style={[styles.filtroTexto, filtroAtual === 'todas' && styles.filtroTextoAtivo]}>Todas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filtroBotao, filtroAtual === 'recebidas' && styles.filtroBotaoAtivo]}
                    onPress={() => setFiltroAtual('recebidas')}
                >
                    <Text style={[styles.filtroTexto, filtroAtual === 'recebidas' && styles.filtroTextoAtivo]}>Entradas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filtroBotao, filtroAtual === 'enviadas' && styles.filtroBotaoAtivo]}
                    onPress={() => setFiltroAtual('enviadas')}
                >
                    <Text style={[styles.filtroTexto, filtroAtual === 'enviadas' && styles.filtroTextoAtivo]}>Saídas</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const ListFooter = () => {
        if (!carregandoMais) {
            return null;
        }

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#4a7df3" />
                <Text style={styles.footerText}>Carregando mais...</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

            <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.voltarButton}>
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>
                <Text style={styles.headerTitle}>Histórico de Transações</Text>
                <View style={styles.emptySpace} />
            </View>

            {carregando ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4a7df3" />
                    <Text style={styles.loadingText}>Carregando transações...</Text>
                </View>
            ) : (
                <FlatList
                    data={transacoes}
                    renderItem={renderTransacao}
                    keyExtractor={item => item.id.toString()}
                    ListHeaderComponent={ListHeader}
                    ListFooterComponent={ListFooter}
                    contentContainerStyle={styles.listaConteudo}
                    refreshControl={
                        <RefreshControl refreshing={atualizando} onRefresh={onRefresh} colors={['#ec0c7a']} />
                    }
                    onEndReached={carregarMais}
                    onEndReachedThreshold={0.2}
                    ListEmptyComponent={
                        <View style={styles.semTransacoes}>
                            <Text style={styles.semTransacoesTexto}>Nenhuma transação encontrada</Text>
                        </View>
                    }
                />
            )}
            <Footer/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
    },
    voltarButton: {
        marginBottom: 30,
      },
    header: {
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    voltarText: {
        fontSize: 16,
        color: '#ec0c7a',
      },
    backButtonText: {
        fontSize: 24,
        color: '#2e3e5c',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2e3e5c',
        marginBottom: 8,

    },
    emptySpace: {
        width: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#2e3e5c',
        marginTop: 16,
    },
    listaConteudo: {
        paddingBottom: 60,
    },
    transacaoItem: {
        flexDirection: 'row',
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    transacaoIcone: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconeCirculo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconeTexto: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    transacaoInfo: {
        flex: 1,
    },
    transacaoLinha1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    transacaoDescricao: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2e3e5c',
        flex: 1,
    },
    transacaoValor: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    transacaoLinha2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    transacaoPessoa: {
        fontSize: 14,
        color: '#7b8bb2',
    },
    transacaoData: {
        fontSize: 14,
        color: '#7b8bb2',
    },
    transacaoLinha3: {
        flexDirection: 'row',
    },
    categoriaTag: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoriaTexto: {
        fontSize: 14,
        color: '#7b8bb2',
    },
    buscaContainer: {
        marginBottom: 16,
    },
    inputBusca: {
        height: 48,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#2e3e5c',
        backgroundColor: '#f9f9f9',
    },
    filtros: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    filtroBotao: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f1f1f1',
    },
    filtroBotaoAtivo: {
        backgroundColor: '#ec0c7a',
    },
    filtroTexto: {
        fontSize: 14,
        color: '#7b8bb2',
    },
    filtroTextoAtivo: {
        color: '#ffffff',
    },
    footerLoader: {
        marginVertical: 16,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#7b8bb2',
        marginTop: 8,
    },
    semTransacoes: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    semTransacoesTexto: {
        fontSize: 16,
        color: '#7b8bb2',
    },
});
