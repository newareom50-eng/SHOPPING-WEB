import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Zap, 
  Palette, 
  Code, 
  TrendingUp, 
  Briefcase, 
  BookOpen, 
  ChevronRight, 
  Star, 
  Play, 
  Copy, 
  Check, 
  ArrowLeft,
  ShoppingCart,
  Library,
  User,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { MOCK_PROMPTS, CATEGORIES } from './constants';
import { Prompt, Category } from './types';
import { generateSandboxPreview } from './services/geminiService';

// --- Components ---

const Header = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => (
  <header className="sticky top-0 z-50 w-full glass-card border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('store')}>
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
        <span className="font-display text-xl font-bold tracking-tight">PromptNexus</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        {['Store', 'Library', 'Create'].map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item.toLowerCase())}
            className={`text-sm font-medium transition-colors hover:text-brand-600 ${
              activeTab === item.toLowerCase() ? 'text-brand-600' : 'text-slate-600'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <Search size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
          <User size={18} />
        </div>
      </div>
    </div>
  </header>
);

const CategoryIcon = ({ name, size = 18 }: { name: string, size?: number }) => {
  switch (name) {
    case 'Productivity': return <Zap size={size} />;
    case 'Creative': return <Palette size={size} />;
    case 'Coding': return <Code size={size} />;
    case 'Marketing': return <TrendingUp size={size} />;
    case 'Business': return <Briefcase size={size} />;
    case 'Education': return <BookOpen size={size} />;
    default: return <Zap size={size} />;
  }
};

const PromptCard = ({ prompt, onClick }: { prompt: Prompt, onClick: () => void }) => (
  <motion.div
    layoutId={`card-${prompt.id}`}
    onClick={onClick}
    className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
    whileHover={{ y: -4 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
        <CategoryIcon name={prompt.category} size={14} />
        {prompt.category}
      </div>
      <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
        <Star size={14} fill="currentColor" />
        4.9
      </div>
    </div>
    
    <h3 className="font-display text-lg font-bold mb-2 group-hover:text-brand-600 transition-colors">
      {prompt.title}
    </h3>
    <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow">
      {prompt.description}
    </p>
    
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2">
        <img src={prompt.creator.avatar} alt={prompt.creator.name} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
        <span className="text-xs text-slate-600 font-medium">{prompt.creator.name}</span>
      </div>
      <div className="text-brand-600 font-bold">
        ${(prompt.priceCents / 100).toFixed(2)}
      </div>
    </div>
  </motion.div>
);

const Sandbox = ({ prompt }: { prompt: Prompt }) => {
  const [inputs, setInputs] = useState<Record<string, string>>(
    prompt.placeholders.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue || '' }), {})
  );
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const output = await generateSandboxPreview(prompt, inputs);
      setResult(output || "No output generated.");
    } catch (err) {
      setResult("Error generating preview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {prompt.placeholders.map((p) => (
          <div key={p.id} className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{p.label}</label>
            {p.type === 'dropdown' ? (
              <select
                value={inputs[p.id]}
                onChange={(e) => setInputs({ ...inputs, [p.id]: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              >
                {p.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type="text"
                value={inputs[p.id]}
                onChange={(e) => setInputs({ ...inputs, [p.id]: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder={`Enter ${p.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-200"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={18} />}
        {loading ? 'Generating...' : 'Generate Live Preview'}
      </button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-sm leading-relaxed relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-500" />
          <div className="flex items-center justify-between mb-4 text-slate-500 text-xs uppercase tracking-widest font-bold">
            <span>Gemini 3 Flash Output</span>
            <button onClick={() => navigator.clipboard.writeText(result)} className="hover:text-white transition-colors">
              <Copy size={14} />
            </button>
          </div>
          <div className="whitespace-pre-wrap">{result}</div>
        </motion.div>
      )}
    </div>
  );
};

const PromptDetails = ({ prompt, onBack, onPurchase }: { prompt: Prompt, onBack: () => void, onPurchase: () => void }) => {
  const [activeView, setActiveView] = useState<'details' | 'sandbox'>('details');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-slate-50 overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
                  {prompt.category}
                </div>
                <div className="text-slate-400 text-sm">•</div>
                <div className="text-slate-500 text-sm font-medium">Version 1.2.0</div>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {prompt.title}
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                {prompt.description}
              </p>
            </section>

            <div className="flex border-b border-slate-200">
              {['Details', 'Sandbox'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view.toLowerCase() as any)}
                  className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all relative ${
                    activeView === view.toLowerCase() ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {view}
                  {activeView === view.toLowerCase() && (
                    <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeView === 'details' ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">The Logic</h3>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 italic text-slate-700 leading-relaxed shadow-sm">
                      "{prompt.systemInstruction}"
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">High-Fidelity Examples</h3>
                    <div className="space-y-6">
                      {prompt.examples.length > 0 ? prompt.examples.map((ex, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-100 rounded-xl p-4 text-xs font-mono text-slate-600">
                            <div className="font-bold mb-2 text-slate-400 uppercase tracking-tighter">Input</div>
                            {JSON.stringify(ex.input, null, 2)}
                          </div>
                          <div className="bg-brand-50 rounded-xl p-4 text-xs font-mono text-brand-900">
                            <div className="font-bold mb-2 text-brand-400 uppercase tracking-tighter">Output</div>
                            <div className="whitespace-pre-wrap">{ex.output}</div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-slate-400 text-sm italic">No examples provided for this prompt yet.</div>
                      )}
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div
                  key="sandbox"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Sandbox prompt={prompt} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
                <div className="text-4xl font-bold mb-2">
                  ${(prompt.priceCents / 100).toFixed(2)}
                </div>
                <p className="text-slate-500 text-sm mb-8">One-time purchase • Lifetime updates</p>
                
                <button 
                  onClick={onPurchase}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mb-4"
                >
                  <ShoppingCart size={20} />
                  Buy Now
                </button>
                
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-green-500" />
                    <span>Full System Instructions</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-green-500" />
                    <span>Optimized for {prompt.modelSettings.model}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-green-500" />
                    <span>Commercial usage rights</span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-600 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <img src={prompt.creator.avatar} alt={prompt.creator.name} className="w-12 h-12 rounded-full border-2 border-white/20" referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-bold">{prompt.creator.name}</div>
                    <div className="text-white/60 text-xs">Top Rated Engineer</div>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  "I specialize in creating prompts that reduce hallucination and maximize creative output."
                </p>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-sm transition-all border border-white/20">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('store');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [library, setLibrary] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = MOCK_PROMPTS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = (id: string) => {
    if (!library.includes(id)) {
      setLibrary([...library, id]);
      alert("Prompt added to your library!");
    } else {
      alert("You already own this prompt.");
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'store' && (
            <motion.div
              key="store"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hero Section */}
              <section className="text-center mb-16">
                <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                  The Future of <span className="text-brand-600">Instructions.</span>
                </h2>
                <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
                  Discover high-performance prompts engineered for Gemini 3 and beyond. 
                  Test in the sandbox before you buy.
                </p>
              </section>

              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-brand-500 outline-none shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      selectedCategory === 'All' 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name as Category)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat.name 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <CategoryIcon name={cat.name} size={14} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="prompt-grid">
                {filteredPrompts.map(prompt => (
                  <PromptCard 
                    key={prompt.id} 
                    prompt={prompt} 
                    onClick={() => setSelectedPrompt(prompt)} 
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-4xl font-bold">Your Library</h2>
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Library size={20} />
                  <span>{library.length} Prompts Owned</span>
                </div>
              </div>

              {library.length > 0 ? (
                <div className="prompt-grid">
                  {MOCK_PROMPTS.filter(p => library.includes(p.id)).map(prompt => (
                    <PromptCard 
                      key={prompt.id} 
                      prompt={prompt} 
                      onClick={() => setSelectedPrompt(prompt)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your library is empty</h3>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                    Browse the store to find high-quality prompts and start building your collection.
                  </p>
                  <button 
                    onClick={() => setActiveTab('store')}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-xl transition-all"
                  >
                    Go to Store
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto text-brand-600">
                <Code size={40} />
              </div>
              <h2 className="font-display text-4xl font-bold">Become a Prompt Engineer</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                The creator dashboard is currently in beta. We're hand-selecting the best prompt engineers 
                to join our early marketplace.
              </p>
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-left space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <div className="font-bold mb-1">Submit your portfolio</div>
                    <div className="text-sm text-slate-500">Show us your best Gemini or GPT-4 prompts.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <div className="font-bold mb-1">Pass the fidelity test</div>
                    <div className="text-sm text-slate-500">We verify that your prompts produce consistent, high-quality results.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <div className="font-bold mb-1">Start earning</div>
                    <div className="text-sm text-slate-500">Set your price and earn 80% on every sale.</div>
                  </div>
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all">
                Apply for Creator Access
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedPrompt && (
          <PromptDetails 
            prompt={selectedPrompt} 
            onBack={() => setSelectedPrompt(null)} 
            onPurchase={() => handlePurchase(selectedPrompt.id)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between z-50">
        <button onClick={() => setActiveTab('store')} className={`flex flex-col items-center gap-1 ${activeTab === 'store' ? 'text-brand-600' : 'text-slate-400'}`}>
          <ShoppingCart size={20} />
          <span className="text-[10px] font-bold uppercase">Store</span>
        </button>
        <button onClick={() => setActiveTab('library')} className={`flex flex-col items-center gap-1 ${activeTab === 'library' ? 'text-brand-600' : 'text-slate-400'}`}>
          <Library size={20} />
          <span className="text-[10px] font-bold uppercase">Library</span>
        </button>
        <button onClick={() => setActiveTab('create')} className={`flex flex-col items-center gap-1 ${activeTab === 'create' ? 'text-brand-600' : 'text-slate-400'}`}>
          <Code size={20} />
          <span className="text-[10px] font-bold uppercase">Create</span>
        </button>
      </div>
    </div>
  );
}

