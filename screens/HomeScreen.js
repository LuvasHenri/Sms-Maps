import React, { useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, Appbar } from 'react-native-paper';
import * as SMS from 'expo-sms';

export default function App({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const sendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync([phoneNumber], message);
      if (result === 'sent') {
        Alert.alert('Sucesso', 'SMS enviado com sucesso!');
      } else {
        Alert.alert('Erro', 'Falha ao enviar SMS.');
      }
    } else {
      Alert.alert('Não suportado', 'Este dispositivo não suporta SMS.');
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Enviar SMS" />
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.title}>Envie uma mensagem SMS</Text>

        <TextInput
          label="Número de telefone"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Mensagem"
          value={message}
          onChangeText={setMessage}
          multiline
          style={styles.input}
          mode="outlined"
          numberOfLines={4}
        />

        <Button mode="contained" onPress={sendSMS} style={styles.button}>
          Enviar SMS
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Maps')}
          style={styles.button}
          textColor="#6200ee"
        >
          Abrir Mapa
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6200ee',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    padding: 8,
  },
});
