import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useFonts, InknutAntiqua_700Bold } from '@expo-google-fonts/inknut-antiqua';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import SplashScreenComponent from '@/components/SplashScreen';

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        InknutAntiqua_700Bold,
        Inter_400Regular,
        Inter_700Bold,
    });

    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            const timer = setTimeout(() => {
                setAppIsReady(true);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    if (!appIsReady) {
        return <SplashScreenComponent />;
    }

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerTitle: 'MovieMind',
                        headerStyle: { backgroundColor: '#0A183E' },
                        headerTitleStyle: {
                            fontFamily: 'InknutAntiqua_700Bold',
                            color: '#FFFFFF',
                            fontSize: 24,
                        },
                        headerShadowVisible: false,
                        headerTitleAlign: 'left',
                    }}
                />
                <Stack.Screen 
                    name="detail/[id]" 
                    options={{ 
                        title: 'MovieMind',
                        headerStyle: { backgroundColor: '#0A183E' },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontFamily: 'InknutAntiqua_700Bold',
                            color: '#FFFFFF',
                            fontSize: 24,
                        }
                    }} 
                />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}