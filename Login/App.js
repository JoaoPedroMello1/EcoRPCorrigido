import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { saveUser, getUser } from './banco';

const tabIcons = {
  Home: require('./src/home.png'),
  EcoPontos: require('./src/leaf.png'),
  Agendamento: require('./src/agenda.png'),
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    const result = await getUser(email.trim(), password);
    if (result.error) {
      Alert.alert('Erro', result.error);
      return;
    }

    Alert.alert('Sucesso', `Bem-vindo ${result.nome}!`);
    setEmail('');
    setPassword('');
  };

  const handleSignUp = async () => {
    if (!nome.trim() || !endereco.trim() || !telefone.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const result = await saveUser(nome.trim(), endereco.trim(), telefone.trim(), email.trim(), password);
    if (result.error) {
      Alert.alert('Erro', result.error);
      return;
    }

    Alert.alert('Sucesso', 'Usuário cadastrado!');
    setNome('');
    setEndereco('');
    setTelefone('');
    setEmail('');
    setPassword('');
    setIsLogin(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      enabled
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.title}>EcoRP</Text>
          <Text style={styles.subtitle}>Bem-vindo</Text>
          <Text style={styles.description}>
            We are here to help you through waste recycling
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formInstruction}>
            {isLogin ? 'Informe seus dados para continuar' : 'Preencha os campos para se cadastrar'}
          </Text>

          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                placeholderTextColor="#a0a0a0"
              />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                value={endereco}
                onChangeText={setEndereco}
                autoCapitalize="sentences"
                placeholderTextColor="#a0a0a0"
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                placeholderTextColor="#a0a0a0"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#a0a0a0"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#a0a0a0"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isLogin ? handleLogin : handleSignUp}
          >
            <Text style={styles.buttonText}>
              {isLogin ? 'Entrar' : 'Cadastrar-se'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleContainer}>
            <Text style={styles.toggleNormal}>
              {isLogin ? "Não tem uma conta?" : 'Já tem uma conta? '}
              <Text style={styles.toggleBold}>
                {isLogin ? ' Cadastre-se' : 'Entre'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {['Home', 'EcoPontos', 'Agendamento'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navButton}
            onPress={() => setActiveTab(tab)}
          >
            <Image
              source={tabIcons[tab]}
              style={[
                styles.navIcon,
                activeTab !== tab && styles.navIconInactive,
              ]}
            />
            <Text
              style={[
                styles.navText,
                activeTab === tab && styles.navTextActive,
              ]}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === tab && styles.navLabelActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 36,
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 42,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
    maxWidth: '80%',
  },
  form: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formInstruction: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 26,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 54,
    borderWidth: 1,
    borderColor: '#4a4a4a',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    color: '#000000',
    backgroundColor: '#ffffff',
    fontSize: 14,
  },
  button: {
    width: '55%',
    height: 46,
    backgroundColor: '#000000',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  toggleContainer: {
    marginTop: 4,
  },
  toggleNormal: {
    fontSize: 14,
    color: '#000000',
  },
  toggleBold: {
    fontWeight: 'bold',
  },
  bottomNav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  navIconInactive: {
    tintColor: '#8e8e93',
  },
  navLabel: {
    fontSize: 11,
    color: '#8e8e93',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#000000',
    fontWeight: '700',
  },
});