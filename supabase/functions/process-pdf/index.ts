
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { fileUrl, militarId } = await req.json();
    
    if (!fileUrl || !militarId) {
      return new Response(
        JSON.stringify({
          error: "Faltam dados necessários: fileUrl e militarId são obrigatórios",
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Download the file
    const fileData = await fetch(fileUrl).then((res) => res.arrayBuffer());
    console.log("Arquivo baixado, tamanho:", fileData.byteLength);
    
    // Here we would process the PDF file with a PDF parsing library
    // For now, we'll simulate extracting data based on the file content
    // In a real implementation, you would integrate with a PDF parsing library
    
    // Simplified example response
    const extractedData = {
      cursosMilitares: [
        {
          nome: "Curso Extraído do PDF",
          tipo: "Especialização",
          instituicao: "Instituição Militar",
          cargaHoraria: 120,
          pontos: 2.5,
        },
      ],
      cursosCivis: [],
      condecoracoes: [],
      elogios: [],
      punicoes: [],
    };

    // Here you would insert the extracted data into the database
    // For each course, condecoration, etc. in extractedData

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "PDF processado com sucesso", 
        extractedData 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao processar PDF:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
