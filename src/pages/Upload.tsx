import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Image, FileImage } from 'lucide-react';
import { uploadMeme } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { RainbowButton } from '../components/ui/RainbowButton';
import { Toggle } from '../components/ui/Toggle';
type UploadType = 'meme' | 'template';

export const Upload = () => {
  const [uploadType, setUploadType] = useState<UploadType>('meme');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  // Remove the loading state since we don't need an initial loading screen for this component
  
  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
    setTitle(file.name.split('.')[0]);
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast.error('Please provide a title and select a file');
      return;
    }

    setUploading(true);
    try {
      await uploadMeme(selectedFile, uploadType, title, tags);
      toast.success(`${uploadType === 'meme' ? 'Meme' : 'Template'} uploaded successfully!`);
      navigate('/gallery');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    await handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    setTitle('');
    setTags([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleOptions = [
    { value: 'meme', label: 'Upload Meme' },
    { value: 'template', label: 'Upload Template' },
  ];

  // Remove the loading check since we don't need it
  return (
    <div className="min-h-screen pt-20 bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-lg rounded-lg shadow-lg p-8 border border-purple-500/20"
        >
          <div className="mb-8">
            <Toggle
              options={toggleOptions}
              value={uploadType}
              onChange={(value) => setUploadType(value as UploadType)}
            />
          </div>
          
          {!preview ? (
            <motion.div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-4 border-dashed rounded-lg p-12 text-center ${
                dragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-400'
              }`}
              animate={{ scale: dragging ? 1.02 : 1 }}
            >
              {uploadType === 'meme' ? (
                <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              ) : (
                <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              )}
              <p className="text-xl mb-2 text-white">
                Drag and dump your {uploadType} here
              </p>
              <p className="text-gray-400">or</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
                disabled={uploading}
              />
              <RainbowButton 
                className="mt-4" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Select File'}
              </RainbowButton>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="relative">
                <button
                  onClick={clearPreview}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-black/40 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500"
                    placeholder={`Enter ${uploadType} title`}
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Tags</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-purple-500/20 text-white flex items-center gap-2"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500"
                      placeholder="Add tags"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 rounded-lg bg-purple-500/20 text-white hover:bg-purple-500/40 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <RainbowButton
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : `Upload ${uploadType}`}
                </RainbowButton>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};