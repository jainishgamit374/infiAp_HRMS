import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CompanyPolicies = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CompanyPolicies</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CompanyPolicies;
