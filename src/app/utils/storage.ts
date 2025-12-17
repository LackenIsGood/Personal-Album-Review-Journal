import { Album, Review, ListeningHistory } from '../App';

const ALBUMS_KEY = 'music_journal_albums';
const REVIEWS_KEY = 'music_journal_reviews';
const HISTORY_KEY = 'music_journal_history';

// Albums
export function getAlbums(): Album[] {
  const data = localStorage.getItem(ALBUMS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveAlbum(album: Album): void {
  const albums = getAlbums();
  const existingIndex = albums.findIndex(a => a.id === album.id);
  
  if (existingIndex >= 0) {
    albums[existingIndex] = album;
  } else {
    albums.push(album);
  }
  
  localStorage.setItem(ALBUMS_KEY, JSON.stringify(albums));
}

export function deleteAlbum(id: string): void {
  const albums = getAlbums().filter(a => a.id !== id);
  localStorage.setItem(ALBUMS_KEY, JSON.stringify(albums));
  
  // Also delete associated reviews and history
  const reviews = getReviews().filter(r => r.albumId !== id);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  
  const history = getListeningHistory().filter(h => h.albumId !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getAlbumById(id: string): Album | undefined {
  return getAlbums().find(a => a.id === id);
}

// Reviews
export function getReviews(): Review[] {
  const data = localStorage.getItem(REVIEWS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveReview(review: Review): void {
  const reviews = getReviews();
  const existingIndex = reviews.findIndex(r => r.albumId === review.albumId);
  
  if (existingIndex >= 0) {
    reviews[existingIndex] = review;
  } else {
    reviews.push(review);
  }
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function getReviewByAlbumId(albumId: string): Review | undefined {
  return getReviews().find(r => r.albumId === albumId);
}

// Listening History
export function getListeningHistory(): ListeningHistory[] {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function addListeningEntry(albumId: string): void {
  const history = getListeningHistory();
  history.push({
    albumId,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getListenCount(albumId: string): number {
  return getListeningHistory().filter(h => h.albumId === albumId).length;
}

export function getListeningHistoryByAlbum(albumId: string): ListeningHistory[] {
  return getListeningHistory().filter(h => h.albumId === albumId);
}
