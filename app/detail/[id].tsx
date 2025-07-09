import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ratingIcons = {
    'Internet Movie Database': require('@/assets/images/imdb.png'),
    'Rotten Tomatoes': require('@/assets/images/rotten-tomatoes.png'),
    'Metacritic': require('@/assets/images/metacritic.png'),
};

const API_KEY = 'b45dad4f';
const API_URL_DETAIL = `https://www.omdbapi.com/?apikey=${API_KEY}&i=`;

interface Rating {
    Source: string;
    Value: string;
}

interface MovieDetail {
    Title: string;
    Year: string;
    Rated: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Awards: string;
    Poster: string;
    Ratings: Rating[];
    imdbVotes: string;
    DVD: string;
    Production: string;
    Website: string;
    [key: string]: any; 
}

export default function MovieDetailPage() {
    const { id } = useLocalSearchParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!id) return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL_DETAIL}${id}`);
                const data = await response.json();
                if (data.Response === "True") {
                    setMovie(data);
                } else {
                    setError(data.Error || 'Detail film tidak ditemukan.');
                }
            } catch (e) {
                console.error(e);
                setError('Gagal memuat detail film. Periksa koneksi internet Anda.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovieDetails();
    }, [id]);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#00A3B8" style={styles.loadingContainer} />;
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!movie) return null;

    const handleLinkPress = (url: string) => {
        const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
        Linking.canOpenURL(validUrl).then(supported => {
            if (supported) {
                Linking.openURL(validUrl);
            } else {
                console.log("Tidak bisa membuka URL: " + validUrl);
            }
        });
    };

    const renderDetailItem = (label: string, value?: string, isLink: boolean = false) => {
        if (!value || value === 'N/A') return null;
        return (
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{label}</Text>
                {isLink ? (
                    <TouchableOpacity onPress={() => handleLinkPress(value)}>
                        <Text style={[styles.detailValue, styles.linkValue]}>{value}</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.detailValue}>{value}</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Poster' }}
                style={styles.poster}
            />

            <ScrollView style={styles.scrollableContainer}>
                <View style={styles.mainInfoContainer}>
                    <Text style={styles.title}>{movie.Title}</Text>
                    
                    <Text style={styles.subInfo}>
                        {[movie.Year, movie.Rated, movie.Runtime, movie.Type].filter(item => item && item !== 'N/A').join(' | ')}
                    </Text>

                    {movie.Genre && movie.Genre !== 'N/A' && (
                        <View style={styles.genreContainer}>
                            {movie.Genre.split(', ').map((genre, index) => (
                                <View key={index} style={styles.genrePill}>
                                    <Text style={styles.genreText}>{genre}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <Text style={styles.plot}>{movie.Plot !== 'N/A' ? movie.Plot : ''}</Text>
                </View>
                
                <View style={styles.detailsListContainer}>
                    {renderDetailItem('Director', movie.Director)}
                    {renderDetailItem('Writer', movie.Writer)}
                    {renderDetailItem('Actors', movie.Actors)}
                    {renderDetailItem('Awards', movie.Awards)}
                    {renderDetailItem('Released', movie.Released)}
                    {renderDetailItem('Language', movie.Language)}
                    {renderDetailItem('Country', movie.Country)}
                    {renderDetailItem('BoxOffice', movie.BoxOffice)}
                    {renderDetailItem('DVD Release', movie.DVD)}
                    {renderDetailItem('Production', movie.Production)}
                    {renderDetailItem('Website', movie.Website, true)}
                </View>

                {movie.Ratings && movie.Ratings.length > 0 && (
                    <View style={styles.ratingsSection}>
                        {movie.Ratings.map((rating, index) => (
                            <View key={index} style={styles.ratingBox}>
                                <Image source={ratingIcons[rating.Source as keyof typeof ratingIcons]} style={styles.ratingIcon} />
                                <Text style={styles.ratingSource}>{rating.Source}</Text>
                                <Text style={styles.ratingValue}>{rating.Value}</Text>
                                {rating.Source === 'Internet Movie Database' && movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                                    <Text style={styles.imdbVotesText}>{movie.imdbVotes}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F1E3E',
    },
    scrollableContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F1E3E',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
    },
    poster: {
        width: 180,
        height: 270,
        borderRadius: 12,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    mainInfoContainer: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'InknutAntiqua_700Bold',
        fontSize: 26,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subInfo: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: '#9BA5C0',
        marginBottom: 16,
        textTransform: 'capitalize',
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 16,
    },
    genrePill: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
    },
    genreText: {
        color: '#E0E0E0',
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    plot: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        lineHeight: 24,
        color: '#E0E0E0',
        textAlign: 'center',
        marginBottom: 24,
    },
    detailsListContainer: {
        paddingHorizontal: 16,
    },
    detailItem: {
        paddingVertical: 16,
        borderTopWidth: 1,
        borderColor: '#2D2C5A',
    },
    detailLabel: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    detailValue: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: '#9BA5C0',
    },
    linkValue: {
        color: '#61dafb',
        textDecorationLine: 'underline',
    },
    ratingsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        padding: 16,
        marginTop: 16,
    },
    ratingBox: {
        borderWidth: 1,
        borderColor: '#2D2C5A',
        borderRadius: 10,
        backgroundColor: '#171630',
        padding: 16,
        alignItems: 'center',
        width: '90%',
        minWidth: 100,
        marginBottom: 10,
    },
    ratingIcon: {
        width: 40,
        height: 40,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    ratingSource: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: '#9BA5C0',
        textAlign: 'center',
        marginBottom: 4,
    },
    ratingValue: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    imdbVotesText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: '#9BA5C0',
        marginTop: 2,
    },
});