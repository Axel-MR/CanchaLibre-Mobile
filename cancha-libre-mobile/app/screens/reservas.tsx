import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import api from "../../services/api";
import * as SecureStore from "expo-secure-store";

// Datos mock para canchas (ya que no hay endpoint para obtenerlas)
const CANCHAS_MOCK = [
  {
    id: '1',
    nombre: 'Cancha 1',
    deporte: 'Fútbol Rápido',
    alumbrado: true,
    jugadores: 10,
    imagenUrl: 'https://via.placeholder.com/400x200',
    centroDeportivoId: '1',
  },
  {
    id: '2',
    nombre: 'Cancha 2',
    deporte: 'Tenis',
    alumbrado: true,
    jugadores: 2,
    imagenUrl: 'https://via.placeholder.com/400x200',
    centroDeportivoId: '1',
  },
  {
    id: '3',
    nombre: 'Cancha 3',
    deporte: 'Básquet',
    alumbrado: false,
    jugadores: 10,
    imagenUrl: 'https://via.placeholder.com/400x200',
    centroDeportivoId: '2',
  },
];

// Datos mock para reservas (ya que no hay endpoint para obtenerlas)
const RESERVAS_MOCK = [
  {
    id: '1',
    fecha: new Date(2025, 3, 26), // 26 de abril de 2025 (hoy)
    horaInicio: new Date(2025, 3, 26, 21, 0), // 21:00
    horaFin: new Date(2025, 3, 26, 22, 0), // 22:00
    centroDeportivoId: '1',
    canchaId: '1',
    reservadorId: null, // Sin reservador (disponible)
  },
  {
    id: '2',
    fecha: new Date(2025, 3, 27), // 27 de abril de 2025 (mañana)
    horaInicio: new Date(2025, 3, 27, 10, 0), // 10:00
    horaFin: new Date(2025, 3, 27, 12, 0), // 12:00
    centroDeportivoId: '1',
    canchaId: '2',
    reservadorId: null, // Sin reservador (disponible)
  },
  {
    id: '3',
    fecha: new Date(2025, 3, 28), // 28 de abril de 2025
    horaInicio: new Date(2025, 3, 28, 18, 0), // 18:00
    horaFin: new Date(2025, 3, 28, 19, 0), // 19:00
    centroDeportivoId: '2',
    canchaId: '3',
    reservadorId: null, // Sin reservador (disponible)
  },
];

const Reservas = () => {
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [centrosDeportivos, setCentrosDeportivos] = useState([]);
  const [canchas, setCanchas] = useState(CANCHAS_MOCK); // Usar datos mock
  const [reservasDisponibles, setReservasDisponibles] = useState([]);
  const router = useRouter();

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      // Cargar centros deportivos (esta ruta sí funciona)
      const centrosResponse = await api.get('/centros-deportivos');
      if (centrosResponse.data && centrosResponse.data.data) {
        setCentrosDeportivos(centrosResponse.data.data);
      }

      // Usar datos mock para canchas
      setCanchas(CANCHAS_MOCK);

      // Filtrar reservas mock para mostrar solo las disponibles
      // y con fecha igual o posterior a hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Establecer a inicio del día
      
      const reservasFiltradas = RESERVAS_MOCK.filter(reserva => {
        const fechaReserva = new Date(reserva.fecha);
        fechaReserva.setHours(0, 0, 0, 0);
        return !reserva.reservadorId && fechaReserva >= hoy;
      });
      
      setReservasDisponibles(reservasFiltradas);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      let errorMessage = "Error al cargar los datos";
      if (error.response?.status === 401) {
        errorMessage = "No autorizado. Por favor inicia sesión nuevamente";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert("Error", errorMessage);
      
      // Si hay error al cargar centros, usar datos mock para todo
      setCentrosDeportivos([
        {
          id: '1',
          nombre: 'Deportivo 1° de Mayo',
          ubicacion: 'Av. Libertad 1200',
          imagenUrl: 'https://via.placeholder.com/400x200',
        },
        {
          id: '2',
          nombre: 'Complejo Municipal',
          ubicacion: 'Calle Principal 500',
          imagenUrl: 'https://via.placeholder.com/400x200',
        },
      ]);
      setCanchas(CANCHAS_MOCK);
      setReservasDisponibles(RESERVAS_MOCK.filter(r => !r.reservadorId));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const navigateToCrearReservas = () => {
    console.log("Intentando navegar a Crear Reservas...");
    try {
      router.push("/screens/crearReserva");
    } catch (error) {
      console.error("Error al navegar:", error);
      Alert.alert("Error de navegación", "No se pudo navegar a la pantalla Crear Reservas");
    }
  };

  const verDetalleReserva = (reserva) => {
    setSelectedReserva(reserva);
    setModalVisible(true);
  };

  const getNombreCentroDeportivo = (id) => {
    const centro = centrosDeportivos.find(c => c.id === id);
    return centro ? centro.nombre : 'Desconocido';
  };

  const getNombreCancha = (id) => {
    const cancha = canchas.find(c => c.id === id);
    return cancha ? cancha.nombre : 'Desconocida';
  };

  const getDeporteCancha = (id) => {
    const cancha = canchas.find(c => c.id === id);
    return cancha ? cancha.deporte : 'Desconocido';
  };

  const handleReservar = async (reservaId) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      // Aquí implementarías la llamada a la API para reservar
      // Por ahora, solo mostraremos un mensaje
      Alert.alert(
        "Reserva exitosa",
        "La cancha ha sido reservada correctamente.",
        [
          { 
            text: "OK", 
            onPress: () => {
              setModalVisible(false);
              // Actualizar la lista de reservas disponibles
              setReservasDisponibles(
                reservasDisponibles.filter(r => r.id !== reservaId)
              );
            } 
          }
        ]
      );
    } catch (error) {
      console.error("Error al reservar:", error);
      Alert.alert("Error", "No se pudo completar la reserva");
    }
  };

  const renderReservaItem = ({ item }) => {
    const centro = centrosDeportivos.find(c => c.id === item.centroDeportivoId);
    const cancha = canchas.find(c => c.id === item.canchaId);

    return (
      <TouchableOpacity 
        style={styles.reservaCard}
        onPress={() => verDetalleReserva(item)}
      >
        <View style={styles.reservaContent}>
          <Text style={styles.deporteTitulo}>{getDeporteCancha(item.canchaId)}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(item.fecha), 'yyyy-MM-dd')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hora:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(item.horaInicio), 'HH:mm')} - {format(new Date(item.horaFin), 'HH:mm')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Centro Deportivo:</Text>
            <Text style={styles.infoValue}>{centro?.nombre || 'Desconocido'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cancha:</Text>
            <Text style={styles.infoValue}>{cancha?.nombre || 'Desconocida'}</Text>
          </View>
        </View>
        
        <Image 
          source={{ uri: centro?.imagenUrl || 'https://via.placeholder.com/400x200' }} 
          style={styles.reservaImagen} 
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  const DetalleReservaModal = () => {
    if (!selectedReserva) return null;

    const centro = centrosDeportivos.find(c => c.id === selectedReserva.centroDeportivoId);
    const cancha = canchas.find(c => c.id === selectedReserva.canchaId);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalle de Reserva</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Centro Deportivo:</Text>
              <Text style={styles.modalText}>{centro?.nombre || 'Desconocido'}</Text>
              <Text style={styles.modalText}>{centro?.ubicacion || 'Ubicación no disponible'}</Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Cancha:</Text>
              <Text style={styles.modalText}>
                {cancha?.nombre || 'Desconocida'} ({cancha?.deporte || 'Deporte no especificado'})
              </Text>
              {cancha && (
                <Text style={styles.modalText}>
                  Para {cancha.jugadores} jugadores - {cancha.alumbrado ? 'Con alumbrado' : 'Sin alumbrado'}
                </Text>
              )}
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Fecha y Hora:</Text>
              <Text style={styles.modalText}>
                {format(new Date(selectedReserva.fecha), 'EEEE, d MMMM yyyy', { locale: es })}
              </Text>
              <Text style={styles.modalText}>
                {format(new Date(selectedReserva.horaInicio), 'HH:mm')} - {format(new Date(selectedReserva.horaFin), 'HH:mm')}
              </Text>
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.buttonReservar}
                onPress={() => handleReservar(selectedReserva.id)}
              >
                <Text style={styles.buttonText}>Reservar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.buttonCerrar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Cargando reservas disponibles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reservas Disponibles</Text>
      </View>
      
      <View style={styles.content}>
        <FlatList
          data={reservasDisponibles}
          keyExtractor={(item) => item.id}
          renderItem={renderReservaItem}
          contentContainerStyle={styles.reservasList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2196F3"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No hay reservas disponibles</Text>
            </View>
          }
        />
      </View>
      
      <DetalleReservaModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 15,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  reservasList: {
    padding: 10,
  },
  reservaCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    flexDirection: 'column',
    width: '100%',
  },
  reservaContent: {
    padding: 16,
  },
  deporteTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  reservaImagen: {
    width: '100%',
    height: 180,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 15,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2196F3',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 3,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonReservar: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  buttonCerrar: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    marginTop: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default Reservas;