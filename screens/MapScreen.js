import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

export default function App({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapType, setMapType] = useState('standard');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Erro ao obter a localização');
      } finally {
        setIsLoading(false);
      }
    })();

    Magnetometer.setUpdateInterval(1000);
    const orientationSubscription = Magnetometer.addListener(data => {
      setOrientation(data);
    });

    return () => {
      orientationSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App{"\n"}Sensor, Localização e Mapa</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Tipo de Mapa:</Text>
        <Picker
          selectedValue={mapType}
          style={styles.picker}
          onValueChange={itemValue => setMapType(itemValue)}
        >
          <Picker.Item label="Padrão" value="standard" />
          <Picker.Item label="Satélite" value="satellite" />
          <Picker.Item label="Híbrido" value="hybrid" />
          <Picker.Item label="Terreno" value="terrain" />
        </Picker>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        location && (
          <MapView
            style={styles.map}
            mapType={mapType}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Minha Localização"
            />
          </MapView>
        )
      )}

      <View style={styles.sensor}>
        <Text style={styles.sensorText}>Orientação:</Text>
        {orientation ? (
          <Text style={styles.sensorText}>
            X: {orientation.x.toFixed(2)} | Y: {orientation.y.toFixed(2)} | Z: {orientation.z.toFixed(2)}
          </Text>
        ) : (
          <Text style={styles.sensorText}>Carregando orientação...</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Ir para SMS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0FFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'blue',
  },
  pickerLabel: {
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: 200,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  sensor: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  sensorText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
