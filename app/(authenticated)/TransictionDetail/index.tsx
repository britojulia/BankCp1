import { Text, View, StyleSheet } from 'react-native';

export default function TransactionDetail() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TransactionDetail</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#2e3e5c',
  },
});
