import { Link, useLocation } from 'react-router-dom';
import { Package, Factory, ShoppingCart, History, Database, ShoppingBag, DollarSign, BookOpen, ChevronLeft, ChevronRight, Settings, Users } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

export default function Navbar() {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const location = useLocation();

  const navLinks = [
    { to: '/', icon: Package, text: 'Inventory' },
    { to: '/raw-materials', icon: Database, text: 'Raw Materials' },
    { to: '/manufacturing', icon: Factory, text: 'Manufacturing' },
    { to: '/purchases', icon: ShoppingBag, text: 'Purchases' },
    { to: '/purchase-history', icon: History, text: 'Purchase History' },
    { to: '/sales', icon: ShoppingCart, text: 'Sales' },
    { to: '/sales-history', icon: History, text: 'Sales History' },
    { to: '/customers', icon: Users, text: 'Customers' },
    { to: '/expenses', icon: DollarSign, text: 'Expenses' },
    { to: '/daily-book', icon: BookOpen, text: 'Daily Book' },
    { to: '/settings', icon: Settings, text: 'Settings' },
  ];

  return (
    <div
      className={`flex flex-col fixed inset-y-0 left-0 z-50 print:hidden transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-blue-600 text-white">
        <div
          className={`flex items-center justify-between h-16 border-b border-blue-700 ${
            isCollapsed ? 'px-2' : 'px-4'
          }`}
        >
          {!isCollapsed && (
            <div className="flex-shrink-0 font-bold text-xl truncate">
              SHARON Industries
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-md hover:bg-blue-700"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
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
                {!isCollapsed && <span className="ml-3">{link.text}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
