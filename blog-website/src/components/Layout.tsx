import React from 'react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-100 py-4 dark:bg-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1>Blog Website</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto flex-grow py-8">
        {children}
      </main>
      <footer className="bg-gray-200 py-4 dark:bg-gray-900">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Blog Website</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
