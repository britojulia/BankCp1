import { KeyboardAvoidingView, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

export default function Enviar(){
    return(
        <View>
        {/* Cabeçalho */}
        <View>
            <Text>Voltar</Text>
            <Text>Transferir Dinheiro</Text>
            <Text>Protegido</Text>
        </View>
  
        {/* Valor */}
        <View>
          <Text>Digite o valor</Text>
          <View style={styles.valorContainer}>
                             <Text style={styles.moedaSymbol}>R$</Text>
                             <TextInput
                                 style={styles.inputValor}
                                 placeholder="0,00"
                                 keyboardType="numeric"
                                 value={valor}
                                 onChangeText={formatarValor}
                             />
                         </View>
  
                         <View style={styles.form}>
                         <Text style={styles.label}>Para quem você deseja enviar?</Text>
                         <TextInput
                             style={styles.input}
                             placeholder="Apelido ou nome de usuário"
                             value={contaDestino}
                             onChangeText={setContaDestino}
                             autoCapitalize="none"
                             autoCorrect={false}
                         />
 
  
        {/* Botão */}
        <TouchableOpacity>
          <Text>Enviar Dinheiro</Text>
        </TouchableOpacity>
      </View>
    )
}