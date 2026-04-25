"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function ComicsPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    
    const formData = new FormData();
    const fileInput = document.getElementById('comic-upload');
    
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setError('Please select a file to upload');
      setUploading(false);
      return;
    }
    
    const file = fileInput.files[0];
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setUploadComplete(true);
      setUploadedUrl(result.fileUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-black/95 text-[#e0e0e0] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[0.06em] text-[#ccfbf1] mb-4">
            Red Noodle Clan Comics
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Upload and view comic strips featuring Manus Neco, Hackermouth, and the Red Noodle Clan universe
          </p>
        </header>
        
        {(!uploadComplete) && (
          <div className="mb-8">
            <form onSubmit={handleUpload} className="bg-black/30 border border-[#064e3b]/40 rounded-xl p-6">
              <h3 className="font-bold text-[#fdba74] mb-4">Upload Your Comic Strip</h3>
              
              <label htmlFor="comic-upload" className="block mb-2 font-semibold text-zinc-300">
                Select Comic Image (JPG, PNG, GIF, WebP - Max 10MB)
              </label>
              <input
                type="file"
                id="comic-upload"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="w-full mb-4 p-3 bg-black/50 border border-[#064e3b]/30 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#fdba74]"
                required
              />
              
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-[#c2410c] to-[#7f1d1d] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <span>Upload Comic</span>
                )}
              </button>
            </form>
          </div>
        )}
        
        {uploadComplete && (
          <div className="bg-black/30 border border-[#064e3b]/40 rounded-xl p-6 text-center">
            <h3 className="font-bold text-[#22c55e] mb-4">Upload Successful!</h3>
            <p className="text-zinc-400 mb-4">Your comic has been uploaded successfully.</p>
            <div className="mt-6">
              <img 
                src={uploadedUrl} 
                alt="Uploaded comic" 
                className="max-w-full h-auto rounded-lg border border-[#064e3b]/40"
              />
            </div>
            <p className="mt-4 text-zinc-400 text-sm">
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-[#fdba74] hover:underline">View full-size image</a>
            </p>
          </div>
        )}
        
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {/* Placeholder for comic uploads */}
          <div className="bg-black/30 border border-[#064e3b]/40 rounded-xl p-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-r from-[#c2410c]/20 to-[#7f1d1d]/20 flex items-center justify-center rounded-lg mb-4">
              <svg className="w-8 h-8 text-[#fdba74]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4"></path>
                <path d="m5 6 2 2"></path>
                <path d="m17 6-2 2"></path>
                <path d="M2 12h4"></path>
                <path d="M18 12h4"></path>
                <path d="M2 16h4"></path>
                <path d="M18 16h4"></path>
                <path d="m5 18 2 2"></path>
                <path d="m17 18-2 2"></path>
                <path d="M12 18v4"></path>
              </svg>
            </div>
            <h3 className="font-bold text-[#fdba74] mb-2">Upload Comic</h3>
            <p className="text-zinc-400 text-center max-w-xs">
              Click to upload your Red Noodle Clan comic strips
            </p>
          </div>
          
          {/* Manus Neco Comic Preview */}
          <Link href="/archive/comics/manus-neco-1" className="group">
            <div className="bg-black/30 border border-[#064e3b]/40 rounded-xl p-6 hover:bg-black/40 transition-colors flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-r from-[#c2410c]/30 to-[#7f1d1d]/30 flex items-center justify-center rounded-lg mb-4">
                <div className="w-4 h-4 bg-[#5eead4]/50 rounded mx-1 my-1"></div>
                <div className="w-4 h-4 bg-[#5eead4]/50 rounded mx-1 my-1"></div>
                <div className="w-4 h-4 bg-[#5eead4]/50 rounded mx-1 my-1"></div>
              </div>
              <h3 className="font-bold text-[#fdba74] mb-2">Manus Neco: Origin</h3>
              <p className="text-zinc-400 text-center max-w-xs">
                First appearance of Manus Neco in the Red Noodle Clan universe
              </p>
            </div>
          </Link>
          
          {/* Hackermouth Comic Preview */}
          <Link href="/archive/comics/hackermouth-watch" className="group">
            <div className="bg-black/30 border border-[#064e3b]/40 rounded-xl p-6 hover:bg-black/40 transition-colors flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-r from-[#064e3b]/30 to-[#5eead4]/30 flex items-center justify-center rounded-lg mb-4">
                <div className="w-2 h-2 bg-[#fdba74]/50 rounded mx-0.5 my-0.5"></div>
                <div className="w-2 h-2 bg-[#fdba74]/50 rounded mx-0.5 my-0.5"></div>
                <div className="w-2 h-2 bg-[#fdba74]/50 rounded mx-0.5 my-0.5"></div>
              </div>
              <h3 className="font-bold text-[#fdba74] mb-2">Hackermouth: Always Watching</h3>
              <p className="text-zinc-400 text-center max-w-xs">
                Hackermouth observes the archive from the digital shadows
              </p>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
