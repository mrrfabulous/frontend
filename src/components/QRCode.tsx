import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 128 }: QRCodeProps) {
  // This is a placeholder component that would typically use a QR code library
  // For now, we'll just show a styled box to represent where the QR code would be
  return (
    <div 
      className="bg-gray-100 rounded-lg flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="text-xs text-gray-400 text-center">
        QR Code
        <br />
        {value.slice(0, 8)}
      </div>
    </div>
  );
}