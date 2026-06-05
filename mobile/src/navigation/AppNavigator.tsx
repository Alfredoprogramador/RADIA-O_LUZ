import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'

import HomeScreen from '../screens/HomeScreen'
import ChamadosScreen from '../screens/ChamadosScreen'
import InstalacaoScreen from '../screens/InstalacaoScreen'
import MonitoramentoScreen from '../screens/MonitoramentoScreen'
import PerfilScreen from '../screens/PerfilScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            Início: focused ? 'home' : 'home-outline',
            Chamados: focused ? 'wrench' : 'wrench-outline',
            Instalação: focused ? 'construct' : 'construct-outline',
            Monitoramento: focused ? 'stats-chart' : 'stats-chart-outline',
            Perfil: focused ? 'person' : 'person-outline',
          }
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Chamados" component={ChamadosScreen} />
      <Tab.Screen name="Instalação" component={InstalacaoScreen} />
      <Tab.Screen name="Monitoramento" component={MonitoramentoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
