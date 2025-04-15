import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Perfil(){
    return(
        <SafeAreaView>
            <View>
                <Text>Profile</Text>
            </View>
            <View>
                <View>
                    <Text>Nome aqui</Text>
                </View>
            </View>

            <View>
                <Text>Nome</Text>
                <TextInput placeholder="nome" value="" onChangeText={setNome}/>
            </View>
            <View>
                <Text>Apelido</Text>
                <TextInput placeholder="apelido" value="" onChangeText={setApelido}/>
            </View>
            <View>
                <Text>Email</Text>
                <TextInput placeholder="email" value="" onChangeText={setEmail} keyboardType="endereço de email"/>
            </View>

            <TouchableOpacity>
                <Text>Salvar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}