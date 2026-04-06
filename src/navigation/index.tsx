import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import PropertiesListScreen from '../screens/properties/PropertiesListScreen';
import PropertyDetailScreen from '../screens/properties/PropertyDetailScreen';
import CreatePropertyScreen from '../screens/properties/CreatePropertyScreen';
import TenantsListScreen from '../screens/tenants/TenantsListScreen';
import CreateTenantScreen from '../screens/tenants/CreateTenantScreen';
import ContractsListScreen from '../screens/contracts/ContractsListScreen';
import ContractPaymentsScreen from '../screens/contracts/ContractPaymentsScreen';
import CreateContractScreen from '../screens/contracts/CreateContractScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';

import { useColors } from '../theme';
import { useAppContext } from '../context/AppContext';
import type { TranslationKey } from '../i18n/translations';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Properties: undefined;
  Tenants: undefined;
  Contracts: undefined;
  Reports: undefined;
};

export type PropertiesStackParamList = {
  PropertiesList: undefined;
  PropertyDetail: { propertyId: string };
  CreateProperty: undefined;
};

export type TenantsStackParamList = {
  TenantsList: undefined;
  CreateTenant: undefined;
};

export type ContractsStackParamList = {
  ContractsList: undefined;
  ContractPayments: { contractId: string };
  CreateContract: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const PropertiesStack = createNativeStackNavigator<PropertiesStackParamList>();
const TenantsStack = createNativeStackNavigator<TenantsStackParamList>();
const ContractsStack = createNativeStackNavigator<ContractsStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function PropertiesNavigator() {
  return (
    <PropertiesStack.Navigator screenOptions={{ headerShown: false }}>
      <PropertiesStack.Screen name="PropertiesList" component={PropertiesListScreen} />
      <PropertiesStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      <PropertiesStack.Screen name="CreateProperty" component={CreatePropertyScreen} />
    </PropertiesStack.Navigator>
  );
}

function TenantsNavigator() {
  return (
    <TenantsStack.Navigator screenOptions={{ headerShown: false }}>
      <TenantsStack.Screen name="TenantsList" component={TenantsListScreen} />
      <TenantsStack.Screen name="CreateTenant" component={CreateTenantScreen} />
    </TenantsStack.Navigator>
  );
}

function ContractsNavigator() {
  return (
    <ContractsStack.Navigator screenOptions={{ headerShown: false }}>
      <ContractsStack.Screen name="ContractsList" component={ContractsListScreen} />
      <ContractsStack.Screen name="ContractPayments" component={ContractPaymentsScreen} />
      <ContractsStack.Screen name="CreateContract" component={CreateContractScreen} />
    </ContractsStack.Navigator>
  );
}

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const icons: Record<string, string> = {
    Dashboard: '⊞',
    Properties: '⌂',
    Tenants: '⚇',
    Contracts: '☰',
    Reports: '▣',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5, color }}>
      {icons[name] ?? '●'}
    </Text>
  );
}

function MainNavigator() {
  const Colors = useColors();
  const { t } = useAppContext();

  const tabLabel = (name: string) =>
    t(`nav.${name.toLowerCase()}` as TranslationKey);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => <TabIcon name={route.name} focused={focused} color={color} />,
        tabBarLabel: tabLabel(route.name),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerLowest,
          borderTopWidth: 0,
          elevation: 30,
          height: 100,
          paddingBottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
          name="Properties"
          component={PropertiesNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Properties', { screen: 'PropertiesList' });
            },
          })}
        />
      <Tab.Screen name="Tenants" component={TenantsNavigator} />
      <Tab.Screen name="Contracts" component={ContractsNavigator} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Main" component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
