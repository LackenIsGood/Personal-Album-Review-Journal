import { Album, Review } from '../App';
import { Star, Calendar, Music } from 'lucide-react';

interface ShareCardProps {
  album: Album;
  review: Review;
  onClose: () => void;
}

export function ShareCard({ album, review, onClose }: ShareCardProps) {
  const handleDownload = () => {
    // This would generate a shareable image card
    // For now, we'll just show the card visually
    alert('Screenshot this card to share on social media! 📸');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Shareable Card */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
            {/* Album Info */}
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden shadow-xl flex-shrink-0 bg-white/20">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-12 h-12 text-white/50" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-1 line-clamp-2">
                  {album.title}
                </h3>
                <p className="text-white/90 font-medium mb-2">
                  {album.artist}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? 'fill-yellow-300 text-yellow-300'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-lg">
                    {review.rating}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Review Snippet */}
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm italic line-clamp-4">
                "{review.personalNotes}"
              </p>
            </div>

            {/* Mood Tags */}
            {review.emotionalTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {review.emotionalTags.slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Reviewed {new Date(review.dateReviewed).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Music className="w-3 h-3" />
                <span>My Music Journal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            📸 Screenshot to Share
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 pb-4">
          💡 Tip: Screenshot this card to share on social media!
        </p>
      </div>
    </div>
  );
}
