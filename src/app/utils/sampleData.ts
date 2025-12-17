import { Album, Review } from '../App';

// Sample albums to help users get started
export const sampleAlbums: Album[] = [
  {
    id: 'sample-1',
    artist: 'Sample Artist 1',
    title: 'Sample Album Title',
    releaseYear: 2023,
    genre: 'Rock',
    releaseType: 'Studio',
    coverUrl: 'https://via.placeholder.com/400/9c27b0/ffffff?text=Sample+Album+1',
    discoverySource: 'Friend',
    discoveryNotes: 'This is a sample album to show you how the app works!',
    dateAdded: new Date().toISOString()
  },
  {
    id: 'sample-2',
    artist: 'Sample Artist 2',
    title: 'Another Great Album',
    releaseYear: 2022,
    genre: 'Jazz',
    releaseType: 'Live',
    coverUrl: 'https://via.placeholder.com/400/e91e63/ffffff?text=Sample+Album+2',
    discoverySource: 'Algorithm',
    discoveryNotes: 'You can delete these sample albums and add your own!',
    dateAdded: new Date().toISOString()
  }
];

export const sampleReviews: Review[] = [
  {
    albumId: 'sample-1',
    rating: 5,
    dateFirstListened: '2023-06-15',
    dateReviewed: new Date().toISOString().split('T')[0],
    favoriteTrack: [
      {
        name: 'Track 1',
        timestamp: '2:34',
        notes: 'Amazing guitar solo!'
      }
    ],
    personalNotes: 'This is a sample review. Click the album card and edit this review to make it your own, or delete it and add your favorite albums!',
    emotionalTags: ['Happy', 'Energetic', 'Uplifting']
  }
];

// Function to load sample data (only if no data exists)
export function loadSampleDataIfEmpty() {
  const existingAlbums = localStorage.getItem('music_journal_albums');
  
  if (!existingAlbums || JSON.parse(existingAlbums).length === 0) {
    localStorage.setItem('music_journal_albums', JSON.stringify(sampleAlbums));
    localStorage.setItem('music_journal_reviews', JSON.stringify(sampleReviews));
    return true; // Indicate that sample data was loaded
  }
  
  return false; // User already has data
}
