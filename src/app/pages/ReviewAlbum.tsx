import { useState, useEffect } from 'react';
import { Album, Review, FavoriteTrack, Page } from '../App';
import { getAlbumById, getReviewByAlbumId, saveReview, addListeningEntry } from '../utils/storage';
import { ArrowLeft, Star, Plus, X, Check, Play } from 'lucide-react';

interface ReviewAlbumProps {
  albumId: string;
  navigateTo: (page: Page) => void;
}

const MOOD_TAGS = [
  'Happy', 'Sad', 'Energetic', 'Calm', 'Angry', 'Nostalgic', 
  'Uplifting', 'Melancholic', 'Romantic', 'Introspective',
  'Chill', 'Intense', 'Hopeful', 'Dark', 'Dreamy'
];

export function ReviewAlbum({ albumId, navigateTo }: ReviewAlbumProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [dateFirstListened, setDateFirstListened] = useState('');
  const [dateReviewed, setDateReviewed] = useState(new Date().toISOString().split('T')[0]);
  const [favoriteTracks, setFavoriteTracks] = useState<FavoriteTrack[]>([]);
  const [personalNotes, setPersonalNotes] = useState('');
  const [emotionalTags, setEmotionalTags] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newTrack, setNewTrack] = useState({ name: '', timestamp: '', notes: '' });

  useEffect(() => {
    const albumData = getAlbumById(albumId);
    if (albumData) {
      setAlbum(albumData);
      
      // Load existing review if any
      const existingReview = getReviewByAlbumId(albumId);
      if (existingReview) {
        setRating(existingReview.rating);
        setDateFirstListened(existingReview.dateFirstListened);
        setDateReviewed(existingReview.dateReviewed);
        setFavoriteTracks(existingReview.favoriteTrack || []);
        setPersonalNotes(existingReview.personalNotes);
        setEmotionalTags(existingReview.emotionalTags);
      }
    }
  }, [albumId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const review: Review = {
      albumId,
      rating,
      dateFirstListened,
      dateReviewed,
      favoriteTrack: favoriteTracks.length > 0 ? favoriteTracks : undefined,
      personalNotes,
      emotionalTags
    };

    saveReview(review);
    addListeningEntry(albumId);
    
    setShowSuccess(true);
    setTimeout(() => {
      navigateTo('home');
    }, 1500);
  };

  const addFavoriteTrack = () => {
    if (newTrack.name) {
      setFavoriteTracks([...favoriteTracks, { ...newTrack }]);
      setNewTrack({ name: '', timestamp: '', notes: '' });
    }
  };

  const removeFavoriteTrack = (index: number) => {
    setFavoriteTracks(favoriteTracks.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    if (emotionalTags.includes(tag)) {
      setEmotionalTags(emotionalTags.filter(t => t !== tag));
    } else {
      setEmotionalTags([...emotionalTags, tag]);
    }
  };

  if (!album) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Album not found</p>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Review Saved!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your review has been added to your journal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigateTo('home')}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Review Album
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share your thoughts on {album.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Album Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
            <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900">
              {album.coverUrl ? (
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Star className="w-20 h-20 text-purple-400" />
                </div>
              )}
            </div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
              {album.title}
            </h3>
            <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">
              {album.artist}
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Year:</span> {album.releaseYear}</p>
              <p><span className="font-medium">Genre:</span> {album.genre}</p>
              <p><span className="font-medium">Type:</span> {album.releaseType}</p>
            </div>
            {album.songUrl && (
              <a
                href={album.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Play Song
              </a>
            )}
          </div>
        </div>

        {/* Review Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date First Listened <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateFirstListened}
                  onChange={(e) => setDateFirstListened(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Review Date
                </label>
                <input
                  type="date"
                  value={dateReviewed}
                  onChange={(e) => setDateReviewed(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Emotional Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Mood & Emotional Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      emotionalTags.includes(tag)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Favorite Tracks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Favorite Tracks
              </label>
              
              {/* Existing tracks */}
              {favoriteTracks.map((track, index) => (
                <div key={index} className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{track.name}</p>
                      {track.timestamp && (
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          Standout moment: {track.timestamp}
                        </p>
                      )}
                      {track.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {track.notes}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFavoriteTrack(index)}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add new track */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Track name"
                  value={newTrack.name}
                  onChange={(e) => setNewTrack({ ...newTrack, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Timestamp (e.g., 2:34)"
                  value={newTrack.timestamp}
                  onChange={(e) => setNewTrack({ ...newTrack, timestamp: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Notes about this track (optional)"
                  value={newTrack.notes}
                  onChange={(e) => setNewTrack({ ...newTrack, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={addFavoriteTrack}
                  disabled={!newTrack.name}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Favorite Track
                </button>
              </div>
            </div>

            {/* Personal Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors resize-none"
                placeholder="What did you think of this album? Any standout moments, favorite lyrics, or memorable experiences while listening?"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={rating === 0 || !dateFirstListened || !personalNotes}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Save Review
              </button>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
