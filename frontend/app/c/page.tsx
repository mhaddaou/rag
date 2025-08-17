'use client'

import { useState } from "react";
import uploadFirstFile from "../lib/axios/chat/upload_file";
import { useRouter } from "next/navigation";
import { useSession } from "../contexts/SessionContext";

// Upload Icon Component
const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Loading Spinner Component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const FileUploadButton = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter()
  const { refreshSessions } = useSession();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragOver(true);
    }
  };

  const uploadFile = async () => {
    if(selectedFile && !isUploading){
      try {
        setIsUploading(true);
        const res = await uploadFirstFile(selectedFile);
        if(res?.sessionId) {
          // Refresh sessions in sidebar before navigating
          await refreshSessions();
          router.push(`/c/${res.sessionId}`)
        }
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        setSelectedFile(files[0]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isUploading) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Main Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
            : selectedFile
            ? 'border-green-300 bg-green-50'
            : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Upload Content */}
        <div className="text-center">
          {selectedFile ? (
            // File Selected State
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isUploading 
                  ? 'bg-blue-100 animate-pulse' 
                  : 'bg-green-100'
              }`}>
                {isUploading ? (
                  <LoadingSpinner className="w-8 h-8 text-blue-600" />
                ) : (
                  <DocumentIcon className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div>
                <p className={`text-lg font-semibold mb-1 ${
                  isUploading ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {isUploading ? 'Processing File...' : 'File Selected!'}
                </p>
                <p className={`font-medium ${
                  isUploading ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {selectedFile.name}
                </p>
                <p className={`text-sm mt-1 ${
                  isUploading ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  {isUploading && ' • Uploading and processing...'}
                </p>
              </div>
              <div className="flex gap-3 relative z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                  className={`px-4 py-2 text-sm border border-slate-200 rounded-lg transition-colors cursor-pointer ${
                    isUploading 
                      ? 'text-slate-400 bg-slate-50 cursor-not-allowed' 
                      : 'text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await uploadFile();
                  }}
                  disabled={isUploading}
                  className={`px-6 py-2 text-sm text-white rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-2 ${
                    isUploading
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isUploading && <LoadingSpinner className="w-4 h-4" />}
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
          ) : (
            // Default Upload State - with file input overlay
            <div className="relative">
              {/* Hidden file input - only active when no file is selected */}
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileSelect}
                accept=".pdf"
                aria-label="Upload document file"
                title="Upload document file"
              />
              
              <div className="flex flex-col items-center space-y-4 cursor-pointer">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDragOver 
                    ? 'bg-indigo-200 scale-110' 
                    : 'bg-indigo-100 group-hover:bg-indigo-200 group-hover:scale-105'
                }`}>
                  <UploadIcon className={`w-8 h-8 transition-colors duration-300 ${
                    isDragOver ? 'text-indigo-700' : 'text-indigo-600'
                  }`} />
                </div>
                
                <div className="space-y-2">
                  <p className={`text-lg font-semibold transition-colors duration-300 ${
                    isDragOver ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'
                  }`}>
                    {isDragOver ? 'Drop your file here' : 'Upload Document'}
                  </p>
                  <p className="text-slate-500 text-sm">
                    Drag and drop your file here, or click to browse
                  </p>
                </div>

                {/* Supported formats */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {['PDF'].map((format) => (
                    <span
                      key={format}
                      className="px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-full"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Animated border effect */}
        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
          isDragOver ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400 animate-pulse"></div>
        </div>
      </div>

      {/* Alternative Upload Button */}
      <div className="mt-6 flex justify-center">
        <label className={`inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl transition-all duration-200 shadow-lg cursor-pointer ${
          isUploading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-600/30 transform hover:scale-105'
        }`}>
          {isUploading ? (
            <LoadingSpinner className="w-5 h-5" />
          ) : (
            <UploadIcon className="w-5 h-5" />
          )}
          {isUploading ? 'Processing...' : 'Choose File to Upload'}
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.md"
            aria-label="Choose file to upload"
            title="Choose file to upload"
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
};

export default function Home(){
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to RAG Chat</h1>
        <p className="text-slate-600">Upload a document to start chatting with your content</p>
      </div>
      
      <FileUploadButton />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Upload your documents and start an intelligent conversation
        </p>
      </div>
    </div>
  )
}