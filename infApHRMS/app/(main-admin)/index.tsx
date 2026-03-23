import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MainAdminBottomNav } from '../../components/MainAdminBottomNav';

const MainAdminDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main Admin Dashboard</Text>
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => router.push('/(main-admin)/system-alerts')}
      >
        <Text style={styles.btnText}>View System Alerts</Text>
      </TouchableOpacity>
      <MainAdminBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default MainAdminDashboard;
