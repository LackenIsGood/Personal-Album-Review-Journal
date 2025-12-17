import { useState, useEffect } from 'react';
import { Album, Review, Page } from '../App';
import { getAlbums, getReviews } from '../utils/storage';
import { Sparkles, Star, Music, TrendingUp, ArrowRight } from 'lucide-react';

interface RecommendationsProps {
  navigateTo: (page: Page, albumId?: string) => void;
}

export function Recommendations({ navigateTo }: RecommendationsProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<{
    genre: string;
    reason: string;
    score: number;
  }[]>([]);

  useEffect(() => {
    const allAlbums = getAlbums();
    const allReviews = getReviews();
    setAlbums(allAlbums);
    setReviews(allReviews);
    
    generateRecommendations(allAlbums, allReviews);
  }, []);

  const generateRecommendations = (allAlbums: Album[], allReviews: Review[]) => {
    // Get reviewed albums
    const reviewedAlbums = allAlbums.filter(album => 
      allReviews.some(review => review.albumId === album.id)
    );

    if (reviewedAlbums.length === 0) {
      return;
    }

    // Calculate genre preferences based on ratings
    const genreScores: { [key: string]: { totalRating: number; count: number } } = {};
    
    reviewedAlbums.forEach(album => {
      const review = allReviews.find(r => r.albumId === album.id);
      if (review && review.rating >= 4) {
        if (!genreScores[album.genre]) {
          genreScores[album.genre] = { totalRating: 0, count: 0 };
        }
        genreScores[album.genre].totalRating += review.rating;
        genreScores[album.genre].count += 1;
      }
    });

    // Calculate average ratings per genre
    const genrePreferences = Object.entries(genreScores)
      .map(([genre, data]) => ({
        genre,
        avgRating: data.totalRating / data.count,
        count: data.count
      }))
      .sort((a, b) => b.avgRating - a.avgRating);

    // Get artists you've rated highly
    const artistScores: { [key: string]: { totalRating: number; count: number } } = {};
    
    reviewedAlbums.forEach(album => {
      const review = allReviews.find(r => r.albumId === album.id);
      if (review && review.rating >= 4) {
        if (!artistScores[album.artist]) {
          artistScores[album.artist] = { totalRating: 0, count: 0 };
        }
        artistScores[album.artist].totalRating += review.rating;
        artistScores[album.artist].count += 1;
      }
    });

    const topArtists = Object.entries(artistScores)
      .map(([artist, data]) => ({
        artist,
        avgRating: data.totalRating / data.count
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);

    // Get emotional patterns
    const emotionalPatterns: { [key: string]: number } = {};
    allReviews.forEach(review => {
      if (review.rating >= 4) {
        review.emotionalTags.forEach(tag => {
          emotionalPatterns[tag] = (emotionalPatterns[tag] || 0) + 1;
        });
      }
    });

    const topEmotions = Object.entries(emotionalPatterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion]) => emotion);

    // Generate recommendation suggestions
    const suggestions: { genre: string; reason: string; score: number }[] = [];

    // Recommend based on top genres
    genrePreferences.slice(0, 3).forEach((pref, index) => {
      suggestions.push({
        genre: pref.genre,
        reason: `You've rated ${pref.count} ${pref.genre} album${pref.count > 1 ? 's' : ''} highly (avg ${pref.avgRating.toFixed(1)}/5)`,
        score: pref.avgRating
      });
    });

    // Recommend similar artists
    if (topArtists.length > 0) {
      suggestions.push({
        genre: 'Various',
        reason: `Explore more from ${topArtists.map(a => a.artist).join(', ')} - your favorite artists`,
        score: 5
      });
    }

    // Recommend based on emotions
    if (topEmotions.length > 0) {
      suggestions.push({
        genre: 'Various',
        reason: `You enjoy ${topEmotions.join(', ').toLowerCase()} music - explore albums with similar vibes`,
        score: 4.5
      });
    }

    // Recommend unexplored genres
    const exploredGenres = new Set(reviewedAlbums.map(a => a.genre));
    const allGenres = new Set(allAlbums.map(a => a.genre));
    const unexploredGenres = [...allGenres].filter(g => !exploredGenres.has(g));
    
    if (unexploredGenres.length > 0) {
      suggestions.push({
        genre: unexploredGenres[0],
        reason: `Expand your horizons - you haven't reviewed any ${unexploredGenres[0]} albums yet`,
        score: 3.5
      });
    }

    // Recommend recent releases
    const currentYear = new Date().getFullYear();
    const recentUnreviewed = allAlbums.filter(album => {
      const isRecent = album.releaseYear >= currentYear - 2;
      const isReviewed = allReviews.some(r => r.albumId === album.id);
      return isRecent && !isReviewed;
    });

    if (recentUnreviewed.length > 0) {
      suggestions.push({
        genre: 'Various',
        reason: `Check out recent releases from ${currentYear - 2}-${currentYear} that you haven't reviewed`,
        score: 4
      });
    }

    setRecommendations(suggestions.sort((a, b) => b.score - a.score));
  };

  const reviewedAlbums = albums.filter(album => 
    reviews.some(review => review.albumId === album.id)
  );

  const unreviewedAlbums = albums.filter(album => 
    !reviews.some(review => review.albumId === album.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Recommendations for You
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Discover what to listen to next based on your taste
        </p>
      </div>

      {/* AI-Style Recommendations */}
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                    {rec.genre}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {rec.reason}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(rec.score)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Match Score: {rec.score.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Sparkles className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Start Building Your Recommendations
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Review at least 3 albums with 4+ stars to get personalized recommendations
          </p>
          <button
            onClick={() => navigateTo('add')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Your First Album
          </button>
        </div>
      )}

      {/* Albums Waiting for Review */}
      {unreviewedAlbums.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Albums in Your Collection Waiting for Review
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You have {unreviewedAlbums.length} album{unreviewedAlbums.length !== 1 ? 's' : ''} that {unreviewedAlbums.length !== 1 ? 'haven\'t' : 'hasn\'t'} been reviewed yet
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {unreviewedAlbums.slice(0, 12).map(album => (
              <button
                key={album.id}
                onClick={() => navigateTo('review', album.id)}
                className="group text-left"
              >
                <div className="aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 mb-2">
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                </div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                  {album.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                  {album.artist}
                </p>
                <div className="mt-2 flex items-center gap-1 text-purple-600 dark:text-purple-400 text-xs font-medium group-hover:gap-2 transition-all">
                  <span>Review</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
          {unreviewedAlbums.length > 12 && (
            <button
              onClick={() => navigateTo('home')}
              className="mt-6 w-full px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium"
            >
              View All {unreviewedAlbums.length} Albums →
            </button>
          )}
        </div>
      )}

      {/* Your Top Rated Albums as Reference */}
      {reviewedAlbums.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Your Top Rated Albums
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Albums you've rated 4 stars or higher
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {reviewedAlbums
              .filter(album => {
                const review = reviews.find(r => r.albumId === album.id);
                return review && review.rating >= 4;
              })
              .sort((a, b) => {
                const reviewA = reviews.find(r => r.albumId === a.id);
                const reviewB = reviews.find(r => r.albumId === b.id);
                return (reviewB?.rating || 0) - (reviewA?.rating || 0);
              })
              .slice(0, 12)
              .map(album => {
                const review = reviews.find(r => r.albumId === album.id);
                return (
                  <div key={album.id} className="group">
                    <div className="aspect-square rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 mb-2 relative">
                      {album.coverUrl ? (
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-12 h-12 text-purple-400" />
                        </div>
                      )}
                      {review && (
                        <div className="absolute top-2 right-2 bg-yellow-400 dark:bg-yellow-500 text-gray-900 px-2 py-1 rounded-full flex items-center gap-1 shadow-lg text-xs font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {review.rating}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                      {album.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                      {album.artist}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
