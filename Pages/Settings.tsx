import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      {/* Title bar */}
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>Settings</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.text}>Welcome to the Settings Page 🎉</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3d33',
  },
  titleBox: {
    backgroundColor: '#0f3d33',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0c332a', // slightly darker border
    alignItems: 'center',
    marginTop: 40, // pushes title down from top
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'horizon',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'InterRegular',
  },
});
