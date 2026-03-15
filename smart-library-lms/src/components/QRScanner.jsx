import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Basic config for the scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    scannerRef.current = scanner;

    const handleSuccess = (decodedText, decodedResult) => {
      setScanResult(decodedText);
      // Optional: stop scanning after first detection
      // scanner.clear();
      if (onScanSuccess) {
        onScanSuccess(decodedText);
      }
    };

    const handleError = (err) => {
      // Ignore routine errors like "no QR code found" in the current frame
      // console.warn(err);
    };

    scanner.render(handleSuccess, handleError);

    // Cleanup when component unmounts
    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScanSuccess]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div id="qr-reader" className="w-full max-w-sm mb-4"></div>
      {scanResult ? (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg flex items-center shadow-sm w-full max-w-sm">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-mono font-bold truncate">Scanned: {scanResult}</span>
        </div>
      ) : (
        <div className="text-sm text-gray-500 flex items-center bg-white px-4 py-2 rounded-lg shadow-sm w-full max-w-sm border border-gray-100">
          <svg className="w-5 h-5 mr-2 animate-pulse text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Waiting for QR Code...
        </div>
      )}
    </div>
  );
};

export default QRScanner;
