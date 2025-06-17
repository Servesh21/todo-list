'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Calendar, CheckSquare, Bell, Clock, BarChart, Users } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 lg:px-12 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckSquare className="text-blue-600 h-8 w-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Taskify
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>

            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Sign Up 
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col items-center">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors w-full text-center py-2">Features</a>
            <button
              onClick={() => router.push('/login')}
              className="w-full text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Sign Up Free
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="pt-20 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              #1 Task Management Tool
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Stay <span className="text-blue-600">Organized</span>, Stay <span className="text-blue-600">Ahead</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Taskify helps you manage your daily and upcoming tasks efficiently. Set recurring reminders, track progress, and never miss a deadline again!
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <button
                onClick={() => router.push('/register')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center"
              >
                Get Started 
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            
           
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full opacity-50"></div>
              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 relative z-10">
                <Image 
                  src="/image.png" 
                  alt="Taskify Dashboard Preview" 
                  className="rounded-xl w-full"
                  width={600}
                  height={400}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Your Productivity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed to boost your productivity with intuitive tools that help you manage tasks efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl transition-all hover:shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Calendar View</h3>
              <p className="text-gray-600">
                Visualize tasks across weeks and months to plan better and maintain a clear overview of your schedule.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl transition-all hover:shadow-lg border border-gray-100">
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Daily Tracking</h3>
              <p className="text-gray-600">
                View and manage your tasks for today with ease. Mark completed items and prioritize the rest.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl transition-all hover:shadow-lg border border-gray-100">
              <div className="p-3 bg-red-100 rounded-lg inline-block mb-4">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Reminders</h3>
              <p className="text-gray-600">
                Set recurring or one-time reminders to stay on track. Get notifications via email or push alerts.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl transition-all hover:shadow-lg border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Tracking</h3>
              <p className="text-gray-600">
                Monitor how much time you spend on each task and improve your time management skills.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl transition-all hover:shadow-lg border border-gray-100">
              <div className="p-3 bg-yellow-100 rounded-lg inline-block mb-4">
                <BarChart className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
              <p className="text-gray-600">
                Gain insights into your productivity patterns with detailed analytics and reports.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl transition-all hover:shadow-lg border border-gray-100">
              <div className="p-3 bg-indigo-100 rounded-lg inline-block mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-600">
                Share task lists with team members and collaborate seamlessly on projects.
              </p>
            </div>
          </div>
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of users who have transformed their task management experience with Taskify.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-lg font-medium"
          >
            Get Started
          </button>
          <p className="mt-4 text-sm text-blue-200"></p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <CheckSquare className="text-blue-400 h-6 w-6" />
              <h3 className="text-xl font-bold text-white">Taskify</h3>
            </div>
            <p className="text-sm mb-4">
              The all-in-one task management solution for individuals and teams.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-700 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Taskify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}