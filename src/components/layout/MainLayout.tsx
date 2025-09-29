import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Leaf } from 'lucide-react';
interface MainLayoutProps {
  children: React.ReactNode;
}
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-800 dark:text-gray-200">
              AeroGro Nutrient Architect
            </h1>
          </div>
          <ThemeToggle className="relative top-0 right-0" />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {children}
      </main>
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
    </div>
  );
}