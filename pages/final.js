import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';

export default function FinalScreen({ navigation, route }) {
    const { title, content } = route.params

  return (
    <View style={styles.container}>
      <Text>Você clicou em uma notificação!</Text>
      <Text>Título: {title}</Text>
      <Text style={{maxWidth: 300}}>Conteúdo: {content}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
