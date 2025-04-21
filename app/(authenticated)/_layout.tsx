import { Stack } from "expo-router";
 
 export default function AuthenticatedLayout() {
     return(
         <Stack>
             <Stack.Screen name="Dashboard/index" options={{ headerShown: false }} />
             <Stack.Screen name="Perfil/index" options={{ headerShown: false }} />
             <Stack.Screen name="Receber/index" options={{ headerShown: false }} />
             <Stack.Screen name="Enviar/index" options={{ headerShown: false }} />
             <Stack.Screen name="TransictionDetail/index" options={{ headerShown: false }} />
             <Stack.Screen name="Transictions/Transictions" options={{ headerShown: false }} />
         </Stack>
     )
 }