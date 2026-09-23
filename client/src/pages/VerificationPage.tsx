import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import type { Certificate } from '../utils/api';
import { ShieldCheck, Download, Share2, AlertCircle, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function VerificationPage() {
  const { certificateNumber } = useParams<{ certificateNumber: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    async function verifyCertificate() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/certificates/${certificateNumber}`);
        if (response.data.success) {
          setCertificate(response.data.certificate);
        } else {
          setError('Certificate Not Found');
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Certificate Not Found');
        } else {
          setError('Unable to verify certificate. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    if (certificateNumber) {
      verifyCertificate();
    }
  }, [certificateNumber]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certificate Verification',
          text: `Check out this verified certificate for ${certificate?.recipientName}`,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Verification link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (certificate?.certificatePdfUrl) {
      window.open(certificate.certificatePdfUrl, '_blank');
    } else if (certificate?.certificateImageUrl) {
      window.open(certificate.certificateImageUrl, '_blank');
    } else {
      alert('Certificate file not available for download.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Loader2 className="h-12 w-12 text-brand animate-spin mb-4" />
        <h2 className="text-xl font-medium text-gray-800">Verifying certificate...</h2>
        <p className="text-gray-500 mt-2 text-center max-w-sm">Please wait while we verify the authenticity of this document in our secure database.</p>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-100">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificate Not Found</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The certificate number <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">{certificateNumber}</span> could not be verified. It may be invalid or does not exist.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Certificate Preview Card */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          {certificate.certificateImageUrl ? (
            <img 
              src={certificate.certificateImageUrl} 
              alt={certificate.certificateTitle}
              className="w-full h-auto object-contain rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-50"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
              <p className="text-gray-400 font-medium">Certificate Preview Not Available</p>
            </div>
          )}
        </div>

        {/* Verification Information Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8 relative">
          {/* Top colored accent bar */}
          <div className="h-2 bg-gradient-to-r from-brand-dark to-brand w-full"></div>
          
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Issued By</p>
                <div className="flex items-center gap-3">
                  {certificate.organizationLogo && (
                    <img src={certificate.organizationLogo} alt={certificate.organizationName} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{certificate.organizationName}</h3>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-3 flex items-center gap-3 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <p className="text-green-800 font-bold text-sm uppercase tracking-wide leading-none mb-1">Verified</p>
                  <p className="text-green-600 text-xs font-medium leading-none">Authentic Record</p>
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <p className="text-gray-500 mb-2">This certifies that</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{certificate.recipientName}</h2>
              {certificate.recipientId && (
                <p className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                  ID: {certificate.recipientId}
                </p>
              )}
            </div>

            <div className="text-center mb-8">
              <h4 className="text-lg font-bold text-brand-dark mb-2">{certificate.certificateTitle}</h4>
              {certificate.description && (
                <p className="text-gray-600 text-sm max-w-lg mx-auto">{certificate.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Certificate Number</p>
                <p className="text-gray-900 font-semibold font-mono text-sm break-all">{certificate.certificateNumber}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Issue</p>
                <p className="text-gray-900 font-semibold text-sm">
                  {new Date(certificate.dateOfIssue).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Verified On</p>
                <p className="text-gray-900 font-semibold text-sm">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-brand text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-brand/25 hover:bg-brand-dark hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-4 px-6 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share Link
          </button>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand text-white rounded-xl flex items-center justify-center shadow-inner font-bold text-xl sm:text-2xl font-serif italic">
            C
          </div>
          <span className="font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">CertPie</span>
        </div>
        <div className="flex items-center gap-2 text-brand font-bold text-xs sm:text-sm tracking-widest uppercase bg-brand/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-brand/10">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Verification</span>
        </div>
      </div>
    </header>
  );
}
