import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface Movie {
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
    imdbID: string;
}

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const posterUrl = (movie.Poster && movie.Poster !== 'N/A') 
        ? movie.Poster 
        : 'https://via.placeholder.com/100x150.png?text=No+Image';

    const handlePress = () => {
        router.push(`/detail/${movie.imdbID}`);
    };

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
            <Image
                source={{ uri: posterUrl }}
                style={styles.posterImage}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.typeText}>{movie.Type}</Text>
                <Text style={styles.titleText} numberOfLines={3}>{movie.Title}</Text>
                <Text style={styles.yearText}>{movie.Year}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#1F1E3E',
        borderRadius: 10,
        marginBottom: 16,
        overflow: 'hidden',
        marginHorizontal: 16,
    },
    posterImage: {
        width: 100,
        height: 150,
        backgroundColor: '#333'
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    typeText: {
        fontFamily: 'Inter_400Regular',
        color: '#9BA5C0',
        fontSize: 12,
        textTransform: 'capitalize',
    },
    titleText: {
        fontFamily: 'Inter_700Bold',
        color: '#FFFFFF',
        fontSize: 16,
        flexShrink: 1,
        textAlign: 'center',
    },
    yearText: {
        fontFamily: 'Inter_400Regular',
        color: '#FFFFFF',
        fontSize: 14,
        alignSelf: 'flex-end',
    },
});

export default MovieCard;