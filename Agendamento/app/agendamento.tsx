import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Linking, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView,
  Modal
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'; 
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; 

export default function AgendamentoScreen() {
  // Controle de Tema (Light / Dark)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Estados principais do formulário
  const [categoria, setCategoria] = useState('Informática');
  const [periodo, setPeriodo] = useState('Manhã');
  const [meuLixoEletronico, setMeuLixoEletronico] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  // Estados detalhados do Endereço (Atualizado para Ribeirão Preto)
  const [tipoLogradouro, setTipoLogradouro] = useState('Avenida'); // Avenida, Rua, Outros
  const [rua, setRua] = useState('Maurílio Biagi');
  const [numero, setNumero] = useState('2103');
  const [bairro, setBairro] = useState('Ribeirânia');
  const [cidade, setCidade] = useState('Ribeirão Preto');
  const [complemento, setComplemento] = useState(''); // Opcional
  const [observacoes, setObservacoes] = useState(''); // Instrução para o motorista

  // Função para montar o endereço completo dinamicamente
  const obterEnderecoCompleto = () => {
    if (!rua || !numero || !bairro || !cidade) {
      return "Endereço incompleto. Toque para configurar.";
    }
    const compTexto = complemento.trim() ? `, ${complemento}` : '';
    return `${tipoLogradouro} ${rua}, nº ${numero}${compTexto}, ${bairro} - ${cidade}`;
  };

  const enviarParaWhatsApp = () => {
    if (meuLixoEletronico.trim() === '') {
      alert('Por favor, descreva os itens que deseja descartar!');
      return;
    }
    
    if (!rua.trim() || !numero.trim() || !bairro.trim() || !cidade.trim()) {
      alert('Por favor, configure o endereço completo antes de agendar!');
      return;
    }

    const numeroCRReciclar = "5516996444638"; 
    const enderecoFormatado = obterEnderecoCompleto();
    
    // Montagem do texto final para o WhatsApp com os novos campos
    let mensagem = `Olá, CR Reciclar! Quero agendar uma coleta.\n\n📂 Categoria: ${categoria}\n⏰ Período: ${periodo}\n📍 Endereço:\n${enderecoFormatado}`;
    
    if (observacoes.trim()) {
      mensagem += `\n\n📝 Obs. Motorista:\n${observacoes}`;
    }
    
    mensagem += `\n\n📦 Itens para coletar:\n${meuLixoEletronico}`;
    
    const urlBase = Platform.OS === 'web' ? `https://web.whatsapp.com/send` : `whatsapp://send`;
    const linkFinal = `${urlBase}?phone=${numeroCRReciclar}&text=${encodeURIComponent(mensagem)}`;
    
    Linking.openURL(linkFinal).catch(() => {
      alert('Não foi possível abrir o WhatsApp.');
    });
  };

  // Paleta de Cores Dinâmica (Muda conforme o estado isDarkMode)
  const theme = {
    bg: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    textSub: isDarkMode ? '#AAAAAA' : '#666666',
    cardBg: isDarkMode ? '#1E1E1E' : '#FAFAFA',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    borderDashed: isDarkMode ? '#555555' : '#CCCCCC',
    btnOvalBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    btnOvalBorder: isDarkMode ? '#FFFFFF' : '#000000',
    btnOvalText: isDarkMode ? '#FFFFFF' : '#000000',
    btnOvalActiveBg: isDarkMode ? '#FFFFFF' : '#000000',
    btnOvalActiveText: isDarkMode ? '#000000' : '#FFFFFF',
    modalBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.appWrapper, { backgroundColor: theme.bg }]}>
        
        {/* BOTÃO REDONDO DE DARK MODE (Superior Direito) */}
        <TouchableOpacity 
          style={[styles.btnDarkMode, { backgroundColor: isDarkMode ? '#FFFFFF' : '#121212' }]}
          onPress={() => setIsDarkMode(!isDarkMode)}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon"} 
            size={20} 
            color={isDarkMode ? "#121212" : "#FFFFFF"} 
          />
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              contentContainerStyle={styles.container}
              showsVerticalScrollIndicator={false}
            >
              
              <Text style={[styles.txtCategorias, { color: theme.text }]}>Tipo de Item Principal:</Text>
              <View style={styles.areaCategorias}>
                {['Informática', 'Eletro', 'Celulares'].map((tipo) => (
                  <TouchableOpacity 
                    key={tipo}
                    style={[
                      styles.botaoFigmaOval, 
                      { borderColor: theme.btnOvalBorder, backgroundColor: theme.btnOvalBg },
                      categoria === tipo && { backgroundColor: theme.btnOvalActiveBg, borderColor: theme.btnOvalActiveBg }
                    ]}
                    onPress={() => setCategoria(tipo)}
                  >
                    <Text style={[
                      styles.txtBotaoOval, 
                      { color: theme.btnOvalText },
                      categoria === tipo && { color: theme.btnOvalActiveText }
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.txtCategorias, { color: theme.text }]}>Descrição dos Itens:</Text>
              <View style={[styles.caixaCentralTracejada, { borderColor: theme.borderDashed, backgroundColor: theme.cardBg }]}>
                <MaterialCommunityIcons name="text-box-plus-outline" size={32} color={isDarkMode ? "#777" : "#999"} style={{ marginBottom: 10 }} />
                <TextInput
                  style={[styles.campoDigitacaoFigma, { color: theme.text }]}
                  placeholder="Descreva detalhadamente o que você deseja descartar (Ex: 1 monitor, 2 teclados velhos...)"
                  placeholderTextColor={isDarkMode ? "#666" : "#999"}
                  multiline={true} 
                  value={meuLixoEletronico} 
                  onChangeText={setMeuLixoEletronico} 
                />
              </View>

              <Text style={[styles.txtCategorias, { color: theme.text }]}>Local de Coleta:</Text>
              <TouchableOpacity 
                style={[styles.inputLocalizacaoBotao, { borderColor: theme.border, backgroundColor: theme.cardBg }]} 
                onPress={() => setModalVisivel(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="location-outline" size={18} color={theme.textSub} style={{ marginRight: 8 }} />
                <Text style={[styles.txtEnderecoMock, { color: theme.text }]} numberOfLines={1}>
                  {obterEnderecoCompleto()}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={theme.textSub} style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>

              <Text style={[styles.txtCategorias, { color: theme.text }]}>Período Preferencial:</Text>
              <View style={styles.areaPeriodos}>
                {['Manhã', 'Tarde'].map((p) => (
                  <TouchableOpacity 
                    key={p}
                    style={[
                      styles.botaoPeriodo, 
                      { borderColor: theme.border, backgroundColor: theme.cardBg },
                      periodo === p && { backgroundColor: theme.btnOvalActiveBg, borderColor: theme.btnOvalActiveBg }
                    ]}
                    onPress={() => setPeriodo(p)}
                  >
                    <Text style={[
                      styles.txtPeriodo, 
                      { color: theme.textSub },
                      periodo === p && { color: theme.btnOvalActiveText }
                    ]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={[styles.botaoSendFigma, { backgroundColor: isDarkMode ? '#FFFFFF' : '#000000' }]} 
                onPress={enviarParaWhatsApp}
              >
                <Text style={[styles.txtBotaoSend, { color: isDarkMode ? '#000000' : '#FFFFFF' }]}>AGENDAR</Text>
              </TouchableOpacity>

            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        {/* ================= JANELA MODAL DETALHADA ESTILO IFOOD ================= */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={() => setModalVisivel(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisivel(false)}>
              <View style={styles.fundoModal}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={[styles.conteudoModal, { backgroundColor: theme.modalBg }]}>
                    <View style={styles.linhaArrastarModal} />
                    
                    <Text style={[styles.tituloModal, { color: theme.text }]}>Configurar Endereço</Text>
                    
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                      
                      {/* BOTÕES RÁPIDOS: Tipo de Logradouro */}
                      <Text style={[styles.labelInputModal, { color: theme.textSub }]}>Tipo de Logradouro</Text>
                      <View style={styles.linhaLogradouro}>
                        {['Avenida', 'Rua', 'Outros'].map((tipo) => (
                          <TouchableOpacity
                            key={tipo}
                            style={[
                              styles.btnLogradouroChip,
                              { borderColor: theme.border, backgroundColor: theme.cardBg },
                              tipoLogradouro === tipo && { backgroundColor: isDarkMode ? '#FFFFFF' : '#000000', borderColor: isDarkMode ? '#FFFFFF' : '#000000' }
                            ]}
                            onPress={() => setTipoLogradouro(tipo)}
                          >
                            <Text style={[
                              styles.txtLogradouroChip,
                              { color: theme.text },
                              tipoLogradouro === tipo && { color: isDarkMode ? '#000000' : '#FFFFFF' }
                            ]}>
                              {tipo}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={[styles.labelInputModal, { color: theme.textSub }]}>Nome do Logradouro</Text>
                      <TextInput 
                        style={[styles.inputModalForm, { borderColor: theme.border, backgroundColor: theme.cardBg, color: theme.text }]} 
                        value={rua} 
                        onChangeText={setRua}
                        placeholder="Ex: Maurílio Biagi"
                        placeholderTextColor="#777"
                      />

                      <View style={styles.linhaInputsGemas}>
                        <View style={{ width: '30%' }}>
                          <Text style={[styles.labelInputModal, { color: theme.textSub }]}>Número</Text>
                          <TextInput 
                            style={[styles.inputModalForm, { borderColor: theme.border, backgroundColor: theme.cardBg, color: theme.text }]} 
                            value={numero} 
                            onChangeText={setNumero}
                            placeholder="2103"
                            placeholderTextColor="#777"
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={{ width: '65%' }}>
                          <Text style={[styles.labelInputModal, { color: theme.textSub }]}>Complemento (Opcional)</Text>
                          <TextInput 
                            style={[styles.inputModalForm, { borderColor: theme.border, backgroundColor: theme.cardBg, color: theme.text }]} 
                            value={complemento} 
                            onChangeText={setComplemento}
                            placeholder="Ex: Apt 42, Bloco B"
                            placeholderTextColor="#777"
                          />
                        </View>
                      </View>

                      <View style={styles.linhaInputsGemas}>
                        <View style={{ width: '48%' }}>
                          <Text style={[styles.labelInputModal, { color: theme.textSub }]}>Bairro</Text>
                          <TextInput 
                            style={[styles.inputModalForm, { borderColor: theme.border, backgroundColor: theme.cardBg, color: theme.text }]} 
                            value={bairro} 
                            onChangeText={setBairro}
                            placeholder="Ex: Ribeirânia"
                            placeholderTextColor="#777"
                          />
                        </View>
                        <View style={{ width: '48%' }}>
                          <Text style={[styles.labelInputModal, { color: theme.textSub }]}>Cidade</Text>
                          <TextInput 
                            style={[styles.inputModalForm, { borderColor: theme.border, backgroundColor: theme.cardBg, color: theme.text }]} 
                            value={cidade} 
                            onChangeText={setCidade}
                            placeholder="Ex: Ribeirão Preto"
                            placeholderTextColor="#777"
                          />
                        </View>
                      </View>

                      {/* CAMPO NOVO: Observações para o Motorista */}
                      <Text style={[styles.labelInputModal, { color: theme.textSub }]}>Instruções para o Motorista</Text>
                      <TextInput 
                        style={[styles.inputModalForm, styles.inputObs, { borderColor: theme.border, backgroundColor: theme.cardBg, color: theme.text }]} 
                        value={observacoes} 
                        onChangeText={setObservacoes}
                        placeholder="Ex: Interfone estragado, deixar com o porteiro, entrar pela lateral..."
                        placeholderTextColor="#777"
                        multiline={true}
                        numberOfLines={2}
                      />

                      <TouchableOpacity 
                        style={[styles.botaoSalvarModal, { backgroundColor: isDarkMode ? '#FFFFFF' : '#000000' }]} 
                        onPress={() => setModalVisivel(false)}
                      >
                        <Text style={[styles.txtSalvarModal, { color: isDarkMode ? '#000000' : '#FFFFFF' }]}>Confirmar Endereço</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24, 
    paddingTop: 60, // Espaço extra por causa do botão de Dark Mode no topo
    paddingBottom: 40, 
  },
  btnDarkMode: {
    position: 'absolute',
    top: 15,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  txtCategorias: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  areaCategorias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  botaoFigmaOval: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '31%',
    alignItems: 'center',
  },
  txtBotaoOval: {
    fontSize: 13,
    fontWeight: '600',
  },
  caixaCentralTracejada: {
    borderWidth: 1.5,
    borderStyle: 'dashed', 
    borderRadius: 16,
    padding: 16,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  campoDigitacaoFigma: {
    width: '100%',
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 15,
    paddingTop: 5,
  },
  inputLocalizacaoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 25,
  },
  txtEnderecoMock: {
    fontSize: 14,
    flex: 1,
    paddingRight: 10,
  },
  areaPeriodos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  botaoPeriodo: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    width: '48%',
    alignItems: 'center',
  },
  txtPeriodo: {
    fontSize: 14,
    fontWeight: '600',
  },
  botaoSendFigma: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  txtBotaoSend: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'flex-end', 
  },
  conteudoModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    maxHeight: '85%', 
  },
  linhaArrastarModal: {
    width: 40,
    height: 5,
    backgroundColor: '#888',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
  },
  labelInputModal: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  linhaLogradouro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  btnLogradouroChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    width: '31%',
    alignItems: 'center',
  },
  txtLogradouroChip: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputModalForm: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  inputObs: {
    height: 60,
    textAlignVertical: 'top',
  },
  linhaInputsGemas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoSalvarModal: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  txtSalvarModal: {
    fontSize: 16,
    fontWeight: '700',
  },
});