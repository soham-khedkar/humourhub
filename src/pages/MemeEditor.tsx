import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';
import { getMemes, uploadMeme } from '../lib/supabase';
import { Meme } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Toggle } from '../components/ui/Toggle';
import { Slider } from '../components/ui/slider';
import { Download, Share2, Plus, Trash } from 'lucide-react';
import { ColorPicker } from '../components/ui/color-picker';
import { FontSelect } from '../components/ui/font-select';
import { DraggableText } from '../components/ui/draggable-text';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import GridPattern from '../components/ui/grid-pattern';

export function MemeEditor() {
  const session = useSession();
  const navigate = useNavigate();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [texts, setTexts] = useState<Array<{ id: string; content: string; x: number; y: number; size: number; color: string; font: string }>>([]);
  const [isPublic, setIsPublic] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [savedMemeUrl, setSavedMemeUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const fetchedMemes = await getMemes();
      setMemes(fetchedMemes);
    } catch (error) {
      console.error('Error fetching memes:', error);
      toast.error('Failed to fetch memes');
    }
  };

  const handleMemeSelect = (meme: Meme) => {
    setSelectedMeme(meme);
    setTexts([]);
    setSavedMemeUrl(null);
  };

  const addText = () => {
    const newText = {
      id: Date.now().toString(),
      content: 'New Text',
      x: 50,
      y: 50,
      size: 20,
      color: '#ffffff',
      font: 'Arial'
    };
    setTexts([...texts, newText]);
    setEditingTextId(newText.id);
  };

  const updateText = (id: string, updates: Partial<typeof texts[0]>) => {
    setTexts(texts.map(text => text.id === id ? { ...text, ...updates } : text));
  };

  const handleTextDragEnd = (id: string, x: number, y: number) => {
    updateText(id, { x, y });
  };

  const deleteText = (id: string) => {
    setTexts(texts.filter(text => text.id !== id));
    if (editingTextId === id) {
      setEditingTextId(null);
    }
  };

  const renderCanvas = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!selectedMeme || !canvasRef.current) {
        reject(new Error('Canvas or meme not found'));
        return;
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        texts.forEach(text => {
          ctx.font = `${text.size}px ${text.font}`;
          ctx.fillStyle = text.color;
          ctx.fillText(text.content, text.x, text.y);
        });
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = selectedMeme.url;
    });
  };

  const handleSaveMeme = async () => {
    if (!selectedMeme || !session?.user?.id) {
      toast.error('Please select a meme and ensure you are logged in');
      return;
    }

    setIsSaving(true);
    try {
      const dataUrl = await renderCanvas();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const fileName = `edited_${selectedMeme.title}_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      await uploadMeme(file, 'meme', `Edited: ${selectedMeme.title}`, selectedMeme.tags || [], isPublic);

      toast.success('Meme saved successfully!');
      if (isPublic) {
        navigate('/gallery');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error saving meme:', error);
      toast.error('Failed to save meme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!savedMemeUrl) return;
    
    const response = await fetch(savedMemeUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edited_${selectedMeme?.title || 'meme'}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (selectedMeme && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        texts.forEach(text => {
          ctx.font = `${text.size}px ${text.font}`;
          ctx.fillStyle = text.color;
          ctx.fillText(text.content, text.x, text.y);
        });
      };
      img.src = selectedMeme.url;
    }
  }, [selectedMeme, texts]);

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 relative overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        className="absolute inset-0 z-0 opacity-50"
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold mb-8">Meme Editor</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Select a Meme</h2>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {memes.map((meme) => (
                <motion.div
                  key={meme.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleMemeSelect(meme)}
                  className={`cursor-pointer rounded-lg overflow-hidden ${selectedMeme?.id === meme.id ? 'border-2 border-purple-500' : ''}`}
                >
                  <img src={meme.url} alt={meme.title} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            {selectedMeme && (
              <>
                <h2 className="text-2xl font-bold mb-4">Edit Meme</h2>
                <div className="mb-4">
                  <Button onClick={addText} className="mb-2">
                    <Plus size={20} className="mr-2" /> Add Text
                  </Button>
                  {texts.map((text) => (
                    <div key={text.id} className="mb-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={text.content}
                          onChange={(e) => updateText(text.id, { content: e.target.value })}
                          className="flex-1"
                        />
                        <ColorPicker
                          color={text.color}
                          onChange={(color) => updateText(text.id, { color })}
                        />
                        <Button onClick={() => deleteText(text.id)} variant="destructive">
                          <Trash size={20} />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <FontSelect
                          font={text.font}
                          onChange={(font) => updateText(text.id, { font })}
                        />
                        <div className="flex-1">
                          <Slider
                            value={[text.size]}
                            min={10}
                            max={100}
                            step={1}
                            onValueChange={(value) => updateText(text.id, { size: value[0] })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <Toggle
                    options={[{ value: 'public', label: 'Public' }, { value: 'private', label: 'Private' }]}
                    value={isPublic ? 'public' : 'private'}
                    onChange={(value) => setIsPublic(value === 'public')}
                  />
                </div>
                <div className="relative mb-4">
                  <canvas ref={canvasRef} className="max-w-full" />
                  <div className="absolute inset-0">
                    {texts.map((text) => (
                      <DraggableText
                        key={text.id}
                        text={text}
                        onDragEnd={handleTextDragEnd}
                        onClick={() => setEditingTextId(text.id)}
                        isSelected={editingTextId === text.id}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Meme'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Save Meme</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to save this meme? It will be {isPublic ? 'publicly visible' : 'private'}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSaveMeme} disabled={isSaving}>
                          {isSaving ? 'Saving...' : 'Save'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {savedMemeUrl && (
                    <>
                      <Button onClick={handleDownload}>
                        <Download size={20} className="mr-2" /> Download
                      </Button>
                      <Button>
                        <Share2 size={20} className="mr-2" /> Share
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemeEditor;

