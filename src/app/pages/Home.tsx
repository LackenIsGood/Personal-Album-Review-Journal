import { useState, useEffect } from 'react';
import { Album, Review, Page } from '../App';
import { getAlbums, getReviews, getListenCount, deleteAlbum } from '../utils/storage';
import { Star, Music, Calendar, Disc3, Filter, X, Play, Trash2, Edit, Share2 } from 'lucide-react';
import { ShareCard } from '../components/ShareCard';

interface HomeProps {
  navigateTo: (page: Page, albumId?: string) => void;
}

export function Home({ navigateTo }: HomeProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterArtist, setFilterArtist] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'artist' | 'year'>('recent');
  const [shareCard, setShareCard] = useState<{ album: Album; review: Review } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAlbums(getAlbums());
    setReviews(getReviews());
  };

  const getReviewForAlbum = (albumId: string): Review | undefined => {
    return reviews.find(r => r.albumId === albumId);
  };

  const genres = [...new Set(albums.map(a => a.genre))].filter(Boolean);
  const years = [...new Set(albums.map(a => a.releaseYear.toString()))].sort().reverse();
  const artists = [...new Set(albums.map(a => a.artist))].sort();

  const filteredAlbums = albums
    .filter(album => {
      const matchesSearch = 
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !filterGenre || album.genre === filterGenre;
      const matchesYear = !filterYear || album.releaseYear.toString() === filterYear;
      const matchesArtist = !filterArtist || album.artist === filterArtist;
      
      return matchesSearch && matchesGenre && matchesYear && matchesArtist;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      } else if (sortBy === 'rating') {
        const ratingA = getReviewForAlbum(a.id)?.rating || 0;
        const ratingB = getReviewForAlbum(b.id)?.rating || 0;
        return ratingB - ratingA;
      } else if (sortBy === 'artist') {
        return a.artist.localeCompare(b.artist);
      } else if (sortBy === 'year') {
        return b.releaseYear - a.releaseYear;
      }
      return 0;
    });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this album and its review?')) {
      deleteAlbum(id);
      loadData();
    }
  };

  const handleShare = (album: Album, review: Review, e: React.MouseEvent) => {
    e.stopPropagation();
    setShareCard({ album, review });
  };

  const hasActiveFilters = filterGenre || filterYear || filterArtist;

  return (
    <div className="space-y-6">
      {/* Share Card Modal */}
      {shareCard && (
        <ShareCard
          album={shareCard.album}
          review={shareCard.review}
          onClose={() => setShareCard(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Album Collection
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {albums.length} album{albums.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <button
          onClick={() => navigateTo('add')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          + Add Album
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
        <input
          type="text"
          placeholder="Search by album title or artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 outline-none transition-colors"
        />

        <div className="flex items-center gap-4 flex-wrap">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={filterArtist}
            onChange={(e) => setFilterArtist(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none"
          >
            <option value="">All Artists</option>
            {artists.map(artist => (
              <option key={artist} value={artist}>{artist}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none"
          >
            <option value="recent">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="artist">Artist (A-Z)</option>
            <option value="year">Release Year</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilterGenre('');
                setFilterYear('');
                setFilterArtist('');
              }}
              className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Music className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No albums found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {albums.length === 0 
              ? "Start building your music journal by adding your first album!"
              : "Try adjusting your search or filters"}
          </p>
          {albums.length === 0 && (
            <button
              onClick={() => navigateTo('add')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Your First Album
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map(album => (
            <AlbumCard
              key={album.id}
              album={album}
              review={getReviewForAlbum(album.id)}
              listenCount={getListenCount(album.id)}
              onReview={() => navigateTo('review', album.id)}
              onDelete={(e) => handleDelete(album.id, e)}
              onShare={(review, e) => handleShare(album, review, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AlbumCardProps {
  album: Album;
  review?: Review;
  listenCount: number;
  onReview: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onShare: (review: Review, e: React.MouseEvent) => void;
}

function AlbumCard({ album, review, listenCount, onReview, onDelete, onShare }: AlbumCardProps) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105">
      {/* Album Cover */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900">
        {album.coverUrl ? (
          <img
            src={album.coverUrl}
            alt={`${album.title} cover`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Disc3 className="w-20 h-20 text-purple-400 dark:text-purple-600" />
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={onReview}
            className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
            title={review ? "Edit Review" : "Add Review"}
          >
            {review ? (
              <Edit className="w-5 h-5 text-white" />
            ) : (
              <Star className="w-5 h-5 text-white" />
            )}
          </button>
          {album.songUrl && (
            <a
              href={album.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
              title="Play Song"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="w-5 h-5 text-white" />
            </a>
          )}
          <button
            onClick={onDelete}
            className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            title="Delete Album"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
          {review && (
            <button
              onClick={(e) => onShare(review, e)}
              className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              title="Share Album"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Rating Badge */}
        {review && (
          <div className="absolute top-3 right-3 bg-yellow-400 dark:bg-yellow-500 text-gray-900 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold">{review.rating}</span>
          </div>
        )}
      </div>

      {/* Album Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
          {album.title}
        </h3>
        <p className="text-purple-600 dark:text-purple-400 font-medium line-clamp-1">
          {album.artist}
        </p>
        
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{album.releaseYear}</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="w-4 h-4" />
            <span>{listenCount}x</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
            {album.genre}
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
            {album.releaseType}
          </span>
        </div>
      </div>
    </div>
  );
}