import { useState, useEffect } from 'react';
import { Album, Review } from '../App';
import { getAlbums, getReviews, getListeningHistory } from '../utils/storage';
import { Calendar, TrendingUp, Star, Music, Award } from 'lucide-react';

export function YearInMusic() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [albums, setAlbums] = useState<Album[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const loadData = () => {
    const allAlbums = getAlbums();
    const allReviews = getReviews();
    const history = getListeningHistory();

    setAlbums(allAlbums);
    setReviews(allReviews);

    // Calculate stats for selected year
    const yearStart = new Date(`${selectedYear}-01-01`);
    const yearEnd = new Date(`${selectedYear}-12-31`);

    // Filter reviews from selected year
    const yearReviews = allReviews.filter(review => {
      const reviewDate = new Date(review.dateReviewed);
      return reviewDate >= yearStart && reviewDate <= yearEnd;
    });

    // Get albums reviewed this year
    const reviewedAlbumIds = yearReviews.map(r => r.albumId);
    const yearAlbums = allAlbums.filter(a => reviewedAlbumIds.includes(a.id));

    // Calculate listening history for the year
    const yearListens = history.filter(h => {
      const date = new Date(h.timestamp);
      return date >= yearStart && date <= yearEnd;
    });

    // Top rated albums
    const topRated = yearReviews
      .map(review => ({
        album: allAlbums.find(a => a.id === review.albumId),
        review
      }))
      .filter(item => item.album)
      .sort((a, b) => b.review.rating - a.review.rating)
      .slice(0, 10);

    // Most listened albums
    const listenCounts: { [key: string]: number } = {};
    yearListens.forEach(listen => {
      listenCounts[listen.albumId] = (listenCounts[listen.albumId] || 0) + 1;
    });

    const mostListened = Object.entries(listenCounts)
      .map(([albumId, count]) => ({
        album: allAlbums.find(a => a.id === albumId),
        count
      }))
      .filter(item => item.album)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Genre breakdown
    const genreCounts: { [key: string]: number } = {};
    yearAlbums.forEach(album => {
      genreCounts[album.genre] = (genreCounts[album.genre] || 0) + 1;
    });

    const topGenres = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Monthly breakdown
    const monthlyData: { [key: string]: { albums: Album[], reviews: Review[] } } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach((month, index) => {
      const monthReviews = yearReviews.filter(review => {
        const reviewDate = new Date(review.dateReviewed);
        return reviewDate.getMonth() === index;
      });
      
      const monthAlbumIds = monthReviews.map(r => r.albumId);
      const monthAlbums = allAlbums.filter(a => monthAlbumIds.includes(a.id));
      
      monthlyData[month] = { albums: monthAlbums, reviews: monthReviews };
    });

    setStats({
      totalAlbumsReviewed: yearAlbums.length,
      totalListens: yearListens.length,
      averageRating: yearReviews.length > 0 
        ? (yearReviews.reduce((sum, r) => sum + r.rating, 0) / yearReviews.length).toFixed(1)
        : 0,
      topRated,
      mostListened,
      topGenres,
      monthlyData
    });
  };

  const availableYears = [...new Set([
    ...getReviews().map(r => new Date(r.dateReviewed).getFullYear().toString()),
    new Date().getFullYear().toString()
  ])].sort().reverse();

  if (!stats) {
    return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Year in Music
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore your listening journey throughout the year
          </p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-6 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 outline-none text-lg font-semibold"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Music className="w-8 h-8" />}
          title="Albums Reviewed"
          value={stats.totalAlbumsReviewed}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Total Listens"
          value={stats.totalListens}
          color="pink"
        />
        <StatCard
          icon={<Star className="w-8 h-8" />}
          title="Average Rating"
          value={`${stats.averageRating}/5`}
          color="yellow"
        />
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Monthly Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(stats.monthlyData).map(([month, data]: [string, any]) => (
            <div
              key={month}
              className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800"
            >
              <p className="font-semibold text-gray-900 dark:text-white">{month}</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {data.albums.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                album{data.albums.length !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Genres */}
      {stats.topGenres.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            Top Genres
          </h3>
          <div className="space-y-3">
            {stats.topGenres.map((item: any, index: number) => (
              <div key={item.genre} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.genre}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.count} album{item.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      style={{
                        width: `${(item.count / stats.totalAlbumsReviewed) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Rated Albums */}
      {stats.topRated.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Top Rated Albums
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.topRated.map((item: any, index: number) => (
              <div
                key={item.album.id}
                className="relative group"
              >
                <div className="aspect-square rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900">
                  {item.album.coverUrl ? (
                    <img
                      src={item.album.coverUrl}
                      alt={item.album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                    {item.album.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {item.album.artist}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {item.review.rating}/5
                    </span>
                  </div>
                </div>
                {index < 3 && (
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Listened Albums */}
      {stats.mostListened.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            Most Listened Albums
          </h3>
          <div className="space-y-4">
            {stats.mostListened.slice(0, 5).map((item: any, index: number) => (
              <div
                key={item.album.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 flex-shrink-0">
                  {item.album.coverUrl ? (
                    <img
                      src={item.album.coverUrl}
                      alt={item.album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-8 h-8 text-purple-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.album.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.album.artist}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {item.count}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    listen{item.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.totalAlbumsReviewed === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Music className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No data for {selectedYear}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start reviewing albums to see your year in music!
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | number; 
  color: 'purple' | 'pink' | 'yellow';
}) {
  const colorClasses = {
    purple: 'from-purple-600 to-purple-400',
    pink: 'from-pink-600 to-pink-400',
    yellow: 'from-yellow-600 to-yellow-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <div className="opacity-80">{icon}</div>
      </div>
      <p className="text-4xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  );
}
