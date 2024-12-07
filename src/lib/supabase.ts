import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = 'meme-vault';

export const uploadMeme = async (
  file: File,
  type: 'meme' | 'template',
  title: string,
  tags: string[]
): Promise<void> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Insert into memes table
    const { error: insertError } = await supabase
      .from('memes')
      .insert({
        title: title.trim(),
        url: publicUrl,
        type,
        tags: tags.map(tag => tag.trim().toLowerCase()),
        user_id: user.id
      });

    if (insertError) throw insertError;

  } catch (error) {
    console.error('Error in uploadMeme:', error);
    throw error;
  }
};

export const getMemes = async (type?: 'meme' | 'template') => {
  try {
    let query = supabase
      .from('memes')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error in getMemes:', error);
    throw error;
  }
};