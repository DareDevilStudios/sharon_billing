import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Factory, ShoppingCart, History, Database, ShoppingBag, Menu, X, DollarSign, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isCollapsed, toggleCollapse } = useSidebar();
  const location = useLocation();

  const closeSidebar = () => setIsSidebarOpen(false);

  const navLinks = [
    { to: '/', icon: Package, text: 'Inventory' },
    { to: '/raw-materials', icon: Database, text: 'Raw Materials' },
    { to: '/manufacturing', icon: Factory, text: 'Manufacturing' },
    { to: '/purchases', icon: ShoppingBag, text: 'Purchases' },
    { to: '/purchase-history', icon: History, text: 'Purchase History' },
    { to: '/sales', icon: ShoppingCart, text: 'Sales' },
    { to: '/sales-history', icon: History, text: 'Sales History' },
    { to: '/expenses', icon: DollarSign, text: 'Expenses' },
    { to: '/daily-book', icon: BookOpen, text: 'Daily Book' },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <nav className="md:hidden bg-blue-600 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 font-bold text-xl">
              SHARON Industries
            </div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-blue-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-50 print:hidden transition-all duration-300 ${
        isCollapsed ? 'md:w-16' : 'md:w-64'
      }`}>
        <div className="flex-1 flex flex-col min-h-0 bg-blue-600 text-white">
          {/* Sidebar Header */}
          <div className={`flex items-center justify-between h-16 border-b border-blue-700 ${
            isCollapsed ? 'px-2' : 'px-4'
          }`}>
            {!isCollapsed && (
              <div className="flex-shrink-0 font-bold text-xl">
                SHARON Industries
              </div>
            )}
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-md hover:bg-blue-700"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group flex items-center px-2 py-2 text-lg font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                  title={isCollapsed ? link.text : ''}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3">{link.text}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 print:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />

          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="py-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeSidebar}
                    className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                      isActive ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                  >
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.text}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}