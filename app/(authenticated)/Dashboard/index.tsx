import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"

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

const [saldo, setSaldo] = useState(0);
const [transacoes, setTransacoes] = useState<ITransacoesProps[]>([]);
const [carregandoSaldo, setCarregandoSaldo] = useState(true);
const [carregandoTransacoes, setCarregandoTransacoes] = useState(true);
const [atualizando, setAtualizando] = useState(false);


const {token, usuario  } = useAuth();

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
        setCarregandoSaldo(false);
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
        // Em um cenário real, você faria uma requisição para sua API
        const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias', {
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
const renderTransacao = ({ item }: {item:ITransacoesProps}) => {
    const isEntrada = item.tipo === 'recebida';
}

export default function Dashboard(){
    return(

        <SafeAreaView>
            <StatusBar/>

        {/*cabecalho*/}
            <View>
                <View>
                    <Text>Olá!</Text>
                    <Text>{usuario?.nome}</Text>
                </View>
            </View>

{/*saldo*/}
            <View>
                <View>
                    <Text>Saldo total</Text>
                    <View style={styles.cardConteudo}>
                     {carregandoSaldo ? (
                         <ActivityIndicator size="large" color="#4a7df3" />
                     ) : (
                         <Text style={styles.valorSaldo}>{formatarMoeda(saldo)}</Text>
                     )}
                 </View>
                    <TouchableOpacity onPress={buscarSaldo}>
                        <Text>Atualizar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <TouchableOpacity onPress={() => router.push('/Enviar')}>
                    <Text>Transferir</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/Receber')}>
                    <Text>Receber</Text>
                </TouchableOpacity>
            </View>

{/*transações */}
            <View>
                <View>
                    <Text>Transações</Text>
                    <TouchableOpacity onPress={() => router.push('/Transacoes')}>
                        <Text>Ver todas</Text>
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
        </SafeAreaView>

        
        
    )
}