import { supabase } from '../config/supabaseInstance';
import { Meme } from '../types';

export const STORAGE_BUCKET = 'meme-vault';

export const uploadMeme = async (
  file: File,
  type: 'meme' | 'template',
  title: string,
  tags: string[],
  isPublic: boolean
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

    // Get user's full name from user metadata
    const username = user.user_metadata?.full_name || 'Anonymous';

    // Insert into memes table
    const { error: insertError } = await supabase
      .from('memes')
      .insert({
        title: title.trim(),
        url: publicUrl,
        type,
        tags: tags.map(tag => tag.trim().toLowerCase()),
        user_id: user.id,
        username: username,
        public: isPublic
      });

    if (insertError) throw insertError;

  } catch (error) {
    console.error('Error in uploadMeme:', error);
    throw error;
  }
};

export const getMemes = async (type?: 'meme' | 'template', publicOnly: boolean = true) => {
  try {
    let query = supabase
      .from('memes')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (publicOnly) {
      query = query.eq('public', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error in getMemes:', error);
    throw error;
  }
};

export async function likeMeme(memeId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .insert({ user_id: userId, meme_id: memeId })

  if (error) throw error
}

export async function unlikeMeme(memeId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .match({ user_id: userId, meme_id: memeId })

  if (error) throw error
}

export async function deleteMeme(memeId: string, userId: string): Promise<void> {
  // First, delete all likes associated with this meme
  const { error: likesError } = await supabase
    .from('likes')
    .delete()
    .eq('meme_id', memeId);

  if (likesError) {
    console.error('Error deleting associated likes:', likesError);
    throw likesError;
  }

  // Then, delete the meme itself
  const { error: memeError } = await supabase
    .from('memes')
    .delete()
    .match({ id: memeId, user_id: userId });

  if (memeError) {
    console.error('Error deleting meme:', memeError);
    throw memeError;
  }
}

export async function getUserLikedMemes(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('likes')
    .select('meme_id')
    .eq('user_id', userId)

  if (error) throw error

  return data.map(like => like.meme_id)
}

export const getEditedMemes = async (userId: string): Promise<Meme[]> => {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_edited', true);
  if (error) {
    console.error('Error fetching edited memes:', error);
    throw error;
  }
  return data || [];
};

