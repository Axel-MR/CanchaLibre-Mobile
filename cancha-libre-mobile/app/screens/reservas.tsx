import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

// Mock data (reemplazar por llamadas a la API)
const CENTROS_DEPORTIVOS = [
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
];

const CANCHAS = [
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

const RESERVAS = [
  {
    id: '1',
    fecha: new Date(2025, 1, 20), // 20 de febrero de 2025
    horaInicio: new Date(2025, 1, 20, 21, 0), // 21:00
    horaFin: new Date(2025, 1, 20, 22, 0), // 22:00
    centroDeportivoId: '1',
    canchaId: '1',
    reservadorId: '1',
  },
  {
    id: '2',
    fecha: new Date(2025, 3, 25), // 25 de abril de 2025
    horaInicio: new Date(2025, 3, 25, 10, 0), // 10:00
    horaFin: new Date(2025, 3, 25, 12, 0), // 12:00
    centroDeportivoId: '1',
    canchaId: '2',
    reservadorId: '1',
  },
  {
    id: '3',
    fecha: new Date(2025, 3, 26), // 26 de abril de 2025
    horaInicio: new Date(2025, 3, 26, 18, 0), // 18:00
    horaFin: new Date(2025, 3, 26, 19, 0), // 19:00
    centroDeportivoId: '2',
    canchaId: '3',
    reservadorId: '1',
  },
];

const USUARIOS = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '123-456-7890',
  }
];

// Componente principal
const Reservas = () => {
  const [selectedTab, setSelectedTab] = useState('reservas');
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const navigateToCrearReservas = () => {
    console.log("Intentando navegar a Reservas...");
    try {
      router.push("/screens/crearReserva");
    } catch (error) {
      console.error("Error al navegar:", error);
      Alert.alert("Error de navegación", "No se pudo navegar a la pantalla Crear Reservas");
    }
  };

  const navigateToCrearCentroDeportivo = () => {
    console.log("Intentando navegar a Reservas...");
    try {
      router.push("/screens/crearCentroDeportivo");
    } catch (error) {
      console.error("Error al navegar:", error);
      Alert.alert("Error de navegación", "No se pudo navegar a la pantalla Crear Centros Deportivos");
    }
  };

  const verDetalleReserva = (reserva) => {
    setSelectedReserva(reserva);
    setModalVisible(true);
  };

  const getNombreCentroDeportivo = (id) => {
    const centro = CENTROS_DEPORTIVOS.find(c => c.id === id);
    return centro ? centro.nombre : 'Desconocido';
  };

  const getNombreCancha = (id) => {
    const cancha = CANCHAS.find(c => c.id === id);
    return cancha ? cancha.nombre : 'Desconocida';
  };

  const getDeporteCancha = (id) => {
    const cancha = CANCHAS.find(c => c.id === id);
    return cancha ? cancha.deporte : 'Desconocido';
  };

  const renderReservaItem = ({ item }) => {
    const centro = CENTROS_DEPORTIVOS.find(c => c.id === item.centroDeportivoId);
    const cancha = CANCHAS.find(c => c.id === item.canchaId);

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
              {format(item.fecha, 'yyyy-MM-dd')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hora:</Text>
            <Text style={styles.infoValue}>
              {format(item.horaInicio, 'HH:mm')} - {format(item.horaFin, 'HH:mm')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Centro Deportivo:</Text>
            <Text style={styles.infoValue}>{centro?.nombre}</Text>
          </View>
        </View>
        
        <Image 
          source={{ uri: centro?.imagenUrl }} 
          style={styles.reservaImagen} 
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  const renderCentrosTab = () => (
    <FlatList
      data={CENTROS_DEPORTIVOS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.centroCard}>
          <Image source={{ uri: item.imagenUrl }} style={styles.centroImagen} />
          <View style={styles.centroInfo}>
            <Text style={styles.centroNombre}>{item.nombre}</Text>
            <Text style={styles.centroUbicacion}>{item.ubicacion}</Text>
            <Text style={styles.centroCancha}>
              Canchas disponibles: {CANCHAS.filter(c => c.centroDeportivoId === item.id).length}
            </Text>
          </View>
        </View>
      )}
    />
  );

  const renderCanchasTab = () => (
    <FlatList
      data={CANCHAS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.canchaCard}>
          <Image source={{ uri: item.imagenUrl }} style={styles.canchaImagen} />
          <View style={styles.canchaInfo}>
            <Text style={styles.canchaDeporte}>{item.deporte}</Text>
            <Text style={styles.canchaNombre}>
              {item.nombre} - {getNombreCentroDeportivo(item.centroDeportivoId)}
            </Text>
            <View style={styles.canchaDetalles}>
              <Text style={styles.canchaJugadores}>Para {item.jugadores} jugadores</Text>
              <Text style={styles.canchaAlumbrado}>
                {item.alumbrado ? '✓ Con alumbrado' : '✗ Sin alumbrado'}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );

  const renderReservasTab = () => (
    <>
      <FlatList
        data={RESERVAS}
        keyExtractor={(item) => item.id}
        renderItem={renderReservaItem}
        contentContainerStyle={styles.reservasList}
      />
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={navigateToCrearReservas}
      >
        <Text style={styles.reserveButtonText}>Crear Reserva</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reserveButton}
        onPress={navigateToCrearCentroDeportivo}
      >
        <Text style={styles.reserveButtonText}>Crear Centro Deportivo</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </>
  );

  const DetalleReservaModal = () => {
    if (!selectedReserva) return null;

    const centro = CENTROS_DEPORTIVOS.find(c => c.id === selectedReserva.centroDeportivoId);
    const cancha = CANCHAS.find(c => c.id === selectedReserva.canchaId);

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
              <Text style={styles.modalText}>{centro?.nombre}</Text>
              <Text style={styles.modalText}>{centro?.ubicacion}</Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Cancha:</Text>
              <Text style={styles.modalText}>{cancha?.nombre} ({cancha?.deporte})</Text>
              <Text style={styles.modalText}>
                Para {cancha?.jugadores} jugadores - {cancha?.alumbrado ? 'Con alumbrado' : 'Sin alumbrado'}
              </Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Fecha y Hora:</Text>
              <Text style={styles.modalText}>
                {format(selectedReserva.fecha, 'EEEE, d MMMM yyyy', { locale: es })}
              </Text>
              <Text style={styles.modalText}>
                {format(selectedReserva.horaInicio, 'HH:mm')} - {format(selectedReserva.horaFin, 'HH:mm')}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.buttonCerrar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reservas Disponibles</Text>
      </View>
      
      <View style={styles.content}>
        {selectedTab === 'centros' && renderCentrosTab()}
        {selectedTab === 'canchas' && renderCanchasTab()}
        {selectedTab === 'reservas' && renderReservasTab()}
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'centros' && styles.tabSelected]}
          onPress={() => setSelectedTab('centros')}
        >
          <Text style={[styles.tabText, selectedTab === 'centros' && styles.tabTextSelected]}>
            Centros
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'canchas' && styles.tabSelected]}
          onPress={() => setSelectedTab('canchas')}
        >
          <Text style={[styles.tabText, selectedTab === 'canchas' && styles.tabTextSelected]}>
            Canchas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'reservas' && styles.tabSelected]}
          onPress={() => setSelectedTab('reservas')}
        >
          <Text style={[styles.tabText, selectedTab === 'reservas' && styles.tabTextSelected]}>
            Reservas
          </Text>
        </TouchableOpacity>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabSelected: {
    borderTopWidth: 2,
    borderTopColor: '#2196F3',
  },
  tabText: {
    color: '#757575',
    fontSize: 16,
  },
  tabTextSelected: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  centroCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
  },
  centroImagen: {
    width: 100,
    height: 100,
  },
  centroInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  centroNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  centroUbicacion: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  centroCancha: {
    fontSize: 14,
    color: '#2196F3',
  },
  canchaCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
  },
  canchaImagen: {
    width: 100,
    height: 100,
  },
  canchaInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  canchaDeporte: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  canchaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  canchaDetalles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  canchaJugadores: {
    fontSize: 14,
    color: '#757575',
  },
  canchaAlumbrado: {
    fontSize: 14,
    color: '#757575',
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
  buttonCerrar: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reserveButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    margin: 16,
    elevation: 3,
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default Reservas;