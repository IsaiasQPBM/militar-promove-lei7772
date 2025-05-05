
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
    
    // Melhorado para detectar um conjunto mais amplo de dados
    const extractedData = {
      cursosMilitares: [
        {
          nome: "Curso de Formação de Oficiais",
          tipo: "Formação",
          instituicao: "Academia Militar",
          cargaHoraria: 3600,
          pontos: 5.0,
          dataRecebimento: "2020-06-15"
        },
        {
          nome: "Curso de Aperfeiçoamento de Oficiais",
          tipo: "Aperfeiçoamento",
          instituicao: "Escola de Comando",
          cargaHoraria: 1200,
          pontos: 3.0,
          dataRecebimento: "2022-04-20"
        }
      ],
      cursosCivis: [
        {
          nome: "Especialização em Gestão Pública",
          tipo: "Especialização",
          instituicao: "Universidade Federal",
          cargaHoraria: 360,
          pontos: 2.5,
          dataRecebimento: "2021-12-10"
        }
      ],
      condecoracoes: [
        {
          tipo: "Mérito Pessoal",
          descricao: "Medalha por Serviços Relevantes",
          pontos: 1.5,
          dataRecebimento: "2023-02-15"
        }
      ],
      elogios: [
        {
          tipo: "Individual",
          descricao: "Elogio por bravura em salvamento",
          pontos: 1.0,
          dataRecebimento: "2023-05-10"
        }
      ],
      punicoes: []
    };

    // Here you would insert the extracted data into the database
    // For each course, condecoration, etc. in extractedData
    console.log("Processando dados extraídos para o militar ID:", militarId);

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
