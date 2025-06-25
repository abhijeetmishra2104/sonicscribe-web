'use client';

import React, { useEffect, useState } from 'react';
import Loader from '@/components/ui/Loader';
import { HoverEffect } from '@/components/ui/card-hover-effect';

type AudioFile = {
  id: number;
  url: string;
  publicId: string;
  originalName: string;
  uploadedAt: string;
};

export default function UploadedFilesPage() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/get-uploaded-files');
        const data = await res.json();
        setFiles(data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const items = files.map((file) => ({
    title: file.originalName,
    description: `Uploaded at: ${new Date(file.uploadedAt).toLocaleString()}`,
    content: (
      <audio controls src={file.url} className="w-full mt-2" />
    ),
  }));

  return (
    <div className="min-h-screen font-inter bg-black text-white flex flex-col items-center justify-start p-6">
    <h1 className="text-3xl font-bold mb-6">Uploaded Files</h1>

    {loading ? (
      <div className="flex-grow flex items-center justify-center w-full">
        <Loader />
      </div>
    ) : files.length === 0 ? (
      <p className="text-xl">No files uploaded yet.</p>
    ) : (
      <HoverEffect items={items} className="w-full max-w-6xl" />
    )}
  </div>
  );
}
