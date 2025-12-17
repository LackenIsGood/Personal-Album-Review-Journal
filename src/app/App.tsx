import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { AddAlbum } from './pages/AddAlbum';
import { ReviewAlbum } from './pages/ReviewAlbum';
import { YearInMusic } from './pages/YearInMusic';
import { Recommendations } from './pages/Recommendations';
import { Moon, Sun, Music } from 'lucide-react';
import { loadSampleDataIfEmpty } from './utils/sampleData';

export type ReleaseType = 'Studio' | 'Live' | 'Compilation';
export type DiscoverySource = 'Friend' | 'Algorithm' | 'Radio' | 'Concert' | 'Social Media' | 'Random Discovery' | 'Other';

export interface Album {
  id: string;
  artist: string;
  title: string;
  releaseYear: number;
  genre: string;
  releaseType: ReleaseType;
  coverUrl: string;
  songUrl?: string;
  discoverySource?: DiscoverySource;
  discoveryNotes?: string;
  dateAdded: string;
}

export interface FavoriteTrack {
  name: string;
  timestamp: string;
  notes?: string;
}

export interface Review {
  albumId: string;
  rating: number; // 1-5 stars
  dateFirstListened: string;
  dateReviewed: string;
  favoriteTrack?: FavoriteTrack[];
  personalNotes: string;
  emotionalTags: string[];
}

export interface ListeningHistory {
  albumId: string;
  timestamp: string;
}

export type Page = 'home' | 'add' | 'review' | 'year' | 'recommendations';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Check if this is first time user and show welcome
    const hasSeenWelcome = localStorage.getItem('music_journal_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleGetStarted = (withSampleData: boolean) => {
    if (withSampleData) {
      loadSampleDataIfEmpty();
    }
    localStorage.setItem('music_journal_welcome_seen', 'true');
    setShowWelcome(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateTo = (page: Page, albumId?: string) => {
    setCurrentPage(page);
    if (albumId) {
      setSelectedAlbumId(albumId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-colors duration-300">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Your Music Journal! 🎵
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Your personal space to review, rate, and track your favorite albums
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                ✨ What you can do:
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>Rate albums with a 5-star system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>Track favorite tracks with timestamps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>Add mood tags and personal notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>View your "Year in Music" statistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>Get personalized album recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span>Filter by genre, year, and artist</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleGetStarted(true)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Start with Sample Data
              </button>
              <button
                onClick={() => handleGetStarted(false)}
                className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Start Fresh
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              All data is stored locally in your browser
            </p>
          </div>
        </div>
      )}

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-indigo-600" />
        )}
      </button>

      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h1 className="font-bold text-xl text-gray-900 dark:text-white">
                My Music Journal
              </h1>
            </div>
            <div className="flex space-x-1">
              <NavButton
                active={currentPage === 'home'}
                onClick={() => navigateTo('home')}
              >
                Home
              </NavButton>
              <NavButton
                active={currentPage === 'add'}
                onClick={() => navigateTo('add')}
              >
                Add Album
              </NavButton>
              <NavButton
                active={currentPage === 'year'}
                onClick={() => navigateTo('year')}
              >
                Year in Music
              </NavButton>
              <NavButton
                active={currentPage === 'recommendations'}
                onClick={() => navigateTo('recommendations')}
              >
                Recommendations
              </NavButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && <Home navigateTo={navigateTo} />}
        {currentPage === 'add' && <AddAlbum navigateTo={navigateTo} />}
        {currentPage === 'review' && selectedAlbumId && (
          <ReviewAlbum albumId={selectedAlbumId} navigateTo={navigateTo} />
        )}
        {currentPage === 'year' && <YearInMusic />}
        {currentPage === 'recommendations' && <Recommendations navigateTo={navigateTo} />}
      </div>
    </div>
  );
}

// Helper Components
function NavButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        active
          ? 'bg-purple-600 text-white shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800/30'
      }`}
    >
      {children}
    </button>
  );
}