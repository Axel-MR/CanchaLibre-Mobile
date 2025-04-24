import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReservasScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [centrosDeportivos, setCentrosDeportivos] = useState([]);
  const [canchasDisponibles, setCanchasDisponibles] = useState([]);
  const [selectedCentro, setSelectedCentro] = useState(null);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFin, setHoraFin] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Datos de ejemplo (luego se reemplazarán con datos reales de tu API)
  useEffect(() => {
    // Simulación de datos del backend
    const mockCentros = [
      {
        id: '1',
        nombre: 'Deportivo 1° de Mayo',
        ubicacion: 'Av. Principal 123',
        imagenUrl: 'https://ejemplo.com/imagen1.jpg',
        canchas: [
          {
            id: 'c1',
            nombre: 'Cancha 1 - Fútbol Rápido',
            deporte: 'Fútbol',
            alumbrado: true,
            jugadores: 10,
            imagenUrl: 'https://ejemplo.com/cancha1.jpg'
          },
          // Más canchas...
        ]
      },
      // Más centros deportivos...
    ];
    setCentrosDeportivos(mockCentros);
  }, []);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setHoraInicio(time);
      setHoraFin(new Date(time.getTime() + 60 * 60 * 1000)); // +1 hora
    }
  };

  const handleReservar = () => {
    // Lógica para crear la reserva
    console.log('Reserva creada:', {
      fecha: selectedDate,
      horaInicio,
      horaFin,
      centroDeportivoId: selectedCentro?.id,
      canchaId: selectedCancha?.id
    });
    // Aquí iría la llamada a tu API
  };

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RESERVAR CANCHA</Text>
      </View>

      {/* Selector de fecha */}
      <TouchableOpacity 
        style={styles.dateSelector}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name="calendar" size={24} color="#2f95dc" />
        <Text style={styles.dateText}>
          {selectedDate.toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </TouchableOpacity>

      {/* Selector de hora */}
      <TouchableOpacity 
        style={styles.timeSelector}
        onPress={() => setShowTimePicker(true)}
      >
        <Ionicons name="time" size={24} color="#2f95dc" />
        <Text style={styles.timeText}>
          {horaInicio.toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })} - {horaFin.toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
        {showTimePicker && (
          <DateTimePicker
            value={horaInicio}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </TouchableOpacity>

      {/* Lista de centros deportivos */}
      <Text style={styles.sectionTitle}>CENTROS DEPORTIVOS</Text>
      <FlatList
        horizontal
        data={centrosDeportivos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.centroCard,
              selectedCentro?.id === item.id && styles.selectedCentroCard
            ]}
            onPress={() => {
              setSelectedCentro(item);
              setSelectedCancha(null);
              setCanchasDisponibles(item.canchas);
            }}
          >
            <Image 
              source={{ uri: item.imagenUrl || 'https://via.placeholder.com/150' }} 
              style={styles.centroImage}
            />
            <Text style={styles.centroName}>{item.nombre}</Text>
            <Text style={styles.centroLocation}>{item.ubicacion}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.centrosList}
      />

      {/* Canchas disponibles */}
      {selectedCentro && (
        <>
          <Text style={styles.sectionTitle}>CANCHAS DISPONIBLES</Text>
          <FlatList
            data={canchasDisponibles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.canchaCard,
                  selectedCancha?.id === item.id && styles.selectedCanchaCard
                ]}
                onPress={() => setSelectedCancha(item)}
              >
                <Image 
                  source={{ uri: item.imagenUrl || 'https://via.placeholder.com/150' }} 
                  style={styles.canchaImage}
                />
                <View style={styles.canchaInfo}>
                  <Text style={styles.canchaName}>{item.nombre}</Text>
                  <Text style={styles.canchaDetails}>
                    {item.deporte} • {item.jugadores} jugadores • 
                    {item.alumbrado ? ' Con alumbrado' : ' Sin alumbrado'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.canchasList}
          />
        </>
      )}

      {/* Botón de reserva */}
      {selectedCancha && (
        <TouchableOpacity 
          style={styles.reservarButton}
          onPress={handleReservar}
        >
          <Text style={styles.reservarButtonText}>CONFIRMAR RESERVA</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Vista previa de la reserva (similar a tu diseño) */}
      {selectedCancha && (
        <View style={styles.reservaPreview}>
          <Text style={styles.previewTitle}>DETALLES DE LA RESERVA</Text>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Deporte:</Text>
            <Text style={styles.previewValue}>{selectedCancha.deporte}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Fecha:</Text>
            <Text style={styles.previewValue}>
              {selectedDate.toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Horario:</Text>
            <Text style={styles.previewValue}>
              {horaInicio.toLocaleTimeString('es-MX', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })} - {horaFin.toLocaleTimeString('es-MX', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Cancha:</Text>
            <Text style={styles.previewValue}>{selectedCancha.nombre}</Text>
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>Ubicación:</Text>
            <Text style={styles.previewValue}>{selectedCentro.ubicacion}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f95dc',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
  },
  timeText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  centrosList: {
    paddingBottom: 10,
  },
  centroCard: {
    width: 200,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCentroCard: {
    borderWidth: 2,
    borderColor: '#2f95dc',
  },
  centroImage: {
    width: '100%',
    height: 120,
  },
  centroName: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  centroLocation: {
    padding: 10,
    paddingTop: 0,
    fontSize: 14,
    color: '#666',
  },
  canchasList: {
    paddingBottom: 20,
  },
  canchaCard: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCanchaCard: {
    borderWidth: 2,
    borderColor: '#2f95dc',
  },
  canchaImage: {
    width: 100,
    height: 100,
  },
  canchaInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  canchaName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  canchaDetails: {
    fontSize: 14,
    color: '#666',
  },
  reservarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f95dc',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  reservarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  reservaPreview: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2f95dc',
    textAlign: 'center',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  previewValue: {
    color: '#333',
  },
});

export default ReservasScreen;