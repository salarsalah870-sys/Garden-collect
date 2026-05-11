import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Flower, MessageCircle, Phone, Video, Search, User, Home, Plus, Settings, Lock } from 'lucide-react';

// --- Types ---
type AppMode = 'disguise' | 'pin' | 'secret';

// --- Components ---

const PinScreen = ({ onAccess }: { onAccess: () => void }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = '2026'; // Secret PIN

  const handleInput = (val: string) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onAccess();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Lock className="w-12 h-12 text-[#f06292] mx-auto mb-6" />
        <h2 className="font-serif text-2xl text-[#f06292] italic mb-8">Identify Yourself</h2>
        
        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full border-2 border-[#f06292] transition-colors ${
                pin.length > i ? 'bg-[#f06292]' : 'bg-transparent'
              } ${error ? 'animate-bounce bg-red-400 border-red-400' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button 
              key={n} 
              onClick={() => handleInput(n.toString())}
              className="w-16 h-16 rounded-full border border-pink-100 text-[#f06292] text-xl font-medium hover:bg-pink-50 flex items-center justify-center transition-colors"
            >
              {n}
            </button>
          ))}
          <div />
          <button 
            onClick={() => handleInput('0')}
            className="w-16 h-16 rounded-full border border-pink-100 text-[#f06292] text-xl font-medium hover:bg-pink-50 flex items-center justify-center transition-colors"
          >
            0
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const GardenGame = ({ onTriggerPin }: { onTriggerPin: () => void }) => {
  const [flowers, setFlowers] = useState<{ id: number, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  const triggerRef = useRef<{ count: number, lastTap: number }>({ count: 0, lastTap: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (flowers.length < 8) {
        setFlowers(prev => [...prev, { 
          id: Date.now(), 
          x: Math.random() * 80 + 10, 
          y: Math.random() * 70 + 15 
        }]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [flowers.length]);

  const handleFlowerClick = (id: number) => {
    setFlowers(prev => prev.filter(f => f.id !== id));
    setScore(s => s + 10);
  };

  const handleSecretTrigger = () => {
    const now = Date.now();
    if (now - triggerRef.current.lastTap < 1000) {
      triggerRef.current.count += 1;
    } else {
      triggerRef.current.count = 1;
    }
    triggerRef.current.lastTap = now;

    if (triggerRef.current.count >= 3) {
      onTriggerPin();
      triggerRef.current.count = 0;
    }
  };

  return (
    <div className="h-full w-full coquette-gradient relative overflow-hidden select-none">
      {/* Decorative ribbons overlay (simulated with CSS/motion) */}
      <div className="absolute top-0 w-full h-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10 pointer-events-none" />
      
      {/* HUD */}
      <div className="absolute top-12 left-6 right-6 flex justify-between items-center z-10">
        <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-[#f06292]/30">
          <span className="font-serif italic text-[#f06292]">Garden Score: {score}</span>
        </div>
        <button 
          onClick={handleSecretTrigger}
          className="w-12 h-12 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center border border-[#f06292]/30 active:scale-95 transition-transform"
        >
          <Heart className="w-6 h-6 text-[#f06292] fill-[#f06292]/20" />
        </button>
      </div>

      <AnimatePresence>
        {flowers.map(f => (
          <motion.button
            key={f.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            onClick={() => handleFlowerClick(f.id)}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            className="absolute p-4 cursor-pointer"
          >
            <Flower className="w-10 h-10 text-[#f06292] animate-pulse" />
          </motion.button>
        ))}
      </AnimatePresence>

      <div className="absolute bottom-12 w-full text-center">
        <p className="font-serif italic text-[#f06292]/60 text-sm">Tend to your garden of secrets...</p>
      </div>
    </div>
  );
};

const VideoFeed = () => {
  const [activeTab, setActiveTab] = useState(0);
  const videos = [
    { id: 1, user: '@eternal_echo', desc: 'Midnight reflections...', likes: '2.4M', color: 'bg-zinc-900' },
    { id: 2, user: '@silent_rose', desc: 'Beauty in the shadows.', likes: '890K', color: 'bg-stone-900' },
    { id: 3, user: '@velvet_lock', desc: 'Private files.', likes: '1.2M', color: 'bg-neutral-900' },
  ];

  return (
    <div className="h-full bg-black flex flex-col">
      {/* Vertical Scroll Area */}
      <div className="flex-1 overflow-y-scroll snap-y snap-mandatory h-full">
        {videos.map(v => (
          <div key={v.id} className={`h-full w-full snap-start relative flex flex-col items-center justify-center ${v.color}`}>
            <div className="absolute inset-0 flex items-center justify-center text-white/5 font-display text-[10vw] uppercase select-none">
              Encrypted Stream
            </div>
            
            {/* Right overlay */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <Heart className="w-7 h-7 text-white fill-white" />
                </div>
                <span className="text-white text-xs font-semibold">{v.likes}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Plus className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-6 left-6 right-16">
              <h3 className="text-white font-bold text-lg mb-1">{v.user}</h3>
              <p className="text-white/80 text-sm leading-snug">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="h-16 bg-black border-t border-white/10 flex justify-around items-center px-4">
        <Home className="w-7 h-7 text-white" />
        <Search className="w-7 h-7 text-white/50" />
        <div className="w-12 h-9 bg-white rounded-lg flex items-center justify-center">
          <Plus className="w-6 h-6 text-black" />
        </div>
        <MessageCircle className="w-7 h-7 text-white/50" />
        <User className="w-7 h-7 text-white/50" />
      </div>
    </div>
  );
};

const SecretApp = ({ setMode }: { setMode: (m: AppMode) => void }) => {
  const [view, setView] = useState<'feed' | 'comm' | 'upload'>('feed');
  const [encrypting, setEncrypting] = useState(false);

  const handleSimulatedUpload = () => {
    setEncrypting(true);
    setTimeout(() => {
      setEncrypting(false);
      setView('feed');
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full bg-black text-white relative flex flex-col"
    >
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-20 bg-gradient-to-b from-black/60 to-transparent">
        <span className="font-display italic text-xl tracking-widest uppercase">Secret</span>
        <div className="flex gap-4">
          <button onClick={() => setView(view === 'comm' ? 'feed' : 'comm')}>
            {view === 'comm' ? <Home className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
          </button>
          <Settings className="w-6 h-6" />
        </div>
      </header>

      {view === 'feed' && <VideoFeed />}
      
      {view === 'comm' && (
        <div className="flex-1 flex flex-col p-8 pt-24 justify-center items-center text-center">
            <h1 className="font-display text-4xl mb-2">Encrypted Comms</h1>
            <p className="text-white/40 mb-12 italic text-sm">Peer-to-peer secure gateway active.</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <button className="flex flex-col items-center gap-4 p-8 bg-zinc-900/50 rounded-3xl border border-white/5 hover:bg-zinc-800 transition-colors">
                    <div className="p-4 bg-green-500/20 rounded-full">
                        <Phone className="w-8 h-8 text-green-500" />
                    </div>
                    <span className="text-sm font-medium">Safe Call</span>
                </button>
                <button className="flex flex-col items-center gap-4 p-8 bg-zinc-900/50 rounded-3xl border border-white/5 hover:bg-zinc-800 transition-colors">
                    <div className="p-4 bg-blue-500/20 rounded-full">
                        <Video className="w-8 h-8 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">Video Link</span>
                </button>
            </div>

            <div className="mt-12 w-full max-w-sm p-6 bg-zinc-900/40 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/50 lowercase tracking-wider">No logs stored on server</span>
            </div>
        </div>
      )}

      {view === 'upload' && (
        <div className="flex-1 flex flex-col p-8 pt-24 items-center justify-center bg-zinc-900">
           <AnimatePresence mode="wait">
            {!encrypting ? (
              <motion.div 
                key="upload-ui"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-white/20">
                  <Plus className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-display mb-2">Import Private Asset</h2>
                <p className="text-white/40 mb-8 max-w-xs">All files are salted and hashed locally before being added to your private feed.</p>
                <button 
                  onClick={handleSimulatedUpload}
                  className="px-12 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors"
                >
                  Select Video
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="encrypting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                <p className="text-sm tracking-widest uppercase animate-pulse">Encrypting & Verifying...</p>
              </motion.div>
            )}
           </AnimatePresence>
        </div>
      )}

      {/* Nav */}
      <div className="h-16 bg-black border-t border-white/10 flex justify-around items-center px-4">
        <button onClick={() => setView('feed')}><Home className={`w-7 h-7 ${view === 'feed' ? 'text-white' : 'text-white/30'}`} /></button>
        <Search className="w-7 h-7 text-white/30" />
        <button 
          onClick={() => setMode('disguise')} // Emergency back to garden
          onDoubleClick={() => setView('upload')}
          className="w-12 h-9 bg-white rounded-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 text-black" />
        </button>
        <MessageCircle className="w-7 h-7 text-white/30" />
        <User className="w-7 h-7 text-white/30" />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [mode, setMode] = useState<AppMode>('disguise');

  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-black font-sans">
      <AnimatePresence mode="wait">
        {mode === 'disguise' && (
          <motion.div 
            key="disguise"
            exit={{ opacity: 0, scale: 1.1 }}
            className="h-full w-full"
          >
            <GardenGame onTriggerPin={() => setMode('pin')} />
          </motion.div>
        )}
        
        {mode === 'pin' && (
          <motion.div 
            key="pin"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <PinScreen onAccess={() => setMode('secret')} />
          </motion.div>
        )}

        {mode === 'secret' && (
            <motion.div 
                key="secret"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full w-full"
            >
                <SecretApp setMode={setMode} />
                {/* Emergency Logout - Hidden Button */}
                <button 
                    onDoubleClick={() => setMode('disguise')}
                    className="fixed top-0 left-0 w-16 h-16 opacity-0 z-[100]" 
                />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Global Aesthetics Overlay */}
      <div className="fixed inset-0 pointer-events-none border-[12px] border-black z-[1000]" />
    </div>
  );
}
