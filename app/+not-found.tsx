import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    color: '#000',
    marginBottom: 16,
  },
  link: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  linkText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});