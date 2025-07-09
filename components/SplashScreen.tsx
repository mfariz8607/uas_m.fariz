import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreenComponent() {
    return (
        <LinearGradient
            colors={['#0A183E', '#1F1E3E']}
            style={styles.container}
        >
            <Text style={styles.textLogo}>MovieMind</Text>
            <Text style={styles.textSubLogo}>
                Tempat Untuk Mendapatkan Semua Info Film
            </Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLogo: {
        fontSize: 52,
        color: 'white',
        fontFamily: 'InknutAntiqua_700Bold',
        marginBottom: 8,
    },
    textSubLogo: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Inter_400Regular',
    },
});