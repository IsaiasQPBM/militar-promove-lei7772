
import { supabase } from '@/integrations/supabase/client';

// This function is used to create the storage bucket if it doesn't exist
export const createPhotoBucket = async () => {
  try {
    // Check if 'photos' bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    // If bucket doesn't exist, create it
    if (!buckets.some(bucket => bucket.name === 'photos')) {
      const { error: createError } = await supabase.storage.createBucket('photos', {
        public: true  // Make the bucket public so files can be accessed without authentication
      });
      
      if (createError) {
        console.error('Error creating photos bucket:', createError);
        return false;
      }
      
      console.log('Photos bucket created successfully');
      return true;
    }
    
    console.log('Photos bucket already exists');
    return true;
  } catch (error) {
    console.error('Unexpected error creating bucket:', error);
    return false;
  }
};

// Call this function when the app initializes to ensure the bucket exists
createPhotoBucket();
