import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Download, ArrowLeft } from 'lucide-react';
import { useRef } from 'react';

export default function QRCodePage() {
  const { certificateNumber } = useParams<{ certificateNumber: string }>();
  const qrRef = useRef<SVGSVGElement>(null);
  
  // Construct the absolute verification URL based on the current window origin
  const verificationUrl = `${window.location.origin}/verify/${certificateNumber}`;

  const downloadQR = () => {
    if (!qrRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40; // Add padding
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${certificateNumber}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gray-900"></div>
          
          <div className="flex justify-center items-center gap-2 mb-8 text-brand font-bold">
             <ShieldCheck className="w-6 h-6" />
             <span>CertPie QR Generator</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 inline-block mb-6 shadow-sm">
            <QRCodeSVG 
              value={verificationUrl}
              size={220}
              level={"H"}
              includeMargin={false}
              ref={qrRef}
            />
          </div>

          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Certificate Number</p>
            <p className="text-gray-900 font-mono font-semibold bg-gray-50 py-2 px-4 rounded-lg inline-block border border-gray-200">
              {certificateNumber}
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={downloadQR}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download QR Code
            </button>
            <Link 
              to={`/verify/${certificateNumber}`}
              className="w-full flex items-center justify-center bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              Test Verification Page
            </Link>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-400 mt-6 max-w-sm mx-auto">
          Scan this QR code with any mobile camera to be directed to the verification page.
        </p>
      </div>
    </div>
  );
}
