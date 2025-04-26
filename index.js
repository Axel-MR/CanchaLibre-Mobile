import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener las reservas desde la API
  const fetchReservas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/reservas');  // Asegúrate de que esta URL sea correcta
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setReservas(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Renderizar si hay error o cargando
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Cargando reservas...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reservas Disponibles</Text>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reservaCard}>
            <View style={styles.reservaContent}>
              <Text style={styles.deporteTitulo}>{item.deporte}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Centro Deportivo:</Text>
                <Text style={styles.infoValue}>{item.centroDeportivo.nombre}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha y Hora:</Text>
                <Text style={styles.infoValue}>{item.fechaHora}</Text>
              </View>
            </View>
            <Image source={{ uri: item.imagenUrl }} style={styles.reservaImagen} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reservaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  reservaContent: {
    flex: 1,
  },
  deporteTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#555',
  },
  reservaImagen: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default Reservas;
