import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  History, 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ArrowRight, 
  Send, 
  Plus, 
  Clock, 
  FileText, 
  Archive, 
  Lightbulb,
  ChevronRight,
  User,
  ShieldCheck,
  Globe,
  MessageSquare,
  ExternalLink,
  Filter,
  Calendar,
  Brain,
  Users,
  Shield,
  Eye,
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';
import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { generatePolicyResponse } from './services/gemini';

// --- Theme Context ---
const ThemeContext = createContext<{ theme: 'light' | 'dark', toggleTheme: () => void }>({
  theme: 'light',
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('docintel_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('docintel_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? <Moon size={20} className="text-gray-600" /> : <Sun size={20} className="text-dark-primary" />}
    </button>
  );
};

// --- Components ---

const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-4 bg-transparent">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold text-brand-primary dark:text-dark-primary tracking-tight">DocIntel AI</h1>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
      <Link to="/" className="hover:text-brand-primary dark:hover:text-dark-primary border-b-2 border-brand-primary dark:border-dark-primary pb-1">Home</Link>
      <Link to="/ask" className="hover:text-brand-primary dark:hover:text-dark-primary pb-1">Search</Link>
      <Link to="/history" className="hover:text-brand-primary dark:hover:text-dark-primary pb-1">History</Link>
    </div>
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-dark-primary">Login</Link>
      <Link to="/ask" className="px-5 py-2 bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg text-sm font-medium rounded-sm hover:bg-opacity-90 transition-all">Get Started</Link>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-50 dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border py-12 px-8 transition-colors duration-300">
    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
      <h2 className="text-xl font-bold text-brand-primary dark:text-dark-primary mb-4 italic">DocIntel AI</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">Your smart companion for understanding education policies.</p>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-dark-border flex justify-center items-center text-[10px] text-gray-400 uppercase tracking-widest text-center">
      <p></p>
    </div>
  </footer>
);

// --- Pages ---

const LandingPage = () => (
  <div className="min-h-screen bg-brand-bg dark:bg-dark-bg transition-colors duration-300">
    <Navbar />
    
    {/* Hero Section */}
    <section className="relative pt-20 pb-32 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-serif text-brand-primary dark:text-dark-primary leading-tight mb-8 italic">
          Instant Answers from <br />
          <span className="not-italic">India's Education Policies</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Every policy that shapes your academic life lives inside documents most people never finish reading. DocIntel reads them all — and answers your question in seconds.
        </p>
        <Link to="/ask" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg font-medium rounded-full hover:bg-opacity-90 transition-all shadow-xl shadow-brand-primary/20 dark:shadow-dark-primary/20">
          Start Searching <ArrowRight size={18} />
        </Link>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-80 border border-brand-primary dark:border-dark-primary rotate-3"></div>
        <div className="absolute bottom-20 right-10 w-80 h-64 border border-brand-primary dark:border-dark-primary -rotate-6"></div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-24 px-8 bg-white dark:bg-dark-surface transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">Core Intelligence</span>
        <h2 className="text-4xl font-serif text-brand-primary dark:text-dark-primary mb-16">How it works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Globe className="text-emerald-600 dark:text-emerald-400" />,
              title: "Real-Time Retrieval",
              desc: "Fetches latest policies directly from UGC, AICTE, and MoE portals — no stale databases.",
            },
            {
              icon: <Brain className="text-emerald-600 dark:text-emerald-400" />,
              title: "RAG-Powered Analysis",
              desc: "Uses Retrieval-Augmented Generation for context-aware, accurate policy interpretation.",
            },
            {
              icon: <Clock className="text-emerald-600 dark:text-emerald-400" />,
              title: "Always Up-to-Date",
              desc: "No manual updates needed. Every query pulls the freshest information available.",
            },
            {
              icon: <FileText className="text-emerald-600 dark:text-emerald-400" />,
              title: "Source Citations",
              desc: "Every response comes with direct links to official documents for verification.",
            },
            {
              icon: <Users className="text-emerald-600 dark:text-emerald-400" />,
              title: "Built for Everyone",
              desc: "Whether you're a student, faculty, or administrator — get answers in plain language.",
            },
            {
              icon: <Shield className="text-emerald-600 dark:text-emerald-400" />,
              title: "Trustworthy & Secure",
              desc: "Cloud-based architecture with secure access to verified government sources only.",
            }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-white dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-8">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-dark-text">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Journey Section */}
    <section className="py-24 px-8 bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-serif text-brand-primary dark:text-dark-primary italic mb-20">The Research Journey</h2>
        
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-dark-border -z-10 hidden md:block"></div>
          
          {[
            { step: "01", title: "Ask in plain English", desc: "No need for specific circular IDs or legal terms. Just type your query naturally." },
            { step: "02", title: "AI searches policies", desc: "Our engine crawls verified government repositories to find the exact clause." },
            { step: "03", title: "Get clear, sourced answer", desc: "Receive a simplified summary with direct links to the official PDF sources." }
          ].map((item, i) => (
            <div key={i} className="flex-1 max-w-xs">
              <div className="w-16 h-16 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-sm dark:text-dark-text">
                {item.step}
              </div>
              <h3 className="text-lg font-bold mb-4 dark:text-dark-text">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto bg-brand-primary dark:bg-dark-primary rounded-[2rem] py-20 px-8 text-center text-white dark:text-dark-bg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            Ready to simplify your <br />
            policy research?
          </h2>
          <p className="text-lg text-white/70 dark:text-dark-bg/70 mb-12">Join 500+ Indian institutions using DocIntel to master compliance.</p>
          <Link to="/ask" className="inline-block px-10 py-4 bg-white dark:bg-dark-bg text-brand-primary dark:text-dark-primary font-bold rounded-full hover:bg-opacity-90 transition-all">
            Start Your First Search
          </Link>
        </div>
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 gap-4 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-white/20 dark:border-dark-bg/20 rounded-full w-2 h-2"></div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-brand-bg dark:bg-dark-bg transition-colors duration-300">
      <div className="mb-12 text-center">
        <BookOpen className="w-12 h-12 text-brand-primary dark:text-dark-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-brand-primary dark:text-dark-primary italic">DocIntel AI</h1>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-dark-surface p-10 rounded-2xl shadow-2xl shadow-brand-primary/5 dark:shadow-dark-primary/5 border border-gray-100 dark:border-dark-border"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif mb-2 dark:text-dark-text">{activeTab === 'signin' ? 'Access Your Account' : 'Create account'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{activeTab === 'signin' ? 'Please authenticate to access the digital archives.' : 'Create your DocIntel account'}</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-gray-100 dark:bg-dark-bg rounded-xl mb-8">
          <button 
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'signin' ? 'bg-white dark:bg-dark-surface text-brand-primary dark:text-dark-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            Sign in
          </button>
          <button 
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'signup' ? 'bg-brand-secondary dark:bg-dark-secondary text-white dark:text-dark-bg shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            New member
          </button>
        </div>
        
        {activeTab === 'signin' ? (
          <form className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text"
                />
                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" size={18} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">password</label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-brand-primary dark:hover:text-dark-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary dark:text-dark-secondary mt-2">Forgot password?</button>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 dark:border-dark-border text-brand-primary dark:text-dark-primary focus:ring-brand-primary dark:focus:ring-dark-primary dark:bg-dark-bg" />
              <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">remember my password</label>
            </div>
            
            <Link to="/ask" className="w-full flex items-center justify-center gap-2 py-4 bg-brand-secondary dark:bg-dark-secondary text-white dark:text-dark-bg font-bold rounded-lg hover:bg-opacity-90 transition-all">
              Enter Portal <ArrowRight size={18} />
            </Link>
          </form>
        ) : (
          <form className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">FULL NAME</label>
              <input 
                type="text" 
                placeholder="Your full name" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">ROLE</label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm appearance-none dark:text-dark-text">
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="researcher">Researcher</option>
                  <option value="educator">Educator</option>
                  <option value="policy_maker">Policy Maker</option>
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 rotate-90" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">EMAIL</label>
              <input 
                type="email" 
                placeholder="you@university.edu.in" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">PASSWORD</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-brand-primary dark:hover:text-dark-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Link to="/ask" className="w-full flex items-center justify-center gap-2 py-4 bg-brand-secondary dark:bg-dark-secondary text-white dark:text-dark-bg font-bold rounded-lg hover:bg-opacity-90 transition-all">
              Create account <ArrowRight size={18} />
            </Link>
          </form>
        )}
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
            className="text-sm text-gray-500 hover:text-brand-primary dark:hover:text-dark-primary transition-colors"
          >
            {activeTab === 'signin' ? (
              <>Don't have an account? <span className="font-bold text-brand-secondary dark:text-dark-secondary">Sign up →</span></>
            ) : (
              <>Already have an account? <span className="font-bold text-brand-secondary dark:text-dark-secondary">Sign in →</span></>
            )}
          </button>
        </div>

        <p className="mt-12 text-center text-[11px] text-gray-400 dark:text-gray-500 italic leading-relaxed max-w-[280px] mx-auto">
          "Intelligence consists not only in the knowledge but also in the skill to apply the knowledge to practice."
        </p>
      </motion.div>
      
      <div className="fixed bottom-8 w-full px-8 flex justify-center items-center text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
        <p></p>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex bg-brand-bg dark:bg-dark-bg transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200 dark:border-dark-border flex flex-col bg-white dark:bg-dark-surface">
        <div className="p-8">
          <Link to="/" className="text-2xl font-bold text-brand-primary dark:text-dark-primary tracking-tight">DocIntel AI</Link>
        </div>
        
        <div className="flex-1 px-4 space-y-8">
          <div>
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-brand-secondary dark:text-dark-secondary mb-4">Research Library</h3>
            <p className="px-4 text-[10px] text-gray-400 dark:text-gray-500 mb-6">AI Policy Archive</p>
            
            <nav className="space-y-1">
              {[
                { icon: <Clock size={18} />, label: "Recent Analysis", path: "/ask" },
                { icon: <Archive size={18} />, label: "Search History", path: "/history" },
                { icon: <User size={18} />, label: "Account", path: "/account" },
                { icon: <Lightbulb size={18} />, label: "Scholar Insights", path: "#" }
              ].map((item, i) => (
                <Link 
                  key={i} 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path 
                      ? 'bg-gray-50 dark:bg-dark-bg text-brand-primary dark:text-dark-primary' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg hover:text-brand-primary dark:hover:text-dark-primary'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-brand-secondary dark:bg-dark-secondary text-white dark:text-dark-bg font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-lg shadow-brand-secondary/20">
            <Plus size={18} /> New Inquiry
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-8 bg-white dark:bg-dark-surface">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-brand-primary dark:hover:text-dark-primary">Home</Link>
            <Link to="/ask" className="text-brand-primary dark:text-dark-primary border-b-2 border-brand-primary dark:border-dark-primary pb-1">Ask AI</Link>
            <Link to="/history" className="hover:text-brand-primary dark:hover:text-dark-primary">History</Link>
            <Link to="/login" className="hover:text-brand-primary dark:hover:text-dark-primary">Login</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/account" className="w-8 h-8 rounded-full border-2 border-brand-primary dark:border-dark-primary flex items-center justify-center text-brand-primary dark:text-dark-primary hover:bg-brand-primary hover:text-white dark:hover:bg-dark-primary dark:hover:text-dark-bg transition-all">
              <User size={16} />
            </Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-12">
          {children}
        </div>
        
        <footer className="py-12 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg flex items-center justify-center px-12 text-center">
          <div className="flex flex-col items-center">
            <h4 className="text-xl font-bold text-brand-primary dark:text-dark-primary mb-2 italic">DocIntel AI</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Your smart companion for understanding education policies.</p>
            <div className="pt-8 border-t border-gray-200 dark:border-dark-border w-full">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest"></p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const InquiryPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello Scholar \n\nI can help you understand Indian education policies and digital laws in a simple way.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const saveToHistory = (query: string, response: string) => {
    const history = JSON.parse(localStorage.getItem('docintel_history') || '[]');
    const newItem = {
      tag: "POLICY INQUIRY",
      date: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }).replace(',', ' •'),
      title: query,
      desc: response.substring(0, 200) + (response.length > 200 ? '...' : '')
    };
    localStorage.setItem('docintel_history', JSON.stringify([newItem, ...history].slice(0, 20)));
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generatePolicyResponse(text, messages);
      const assistantMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      saveToHistory(text, response);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, Scholar. An error occurred while accessing the policy archives. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQueries = [
    "• Get quick summaries",
    "• Explore important policies",
    "• Understand concepts clearly"
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-serif text-brand-primary dark:text-dark-primary">Education Policy Assistant</h2>
        </div>
        
        <div className="space-y-8 mb-12">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-8 rounded-2xl border ${
                msg.role === 'user' 
                  ? 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-dark-border text-gray-800 dark:text-dark-text' 
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border shadow-sm relative overflow-hidden text-gray-800 dark:text-dark-text'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-brand-primary dark:bg-dark-primary"></div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
                
                {msg.role === 'assistant' && i === 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {suggestedQueries.map((query, j) => (
                      <button 
                        key={j} 
                        onClick={() => handleSend(query)}
                        className="px-4 py-2 bg-gray-100 dark:bg-dark-bg text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-dark-border transition-all"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-8 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-brand-primary dark:bg-dark-primary animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="sticky bottom-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 dark:from-dark-primary/20 dark:to-dark-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center gap-4 p-4 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-2xl shadow-xl"
            >
              <button type="button" className="p-2 text-gray-400 dark:text-gray-500 hover:text-brand-primary dark:hover:text-dark-primary transition-colors">
                <Plus size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Ask about any education policy..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm dark:text-dark-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="p-3 bg-brand-secondary dark:bg-dark-secondary text-white dark:text-dark-bg rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const AccountPage = () => {
  const [userData, setUserData] = useState({
    name: "Scholar Kashyap",
    email: "kashyapriya004@gmail.com",
    role: "Researcher",
    institution: "Indian Institute of Technology",
    bio: "Passionate about education policy and digital transformation in India.",
    notifications: true,
    language: "English"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(userData);

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-serif text-brand-primary dark:text-dark-primary">Account Information</h2>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-brand-secondary dark:bg-dark-secondary text-white dark:text-dark-bg font-bold rounded-full hover:bg-opacity-90 transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => { setIsEditing(false); setTempData(userData); }}
                className="px-6 py-2 border border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-dark-surface transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg font-bold rounded-full hover:bg-opacity-90 transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-dark-surface p-8 rounded-[2rem] border border-gray-100 dark:border-dark-border shadow-sm text-center">
              <div className="w-24 h-24 rounded-full bg-brand-bg dark:bg-dark-bg border-4 border-brand-primary/10 dark:border-dark-primary/10 flex items-center justify-center text-brand-primary dark:text-dark-primary mx-auto mb-6">
                <User size={48} />
              </div>
              <h3 className="text-xl font-bold text-brand-primary dark:text-dark-primary mb-1">{userData.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{userData.role}</p>
              <div className="pt-6 border-t border-gray-100 dark:border-dark-border">
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-secondary dark:text-dark-secondary">
                  <Globe size={14} />
                  Verified Scholar
                </div>
              </div>
            </div>
          </div>

          {/* Details Form */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-dark-surface p-10 rounded-[2rem] border border-gray-100 dark:border-dark-border shadow-sm">
              <h4 className="text-lg font-serif mb-8 dark:text-dark-text">Personal Details</h4>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={tempData.name}
                        onChange={(e) => setTempData({...tempData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text"
                      />
                    ) : (
                      <p className="text-sm font-medium dark:text-dark-text">{userData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Email Address</label>
                    <p className="text-sm font-medium dark:text-dark-text">{userData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Role</label>
                    {isEditing ? (
                      <select 
                        value={tempData.role}
                        onChange={(e) => setTempData({...tempData, role: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text appearance-none"
                      >
                        <option value="Student">Student</option>
                        <option value="Researcher">Researcher</option>
                        <option value="Educator">Educator</option>
                        <option value="Policy Maker">Policy Maker</option>
                      </select>
                    ) : (
                      <p className="text-sm font-medium dark:text-dark-text">{userData.role}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Institution</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={tempData.institution}
                        onChange={(e) => setTempData({...tempData, institution: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text"
                      />
                    ) : (
                      <p className="text-sm font-medium dark:text-dark-text">{userData.institution}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Scholar Bio</label>
                  {isEditing ? (
                    <textarea 
                      value={tempData.bio}
                      onChange={(e) => setTempData({...tempData, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:border-brand-primary dark:focus:border-dark-primary transition-all text-sm dark:text-dark-text resize-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{userData.bio}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-surface p-10 rounded-[2rem] border border-gray-100 dark:border-dark-border shadow-sm">
              <h4 className="text-lg font-serif mb-8 dark:text-dark-text">Personalization & Preferences</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold dark:text-dark-text">Email Notifications</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive weekly policy updates and analysis summaries.</p>
                  </div>
                  <button 
                    onClick={() => isEditing && setTempData({...tempData, notifications: !tempData.notifications})}
                    className={`w-12 h-6 rounded-full transition-all relative ${tempData.notifications ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-dark-bg'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tempData.notifications ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold dark:text-dark-text">Interface Language</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Select your preferred language for the AI assistant.</p>
                  </div>
                  {isEditing ? (
                    <select 
                      value={tempData.language}
                      onChange={(e) => setTempData({...tempData, language: e.target.value})}
                      className="px-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none text-xs dark:text-dark-text"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Sanskrit">Sanskrit</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium dark:text-dark-text">{userData.language}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('docintel_history') || '[]');
    setHistory(saved);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-dark-bg flex flex-col font-sans transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="flex items-center justify-end px-12 py-8 bg-[#FDFBF7] dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-12 text-lg font-serif text-[#5D4037] dark:text-dark-text">
          <Link to="/" className="hover:text-[#1A4D3E] dark:hover:text-dark-primary transition-colors">Home</Link>
          <Link to="/ask" className="hover:text-[#1A4D3E] dark:hover:text-dark-primary transition-colors">Ask AI</Link>
          <div className="relative">
            <Link to="/history" className="text-[#1A4D3E] dark:text-dark-primary font-bold">History</Link>
            <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#8B2635] dark:bg-dark-secondary"></div>
          </div>
          <Link to="/login" className="hover:text-[#1A4D3E] dark:hover:text-dark-primary transition-colors">Login</Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-24 px-8">
        <div className="mb-20 relative rounded-[3rem] overflow-hidden h-96 group">
          <img 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1920" 
            alt="Library" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A4D3E]/90 dark:from-dark-bg/90 to-transparent"></div>
          <div className="absolute bottom-12 left-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 dark:text-dark-bg/70 mb-4 block">Chronicle of Inquiry</span>
            <h2 className="text-7xl font-serif text-white dark:text-dark-text leading-tight font-medium">Search History</h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-20">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={22} />
          <input 
            type="text" 
            placeholder="Filter by keywords or themes..." 
            className="w-full pl-20 pr-10 py-6 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-[#1A4D3E] dark:focus:ring-dark-primary text-lg text-gray-600 dark:text-dark-text placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
        </div>

        {/* Archive Items */}
        <div className="space-y-10">
          {history.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 dark:text-gray-500 font-serif italic">The search history is currently empty. Your inquiries will appear here.</p>
            </div>
          ) : (
            history.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-dark-surface p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-dark-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center group hover:shadow-xl hover:shadow-[#1A4D3E]/5 dark:hover:shadow-dark-primary/5 transition-all duration-500"
              >
                <div className="absolute left-0 top-0 w-2 h-full bg-[#1A4D3E] dark:bg-dark-primary"></div>
                <div className="flex-1 md:pr-16">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 rounded-md">{item.tag}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{item.date}</span>
                  </div>
                  <h3 className="text-3xl font-serif text-[#1A4D3E] dark:text-dark-primary mb-6 leading-tight font-medium">{item.title}</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{item.desc}</p>
                </div>
                <Link to="/ask" className="mt-8 md:mt-0 flex items-center gap-3 px-8 py-4 bg-[#1A4D3E] dark:bg-dark-primary text-white dark:text-dark-bg text-sm font-bold rounded-full hover:bg-[#143d31] dark:hover:bg-opacity-90 transition-all shadow-lg shadow-[#1A4D3E]/20 dark:shadow-dark-primary/20">
                  Revisit <ArrowRight size={18} />
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {/* Section Divider */}
        <div className="mt-32 flex items-center justify-center gap-12">
          <div className="h-px flex-1 bg-gray-200 dark:bg-dark-border"></div>
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 whitespace-nowrap">Delve Deeper Into History</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-dark-border"></div>
        </div>
      </main>

    {/* Footer */}
    <footer className="bg-[#F3F1EE] dark:bg-dark-bg py-24 px-12 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="max-w-md">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400 leading-loose opacity-80">
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-24 gap-y-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          <button className="text-left hover:text-[#1A4D3E] dark:hover:text-dark-primary transition-colors">Privacy Policy</button>
          <button className="text-left hover:text-[#1A4D3E] dark:hover:text-dark-primary transition-colors">Institutional Access</button>
          <button className="text-left hover:text-[#1A4D3E] dark:hover:text-dark-primary transition-colors">Terms of Service</button>
          <button className="text-left hover:text-[#1A4D3E] dark:hover:text-dark-primary transition-colors">Contact Archivist</button>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ask" element={<InquiryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
