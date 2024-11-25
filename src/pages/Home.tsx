import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Search, CreditCard, Ticket, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-[600px] mb-16 rounded-3xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40" />
        </div>
        
        <div className="relative h-full flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-2xl">
            Your Journey Begins with a Single Click
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-xl">
            Experience seamless train travel booking with real-time availability and instant confirmation
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/search"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors group"
            >
              Search Trains
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform">
          <Search className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
          <p className="text-gray-600">
            Find the perfect train with our intelligent search system that considers your preferences
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform">
          <CreditCard className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
          <p className="text-gray-600">
            Pay safely with our trusted payment gateway powered by Paystack
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform">
          <Ticket className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Instant Tickets</h3>
          <p className="text-gray-600">
            Get your e-tickets instantly after booking confirmation with QR code access
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-12 text-white mb-16 mx-4">
        <div className="max-w-3xl mx-auto text-center">
          <Train className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of happy travelers who book with us daily. Experience the difference of modern train travel booking.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}