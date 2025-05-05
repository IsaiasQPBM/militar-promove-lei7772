
-- Create the documentos storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'documentos', 'documentos', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'documentos'
);

-- Create policy to allow all authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documentos');

-- Create policy to allow all authenticated users to select files
CREATE POLICY "Allow authenticated users to read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documentos');

-- Create policy to allow all authenticated users to update files
CREATE POLICY "Allow authenticated users to update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documentos');

-- Create policy to allow all authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documentos');
