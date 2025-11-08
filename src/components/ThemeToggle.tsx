import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../App';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}
