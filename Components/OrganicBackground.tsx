import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrganicBackground({ children }: React.PropsWithChildren) {
  return (
    <View style={styles.root}>
      {/* Base wash */}
      <LinearGradient
        colors={['#0f3d33', '#1c7562ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft diagonal sweep */}
      <LinearGradient
        colors={['rgba(9,32,27,0.0)', 'rgba(9,32,27,0.55)', 'rgba(0, 0, 0, 0)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Broad patch */}
      <LinearGradient
        colors={['rgba(12,51,42,0.0)', 'rgba(30, 103, 12, 0.37)']}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 0.9, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle counter-sweep */}
      <LinearGradient
        colors={['rgba(5,24,20,0.0)', 'rgba(5,24,20,0.35)', 'rgba(2, 6, 3, 0.29)']}
        locations={[0, 0.55, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Grain overlay */}
      <Image
        source={require('../assets/Textures/grain.jpg')} // <-- add your PNG here
        style={styles.grain}
        resizeMode="repeat"
      />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#07d9abff' },
  content: { flex: 1 },
  grain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.10, // subtle, tweak as needed
    
  },
});
