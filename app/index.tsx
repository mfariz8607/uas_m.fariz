import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import MovieCard from '@/components/MovieCard';

const API_KEY = 'b45dad4f';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export default function HomeScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const [selectedType, setSelectedType] = useState('All');

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        Keyboard.dismiss();
        setIsLoading(true);
        setMovies([]);
        setError(null);
        setCurrentPage(1);
        setSelectedType('All');

        try {
            const response = await fetch(`${API_URL}&s=${searchQuery}&page=1`);
            const data = await response.json();
            if (data.Response === "True") {
                setMovies(data.Search);
                setTotalResults(parseInt(data.totalResults, 10));
            } else {
                setError(data.Error || 'Film tidak ditemukan.');
            }
        } catch (e) {
            console.error(e);
            setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setMovies([]);
        setError(null);
        setCurrentPage(1);
        setTotalResults(0);
        setSelectedType('All');
    };

    const loadMoreMovies = async () => {
        if (isLoadingMore || movies.length >= totalResults) return;
        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        try {
            const response = await fetch(`${API_URL}&s=${searchQuery}&page=${nextPage}`);
            const data = await response.json();
            if (data.Response === "True") {
                setMovies(prevMovies => [...prevMovies, ...data.Search]);
                setCurrentPage(nextPage);
            }
        } catch (e) {
            console.error("Gagal memuat lebih banyak:", e);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        if (searchQuery === '' && totalResults > 0) {
            handleClearSearch();
        }
    }, [searchQuery]);

    const filterTypes = useMemo(() => {
        if (movies.length === 0) return [];
        const types = new Set(movies.map((movie: any) => movie.Type));
        return ['All', ...Array.from(types)];
    }, [movies]);

    const filteredMovies = useMemo(() => {
        if (selectedType === 'All') {
            return movies;
        }
        return movies.filter((movie: any) => movie.Type === selectedType);
    }, [movies, selectedType]);

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#00A3B8" style={{ marginTop: 50 }} />;
        }
        if (error) {
            return (
                <View style={styles.initialViewContainer}>
                    <MaterialIcons name="error-outline" size={80} color="#4A566E" />
                    <Text style={styles.initialViewText}>{error}</Text>
                </View>
            );
        }
        if (movies.length > 0) {
            return (
                <>
                    <View style={styles.filterContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {filterTypes.map(type => (
                                <TouchableOpacity
                                    key={type as string}
                                    style={[
                                        styles.filterButton,
                                        selectedType === type && styles.filterButtonActive
                                    ]}
                                    onPress={() => setSelectedType(type as string)}
                                >
                                    <Text style={[
                                        styles.filterButtonText,
                                        selectedType === type && styles.filterButtonTextActive
                                    ]}>
                                        {(type as string).charAt(0).toUpperCase() + (type as string).slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <FlatList
                        data={filteredMovies}
                        renderItem={({ item }) => <MovieCard movie={item} />}
                        keyExtractor={(item: any, index) => item.imdbID + '_' + index}
                        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
                        onEndReached={loadMoreMovies}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={isLoadingMore ? <ActivityIndicator size="small" color="#00A3B8" style={{ marginVertical: 20 }} /> : null}
                        ListEmptyComponent={() => (
                            <View style={styles.initialViewContainer}>
                                <Text style={styles.initialViewText}>Tidak ada hasil untuk tipe "{selectedType}"</Text>
                            </View>
                        )}
                    />
                </>
            );
        }
        return (
            <View style={styles.initialViewContainer}>
                <MaterialIcons name="local-movies" size={80} color="#4A566E" />
                <Text style={styles.initialViewText}>Cari film yang Anda inginkan.</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <View style={styles.inputContainer}>
                    <Feather name="search" size={20} color="#8F8F8F" style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Cari film..."
                        placeholderTextColor="#8F8F8F"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch} style={styles.clearIcon}>
                            <Feather name="x" size={20} color="#8F8F8F" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Cari</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.contentSection}>
                {renderContent()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A183E',
        paddingTop: 16,
    },
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E2A4D',
        borderRadius: 8,
        marginRight: 10,
    },
    searchIcon: {
        paddingLeft: 12,
    },
    input: {
        flex: 1,
        height: 48,
        color: '#FFFFFF',
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        paddingLeft: 8,
    },
    clearIcon: {
        padding: 12,
    },
    searchButton: {
        backgroundColor: '#00A3B8',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
    },
    contentSection: {
        flex: 1,
    },
    initialViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    initialViewText: {
        marginTop: 16,
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: '#9BA5C0',
        textAlign: 'center',
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    filterButton: {
        marginRight: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#1E2A4D',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterButtonActive: {
        backgroundColor: '#00A3B8',
        borderColor: '#00A3B8',
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Inter_400Regular',
    },
    filterButtonTextActive: {
        fontFamily: 'Inter_700Bold',
    }
});