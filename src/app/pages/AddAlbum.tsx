import { useState } from 'react';
import { Album, ReleaseType, DiscoverySource, Page } from '../App';
import { saveAlbum } from '../utils/storage';
import { Music, ArrowLeft, Check } from 'lucide-react';

interface AddAlbumProps {
  navigateTo: (page: Page) => void;
}

export function AddAlbum({ navigateTo }: AddAlbumProps) {
  const [formData, setFormData] = useState({
    artist: '',
    title: '',
    releaseYear: new Date().getFullYear().toString(),
    genre: '',
    releaseType: 'Studio' as ReleaseType,
    coverUrl: '',
    songUrl: '',
    discoverySource: '' as DiscoverySource | '',
    discoveryNotes: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const album: Album = {
      id: Date.now().toString(),
      artist: formData.artist,
      title: formData.title,
      releaseYear: parseInt(formData.releaseYear),
      genre: formData.genre,
      releaseType: formData.releaseType,
      coverUrl: formData.coverUrl,
      songUrl: formData.songUrl || undefined,
      discoverySource: formData.discoverySource || undefined,
      discoveryNotes: formData.discoveryNotes || undefined,
      dateAdded: new Date().toISOString()
    };

    saveAlbum(album);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      navigateTo('home');
    }, 1500);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Album Added Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to your collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
            Add New Album
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add an album to your music journal
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
        {/* Album Cover Preview */}
        {formData.coverUrl && (
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-lg overflow-hidden shadow-xl">
              <img
                src={formData.coverUrl}
                alt="Album cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '';
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Artist <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.artist}
              onChange={(e) => updateField('artist', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="Enter artist name"
            />
          </div>

          {/* Album Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Album Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="Enter album title"
            />
          </div>

          {/* Release Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Release Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.releaseYear}
              onChange={(e) => updateField('releaseYear', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.genre}
              onChange={(e) => updateField('genre', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="e.g., Rock, Jazz, Hip-Hop"
            />
          </div>

          {/* Release Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Release Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.releaseType}
              onChange={(e) => updateField('releaseType', e.target.value as ReleaseType)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
            >
              <option value="Studio">Studio</option>
              <option value="Live">Live</option>
              <option value="Compilation">Compilation</option>
            </select>
          </div>

          {/* Discovery Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discovery Source
            </label>
            <select
              value={formData.discoverySource}
              onChange={(e) => updateField('discoverySource', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
            >
              <option value="">Select source...</option>
              <option value="Friend">Friend Recommendation</option>
              <option value="Algorithm">Algorithm/Streaming</option>
              <option value="Radio">Radio</option>
              <option value="Concert">Concert/Live Show</option>
              <option value="Social Media">Social Media</option>
              <option value="Random Discovery">Random Discovery</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Album Cover URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Album Cover URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required
            value={formData.coverUrl}
            onChange={(e) => updateField('coverUrl', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
            placeholder="https://example.com/album-cover.jpg"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Paste the URL of the album cover image
          </p>
        </div>

        {/* Song URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Song URL (Optional)
          </label>
          <input
            type="url"
            value={formData.songUrl}
            onChange={(e) => updateField('songUrl', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
            placeholder="https://example.com/song.mp3 or Spotify/YouTube link"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Link to a song from this album (can be a file hosted on GitHub, Spotify, YouTube, etc.)
          </p>
        </div>

        {/* Discovery Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discovery Notes
          </label>
          <textarea
            value={formData.discoveryNotes}
            onChange={(e) => updateField('discoveryNotes', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors resize-none"
            placeholder="How did you discover this album? Any memorable story?"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Music className="w-5 h-5" />
            Add Album to Collection
          </button>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
