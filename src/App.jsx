import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Sun, Moon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState('light');
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handler = e => {
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); inputRef.current.focus(); }
      if (e.ctrlKey && e.key === 't') { e.preventDefault(); setTheme(prev => prev === 'light' ? 'dark' : 'light'); }
      if (e.key === 'ArrowDown') { setSelected(sel => Math.min(tasks.length - 1, sel + 1)); }
      if (e.key === 'ArrowUp') { setSelected(sel => Math.max(-1, sel - 1)); }
      if (e.key === 'Delete' && selected >= 0) { deleteTask(selected); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tasks, selected]);

  const addTask = text => {
    if (!text.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text, done: false }]);
    inputRef.current.value = '';
  };
  const toggleDone = idx => setTasks(t => t.map((task, i) => i === idx ? { ...task, done: !task.done } : task));
  const deleteTask = idx => { setTasks(t => t.filter((_, i) => i !== idx)); setSelected(-1); };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 rounded-2xl p-6 w-full max-w-md shadow-xl border border-white/20 dark:border-gray-700/20"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white dark:text-gray-100">Glassy To-Do</h1>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="focus:outline-none">
            {theme === 'light'
              ? <Moon className="w-6 h-6 text-white" />
              : <Sun className="w-6 h-6 text-yellow-300" />}
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            onKeyDown={e => e.key === 'Enter' && addTask(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm placeholder-white/60 text-white outline-none transition focus:ring-2 focus:ring-mint"
            placeholder="What needs to be done? (Ctrl+K)"
          />
          <button onClick={() => addTask(inputRef.current.value)} className="focus:outline-none">
            <PlusCircle className="w-8 h-8 text-white hover:text-mint transition" />
          </button>
        </div>

        <ul className="space-y-2 max-h-60 overflow-y-auto">
          <AnimatePresence>
            {tasks.map((task, idx) => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer
                  ${idx === selected ? 'ring-2 ring-mint/80' : ''}
                  ${task.done ? 'bg-green-600/30 line-through text-gray-200' : 'bg-white/20 text-white'}
                  backdrop-blur-sm transition-shadow hover:shadow-lg`}
                onClick={() => toggleDone(idx)}
                onDoubleClick={() => deleteTask(idx)}
              >
                <span>{task.text}</span>
                <Trash2 onClick={e => { e.stopPropagation(); deleteTask(idx); }} className="w-5 h-5 text-red-400 hover:text-red-600 transition" />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {tasks.some(t => t.done) && (
          <button onClick={() => setTasks(t => t.filter(x => !x.done))} className="mt-4 flex items-center gap-1 text-white hover:text-rosewood transition focus:outline-none">
            <Trash2 className="w-5 h-5" />
            Clear Completed
          </button>
        )}
      </motion.div>
    </div>
  );
}
