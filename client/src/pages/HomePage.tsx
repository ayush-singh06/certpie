import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [certId, setCertId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      navigate(`/verify/${certId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand text-white rounded-xl flex items-center justify-center shadow-inner font-bold text-xl sm:text-2xl font-serif italic">
            C
          </div>
          <span className="font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">CertPie</span>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-brand"></div>
          
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Verify Certificate</h1>
          <p className="text-gray-500 mb-8">Enter the unique certificate number to check its authenticity and details.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. CERT-XPIM-TY3C"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              Verify Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-400">
            Alternatively, you can scan the QR code found on the certificate using your phone's camera.
          </div>
        </div>
      </main>
    </div>
  );
}
