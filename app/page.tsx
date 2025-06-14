import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ChevronRight, Upload, Shield, Sparkles } from 'lucide-react';
import HeroSection from '@/app/components/HeroSection';

// Simple server-side rendered page without client components at the top level
export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen">
      {/* Hero Section - Client Component */}
      <HeroSection />

      {/* Features Section - Enhanced */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Choose <span className="text-purple-600 dark:text-purple-400">VideoAI</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform offers cutting-edge features designed to help you create, share, and discover amazing content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Easy Video Upload</h3>
              <p className="text-gray-600 dark:text-gray-300">Upload your videos with just a few clicks. Our platform supports various video formats and provides instant processing.</p>
              <div className="mt-6">
                <Link href={session ? "/video" : "/register"} className="text-purple-600 dark:text-purple-400 font-medium flex items-center hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI-Powered Features</h3>
              <p className="text-gray-600 dark:text-gray-300">Experience advanced AI features that enhance your video content automatically. Get smart recommendations and insights.</p>
              <div className="mt-6">
                <Link href={session ? "/video" : "/register"} className="text-purple-600 dark:text-purple-400 font-medium flex items-center hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Secure Platform</h3>
              <p className="text-gray-600 dark:text-gray-300">Your content is protected with enterprise-grade security and privacy features. We ensure your data stays safe.</p>
              <div className="mt-6">
                <Link href={session ? "/video" : "/register"} className="text-purple-600 dark:text-purple-400 font-medium flex items-center hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of users who are already sharing their videos on our platform.
            Start your journey today with VideoAI!
          </p>
          {!session ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-white text-purple-600 px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
              >
                Create Free Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border-2 border-white text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-white hover:text-purple-600"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              href="/video"
              className="inline-flex items-center justify-center rounded-full bg-white text-purple-600 px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
            >
              View Videos
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
