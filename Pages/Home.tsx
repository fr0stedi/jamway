import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OrganicBackground from '../Components/OrganicBackground'; // ⬅️ adjust path if needed

export default function Home() {
  return (
    <OrganicBackground>
      <View style={styles.container}>
        {/* Title bar */}
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Home</Text>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.text}>Welcome to the Home Page 🎉</Text>
        </View>
      </View>
    </OrganicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // let the organic gradient show
  },
  titleBox: {
    backgroundColor: 'transparent',      // same as app (transparent over gradient)
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0c332a',         // slightly darker separator
    alignItems: 'center',                 // center title horizontally
    marginTop: 40,                        // push it a bit lower
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'horizon',              // ⬅️ use the loaded key, not "horizon"
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',             // center content vertically
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'InterRegular',
  },
});
