
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface PhotoUploadProps {
  photoPreview: string | null;
  onChange: (file: File | null) => void;
  initialName?: string;
}

const PhotoUpload = ({ photoPreview, onChange, initialName = "BM" }: PhotoUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    onChange(file);
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <Avatar className="w-24 h-24">
          {photoPreview ? (
            <AvatarImage src={photoPreview} alt="Foto do militar" />
          ) : (
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {initialName?.substring(0, 2) || "BM"}
            </AvatarFallback>
          )}
          <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
            <Camera className="h-4 w-4" />
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        </Avatar>
      </div>
      <p className="text-xs text-gray-500 mt-2">Clique no ícone para {photoPreview ? "alterar" : "adicionar"} foto</p>
    </div>
  );
};

export default PhotoUpload;
