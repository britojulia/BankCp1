import { ActivityIndicator, FlatList, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"

export default function Dashboard(){
    return(

        <SafeAreaView>
            <StatusBar/>

        {/*cabecalho*/}
            <View>
                <View>
                    <Text>Olá!</Text>
                    <Text>Meu nome e emoji</Text>
                </View>
            </View>

{/*saldo*/}
            <View>
                <View>
                    <Text>Saldo total</Text>
                    <TouchableOpacity>
                        <Text>Atualizar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View>
            {/*carregandoSaldo ? (
                         <ActivityIndicator size="large" color="#4a7df3" />
                     ) : (
                         <Text style={styles.valorSaldo}>{formatarMoeda(saldo)}</Text>
                     )*/}
            </View>

            <View>
                <TouchableOpacity>
                    <Text>Transferir</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Receber</Text>
                </TouchableOpacity>
            </View>

{/*transações */}
            <View>
                <View>
                    <Text>Transações</Text>
                    <TouchableOpacity>
                        <Text>Ver todas</Text>
                    </TouchableOpacity>
                </View>
                
                {/* {carregandoTransacoes ? (
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
                 )} */}

                
            </View>
        </SafeAreaView>

        
        
    )
}