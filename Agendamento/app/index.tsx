import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona direto para a sua tela de agendamento assim que o app abre
  return <Redirect href="/agendamento" />;
}