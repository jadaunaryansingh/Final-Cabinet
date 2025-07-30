import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ArrowLeft, Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Construction Icon */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto glass-morphism rounded-full border border-cabinet-yellow/30 flex items-center justify-center">
              <Construction className="w-16 h-16 text-cabinet-yellow animate-pulse" />
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto bg-cabinet-yellow/20 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-4xl font-cabinet font-bold text-white">
              {title}
            </h1>
            <p className="text-xl text-cabinet-grey max-w-lg mx-auto">
              {description}
            </p>
          </div>

          {/* Coming Soon Badge */}
          <div className="glass-morphism rounded-2xl p-6 border border-cabinet-yellow/20 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="text-cabinet-yellow text-2xl">🚧</div>
              <h3 className="text-lg font-cabinet font-semibold text-white">Coming Soon</h3>
              <p className="text-cabinet-grey text-sm">
                We're working hard to bring you this feature. Stay tuned for updates!
              </p>
              <div className="text-xs text-cabinet-yellow">
                Expected launch: Q2 2024
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-gold text-black rounded-2xl font-cabinet font-medium hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <button className="px-6 py-3 glass-morphism border border-cabinet-yellow/30 text-cabinet-yellow rounded-2xl font-cabinet font-medium hover:bg-cabinet-yellow hover:text-black transition-all duration-300">
              Notify Me When Ready
            </button>
          </div>

          {/* Features Preview */}
          <div className="mt-12 pt-8 border-t border-cabinet-yellow/20">
            <h4 className="text-lg font-cabinet font-semibold text-white mb-4">
              What to expect:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="text-cabinet-grey">
                ✨ Premium Experience
              </div>
              <div className="text-cabinet-grey">
                🎯 Smart Features
              </div>
              <div className="text-cabinet-grey">
                ⚡ Lightning Fast
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
