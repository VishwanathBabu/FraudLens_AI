
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CATEGORIES, STATES, INITIAL_FORM_DATA, MONTHS, JOBS, MERCHANTS, SAMPLE_CITIES } from './constants';
import { TransactionData, PredictionResult } from './types';
import { analyzeTransaction } from './services/geminiService';
import { 
  AlertTriangle, 
  Loader2, 
  MapPin, 
  User, 
  CreditCard, 
  Activity,
  BarChart3,
  Search,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Compass,
  Briefcase,
  Globe,
  Users,
  Calendar,
  Shuffle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

type AppView = 'input' | 'results';

// --- Scroll Picker Components ---

interface WheelColumnProps {
  options: (string | number)[];
  value: string | number;
  onChange: (val: string | number) => void;
  flex?: string;
  textAlign?: 'left' | 'center' | 'right';
  isDarkMode?: boolean;
}

const WheelColumn: React.FC<WheelColumnProps> = ({ options, value, onChange, flex = "1", textAlign = "center", isDarkMode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const itemHeight = 40; 

  // Sync scroll position with value
  useEffect(() => {
    if (scrollRef.current) {
      const index = options.indexOf(value);
      if (index !== -1) {
        const targetScroll = index * itemHeight;
        if (Math.abs(scrollRef.current.scrollTop - targetScroll) > 1) {
          isProgrammaticScroll.current = true;
          scrollRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
          
          const timer = setTimeout(() => {
            isProgrammaticScroll.current = false;
          }, 600);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [value, options]);

  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollTop / itemHeight);
      const selected = options[index];
      if (selected !== undefined && selected !== value) {
        onChange(selected);
      }
    }
  };

  return (
    <div className="relative h-[160px] flex-shrink-0" style={{ flex }}>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar py-[60px]"
      >
        {options.map((opt, i) => (
          <div 
            key={i}
            className={`h-[40px] flex items-center justify-${textAlign === 'center' ? 'center' : textAlign === 'left' ? 'start' : 'end'} snap-center cursor-pointer transition-all duration-200 ${
              value === opt 
                ? (isDarkMode ? 'text-white font-black scale-100' : 'text-slate-900 font-bold scale-100') 
                : (isDarkMode ? 'text-slate-600 font-medium opacity-60' : 'text-slate-400 font-medium opacity-60')
            }`}
            onClick={() => onChange(opt)}
          >
            <span className="truncate px-2 text-sm sm:text-base">
              {typeof opt === 'string' && opt.length > 5 ? opt.substring(0, 3) : opt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WheelPickerContainer: React.FC<{ children: React.ReactNode; label?: string; icon?: React.ReactNode; isDarkMode?: boolean }> = ({ children, label, icon, isDarkMode }) => (
  <div className="space-y-2">
    {label && (
      <div className="flex items-center space-x-1.5 ml-1">
        {icon && <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>{icon}</span>}
        <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
      </div>
    )}
    <div className={`relative rounded-2xl border overflow-hidden flex items-center px-1 group shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50/50 border-slate-300'}`}>
      {/* Highlighted Selected Row Background */}
      <div className={`absolute top-1/2 left-1 right-1 h-[40px] -translate-y-1/2 rounded-lg border-y pointer-events-none z-10 ${isDarkMode ? 'bg-blue-400/10 border-blue-400/20' : 'bg-blue-600/5 border-blue-600/10'}`} />
      
      {/* Soft Gradual Fades */}
      <div className={`absolute top-0 left-0 w-full h-[40px] pointer-events-none z-20 ${isDarkMode ? 'bg-gradient-to-b from-slate-900/90 to-transparent' : 'bg-gradient-to-b from-slate-50/90 to-transparent'}`} />
      <div className={`absolute bottom-0 left-0 w-full h-[40px] pointer-events-none z-20 ${isDarkMode ? 'bg-gradient-to-t from-slate-900/90 to-transparent' : 'bg-gradient-to-t from-slate-50/90 to-transparent'}`} />
      
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState<AppView>('input');
  const [formData, setFormData] = useState<TransactionData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const formatDateLocal = (date: Date) => {
    return date.toLocaleString('sv-SE').replace(' ', 'T').substring(0, 16);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleRandomize = () => {
    const randomCity = SAMPLE_CITIES[Math.floor(Math.random() * SAMPLE_CITIES.length)];
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randomMerchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
    const randomJob = JOBS[Math.floor(Math.random() * JOBS.length)];
    const randomGender = Math.random() > 0.5 ? 'M' : 'F';
    
    const isHighAmount = Math.random() > 0.9;
    const randomAmount = isHighAmount 
      ? parseFloat((Math.random() * 800 + 500).toFixed(2))
      : parseFloat((Math.random() * 150 + 5).toFixed(2));

    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - (Math.floor(Math.random() * 67) + 18);
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    const txDate = new Date();
    if (Math.random() > 0.5) txDate.setDate(txDate.getDate() - 1);
    txDate.setHours(Math.floor(Math.random() * 24));
    txDate.setMinutes(Math.floor(Math.random() * 60));

    const latOffset = (Math.random() - 0.5) * 0.2;
    const longOffset = (Math.random() - 0.5) * 0.2;

    setFormData({
      amt: randomAmount,
      category: randomCategory,
      trans_date_trans_time: formatDateLocal(txDate),
      gender: randomGender,
      city: randomCity.city,
      state: randomCity.state,
      job: randomJob,
      dob: `${birthYear}-${birthMonth}-${birthDay}`,
      merchant: randomMerchant,
      merch_lat: parseFloat((randomCity.lat + latOffset).toFixed(4)),
      merch_long: parseFloat((randomCity.long + longOffset).toFixed(4)),
      lat: randomCity.lat,
      long: randomCity.long,
      city_pop: randomCity.pop
    });
  };

  const updateDatePart = (fieldName: 'trans_date_trans_time' | 'dob', part: 'y' | 'm' | 'd' | 'h' | 'min', val: string | number) => {
    if (fieldName === 'dob') {
      const [y, m, d] = formData.dob.split('-');
      let newY = y, newM = m, newD = d;
      if (part === 'y') newY = val.toString();
      if (part === 'm') newM = (MONTHS.indexOf(val as string) + 1).toString().padStart(2, '0');
      if (part === 'd') newD = val.toString().padStart(2, '0');
      setFormData(prev => ({ ...prev, dob: `${newY}-${newM}-${newD}` }));
    } else {
      const dt = new Date(formData.trans_date_trans_time);
      if (part === 'y') dt.setFullYear(val as number);
      if (part === 'm') dt.setMonth(MONTHS.indexOf(val as string));
      if (part === 'd') dt.setDate(val as number);
      if (part === 'h') dt.setHours(val as number);
      if (part === 'min') dt.setMinutes(val as number);
      setFormData(prev => ({ ...prev, trans_date_trans_time: formatDateLocal(dt) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const prediction = await analyzeTransaction(formData);
      setResult(prediction);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Failed to analyze transaction. Please check your API configuration.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chartData = result ? [
    { name: 'Fraud Prob.', value: result.probability * 100 },
    { name: 'Safety Prob.', value: (1 - result.probability) ? (1 - result.probability) * 100 : 0 }
  ] : [];

  const getDobParts = () => {
    const [y, m, d] = formData.dob.split('-');
    return { year: parseInt(y), month: MONTHS[parseInt(m) - 1], day: parseInt(d) };
  };

  const getTransParts = () => {
    const dt = new Date(formData.trans_date_trans_time);
    return { 
      year: dt.getFullYear(), 
      month: MONTHS[dt.getMonth()], 
      day: dt.getDate(),
      hour: dt.getHours(),
      minute: dt.getMinutes()
    };
  };

  const renderLoadingView = () => (
    <div className="flex-grow flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="relative mb-8">
        <Loader2 className="w-20 h-20 sm:w-24 sm:h-24 text-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
        </div>
      </div>
      <div className="text-center px-6">
        <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Synthesizing Data</h3>
        <p className="text-slate-500 mt-2 font-medium">Evaluating cross-referenced fraud signals...</p>
        <div className="mt-8 flex justify-center space-x-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );

  const renderInputView = () => {
    const dobParts = getDobParts();
    const transParts = getTransParts();
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: 110 }, (_, i) => currentYear - i);
    const transYearRange = [currentYear - 1, currentYear, currentYear + 1];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const cardClasses = `rounded-[2.5rem] shadow-sm border transition-all hover:shadow-xl ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:shadow-black/50' : 'bg-white border-slate-200 hover:shadow-slate-200/50'}`;
    const inputClasses = `w-full px-5 py-4 border rounded-[1.25rem] focus:ring-4 outline-none transition-all text-sm font-bold appearance-none cursor-pointer ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-slate-800' : 'bg-slate-50/50 border-slate-200 text-slate-700 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white'}`;
    const labelClasses = `text-[10px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`;

    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 px-4">
        <div className="mb-12 text-center">
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border transition-colors ${isDarkMode ? 'bg-blue-900/30 text-blue-400 border-blue-900/50' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Real-time Risk Monitoring</span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-black tracking-tight transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fraud Analysis Hub</h2>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto font-medium">
            Enter transaction metadata to execute an AI-driven security audit based on global patterns.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Section 1: Transaction Attributes */}
            <div className={cardClasses}>
              <div className="px-8 pt-8 pb-4 flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Transaction details</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Core spending metrics</p>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <label className={labelClasses}>Transaction Amount</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg group-focus-within:text-blue-600 transition-colors">$</span>
                    <input
                      type="number"
                      name="amt"
                      value={formData.amt}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-6 py-4 border rounded-[1.25rem] focus:ring-4 outline-none transition-all text-2xl font-black ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500/10 focus:border-blue-500 focus:bg-slate-800' : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white'}`}
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className={labelClasses}>Spending Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat.replace(/_/g, ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <WheelPickerContainer label="Execution Date" icon={<Calendar className="w-3 h-3" />} isDarkMode={isDarkMode}>
                    <WheelColumn options={MONTHS} value={transParts.month} onChange={(v) => updateDatePart('trans_date_trans_time', 'm', v)} textAlign="left" flex="1.4" isDarkMode={isDarkMode} />
                    <WheelColumn options={days} value={transParts.day} onChange={(v) => updateDatePart('trans_date_trans_time', 'd', v)} flex="0.8" isDarkMode={isDarkMode} />
                    <WheelColumn options={transYearRange} value={transParts.year} onChange={(v) => updateDatePart('trans_date_trans_time', 'y', v)} textAlign="right" flex="1" isDarkMode={isDarkMode} />
                  </WheelPickerContainer>
                  
                  <WheelPickerContainer label="Execution Time" icon={<Clock className="w-3 h-3" />} isDarkMode={isDarkMode}>
                    <WheelColumn options={hours} value={transParts.hour} onChange={(v) => updateDatePart('trans_date_trans_time', 'h', v)} textAlign="right" flex="1" isDarkMode={isDarkMode} />
                    <span className="text-slate-300 font-black px-1.5 opacity-40">:</span>
                    <WheelColumn options={minutes} value={transParts.minute} onChange={(v) => updateDatePart('trans_date_trans_time', 'min', v)} textAlign="left" flex="1" isDarkMode={isDarkMode} />
                  </WheelPickerContainer>
                </div>
              </div>
            </div>

            {/* Section 2: Customer Profile */}
            <div className={cardClasses}>
              <div className="px-8 pt-8 pb-4 flex items-center space-x-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Cardholder details</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Personal identity signals</p>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <label className={labelClasses}>Gender</label>
                  <div className={`flex p-1.5 rounded-[1.25rem] border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-200'}`}>
                    <button 
                      type="button"
                      onClick={() => setFormData(p => ({...p, gender: 'M'}))}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${formData.gender === 'M' ? (isDarkMode ? 'bg-slate-700 text-blue-400 shadow-lg' : 'bg-white text-indigo-600 shadow-sm') : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
                    >Male</button>
                    <button 
                      type="button"
                      onClick={() => setFormData(p => ({...p, gender: 'F'}))}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${formData.gender === 'F' ? (isDarkMode ? 'bg-slate-700 text-blue-400 shadow-lg' : 'bg-white text-indigo-600 shadow-sm') : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
                    >Female</button>
                  </div>
                </div>

                <div className="max-w-xs">
                  <WheelPickerContainer label="Customer Birth Date" icon={<Calendar className="w-3 h-3" />} isDarkMode={isDarkMode}>
                    <WheelColumn options={MONTHS} value={dobParts.month} onChange={(v) => updateDatePart('dob', 'm', v)} textAlign="left" flex="1.4" isDarkMode={isDarkMode} />
                    <WheelColumn options={days} value={dobParts.day} onChange={(v) => updateDatePart('dob', 'd', v)} flex="0.8" isDarkMode={isDarkMode} />
                    <WheelColumn options={yearRange} value={dobParts.year} onChange={(v) => updateDatePart('dob', 'y', v)} textAlign="right" flex="1" isDarkMode={isDarkMode} />
                  </WheelPickerContainer>
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>Professional Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="job"
                      value={formData.job}
                      onChange={handleChange}
                      placeholder="e.g. Systems Architect"
                      className={`w-full pl-12 pr-5 py-4 border rounded-[1.25rem] focus:ring-4 outline-none transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-slate-800' : 'bg-slate-50/50 border-slate-200 text-slate-700 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white'}`}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Regional Context */}
            <div className={cardClasses}>
              <div className="px-8 pt-8 pb-4 flex items-center space-x-4">
                <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Regional context</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Merchant & location mapping</p>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className={labelClasses}>Merchant Name</label>
                  <input
                    type="text"
                    name="merchant"
                    value={formData.merchant}
                    onChange={handleChange}
                    placeholder="e.g. Kroger_Fraud_Detection"
                    className={`w-full px-5 py-4 border rounded-[1.25rem] focus:ring-4 outline-none transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-slate-800' : 'bg-slate-50/50 border-slate-200 text-slate-700 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white'}`}
                    required
                  />
                </div>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 sm:col-span-8 space-y-2">
                    <label className={labelClasses}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border rounded-[1.25rem] focus:ring-4 outline-none transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-slate-800' : 'bg-slate-50/50 border-slate-200 text-slate-700 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white'}`}
                      required
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-4 space-y-2">
                    <label className={labelClasses}>State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    >
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>City Population</label>
                  <div className="relative">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      name="city_pop"
                      value={formData.city_pop}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-5 py-4 border rounded-[1.25rem] focus:ring-4 outline-none transition-all text-sm font-bold ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-slate-800' : 'bg-slate-50/50 border-slate-200 text-slate-700 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white'}`}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Coordinate Mapping */}
            <div className={cardClasses}>
              <div className="px-8 pt-8 pb-4 flex items-center space-x-4">
                <div className="p-3 bg-slate-800 rounded-2xl text-white shadow-lg shadow-slate-200 dark:shadow-black/50">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Geospatial signals</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Coordinate precision mapping</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className={`grid grid-cols-2 gap-x-6 gap-y-8 p-8 rounded-[2rem] border transition-colors ${isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                  <div className="space-y-2">
                    <label className={labelClasses}>User Latitude</label>
                    <input type="number" step="0.0001" name="lat" value={formData.lat} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl text-sm font-bold shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>User Longitude</label>
                    <input type="number" step="0.0001" name="long" value={formData.long} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl text-sm font-bold shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Merch Latitude</label>
                    <input type="number" step="0.0001" name="merch_lat" value={formData.merch_lat} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl text-sm font-bold shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Merch Longitude</label>
                    <input type="number" step="0.0001" name="merch_long" value={formData.merch_long} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl text-sm font-bold shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className={`p-6 rounded-3xl flex items-center space-x-4 animate-shake border ${isDarkMode ? 'bg-red-900/20 border-red-900/50' : 'bg-red-50 border-red-200'}`}>
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className={`font-bold ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>{error}</p>
            </div>
          )}

          <div className="pt-8 max-w-xl mx-auto space-y-4">
            <button
              type="button"
              onClick={handleRandomize}
              className={`w-full flex items-center justify-center space-x-3 font-bold py-4 rounded-[1.5rem] border shadow-sm transition-all active:scale-95 group uppercase tracking-widest text-sm ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'}`}
            >
              <Shuffle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Randomize Test Data</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-200 dark:shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-4 text-xl uppercase tracking-widest"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Analyze Transaction Risk</span>
              <ChevronRight className="w-6 h-6 opacity-50 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderResultsView = () => {
    if (!result) return null;
    
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-12 space-y-6 sm:space-y-8">
        <button 
          onClick={handleBack}
          className={`flex items-center space-x-2 font-bold transition-colors group ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'}`}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">New Analysis</span>
        </button>

        <div className={`rounded-3xl shadow-2xl border-t-[8px] sm:border-t-[12px] overflow-hidden ${
          result.isFraud ? (isDarkMode ? 'bg-red-950/20 border-red-500' : 'bg-red-50 border-red-500') : (isDarkMode ? 'bg-green-950/20 border-green-500' : 'bg-green-50 border-green-500')
        }`}>
          <div className="px-6 py-8 sm:px-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-8 w-full md:w-auto">
              <div className={`p-4 sm:p-6 rounded-full shadow-lg flex-shrink-0 ${
                result.isFraud ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {result.isFraud ? <ShieldAlert className="w-10 h-10 sm:w-16 sm:h-16" /> : <ShieldCheck className="w-10 h-10 sm:w-16 sm:h-16" />}
              </div>
              <div className="min-w-0">
                <h2 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase break-words leading-tight ${
                  result.isFraud ? (isDarkMode ? 'text-red-400' : 'text-red-900') : (isDarkMode ? 'text-green-400' : 'text-green-900')
                }`}>
                  {result.isFraud ? 'FRAUD DETECTED' : 'SECURE TRANSACTION'}
                </h2>
                <p className={`text-sm sm:text-base md:text-xl font-medium mt-2 max-w-md ${
                  result.isFraud ? (isDarkMode ? 'text-red-400/70' : 'text-red-700') : (isDarkMode ? 'text-green-400/70' : 'text-green-700')
                }`}>
                  Model suggests a <span className="font-black uppercase">{result.riskLevel}</span> Risk level for this activity.
                </p>
              </div>
            </div>
            <div className={`w-full md:w-auto text-center md:text-right md:border-l-2 md:pl-8 py-4 border-t mt-4 md:mt-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-200/50'}`}>
              <div className="text-slate-400 text-[10px] sm:text-sm font-black uppercase tracking-widest mb-1">Confidence Score</div>
              <div className={`text-4xl sm:text-5xl md:text-6xl font-black leading-none ${result.isFraud ? 'text-red-600' : 'text-green-600'}`}>
                {(result.probability * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 sm:p-10 shadow-xl border w-full transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-xl sm:text-2xl font-black mb-6 sm:mb-8 flex items-center space-x-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <BarChart3 className="w-5 h-5 sm:w-6 h-6 text-blue-500" />
            <span>Detection Metrics</span>
          </h3>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} horizontal={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tick={{ fill: isDarkMode ? '#64748b' : '#94a3b8', fontWeight: 600, fontSize: 11 }} 
                  tickFormatter={(val) => `${val}%`}
                  axisLine={{ stroke: isDarkMode ? '#1e293b' : '#f1f5f9' }}
                  tickLine={false}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }} 
                  contentStyle={{ 
                    borderRadius: '1rem', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                    color: isDarkMode ? '#f8fafc' : '#1e293b'
                  }} 
                />
                <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#22c55e'} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    formatter={(val: number) => `${val.toFixed(0)}%`} 
                    style={{ fill: isDarkMode ? '#f8fafc' : '#1e293b', fontWeight: 800, fontSize: '13px' }} 
                    offset={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className={`rounded-3xl p-6 sm:p-10 shadow-xl border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <h3 className={`text-xl sm:text-2xl font-black mb-6 sm:mb-8 flex items-center space-x-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                <span>Risk Reasoning</span>
              </h3>
              <div className="space-y-4">
                {result.reasoning.map((reason, i) => (
                  <div key={i} className={`flex items-start space-x-4 sm:space-x-5 p-5 sm:p-6 rounded-2xl border group transition-all duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-black/20' : 'bg-slate-100/80 border-slate-200/60 hover:border-blue-300 hover:bg-slate-100 hover:shadow-md'}`}>
                    <div className={`mt-1 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border shadow-sm flex items-center justify-center text-xs sm:text-sm font-black transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-slate-900 border-slate-600 text-blue-400' : 'bg-white border-slate-300 text-blue-600'}`}>
                      {i + 1}
                    </div>
                    <p className={`leading-relaxed font-semibold text-sm sm:text-base transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
              <h3 className="text-base sm:text-lg font-bold mb-6 flex items-center space-x-2">
                <Activity className="w-4 h-4 sm:w-5 h-5 text-blue-400" />
                <span>Key Signal Values</span>
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className={`flex items-center justify-start gap-x-6 p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <div className="flex items-center space-x-3 min-w-[100px] sm:min-w-[120px]">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <span className="text-xs sm:text-sm font-bold text-slate-300">Tx Hour</span>
                  </div>
                  <span className="text-base sm:text-xl font-black text-blue-400">{result.features.hour}:00</span>
                </div>
                <div className={`flex items-center justify-start gap-x-6 p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <div className="flex items-center space-x-3 min-w-[100px] sm:min-w-[120px]">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <span className="text-xs sm:text-sm font-bold text-slate-300">User Age</span>
                  </div>
                  <span className="text-base sm:text-xl font-black text-blue-400">{result.features.age}y</span>
                </div>
                <div className={`flex items-center justify-start gap-x-6 p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <div className="flex items-center space-x-3 min-w-[100px] sm:min-w-[120px]">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <span className="text-xs sm:text-sm font-bold text-slate-300">Distance</span>
                  </div>
                  <span className="text-base sm:text-xl font-black text-blue-400">{result.features.distance_km.toFixed(1)} km</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBack}
              className={`w-full font-black py-4 sm:py-5 rounded-3xl transition-all active:scale-[0.98] flex items-center justify-center space-x-3 text-sm sm:text-base border ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'}`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
      {loading ? renderLoadingView() : (view === 'input' ? renderInputView() : renderResultsView())}
    </Layout>
  );
};

export default App;
