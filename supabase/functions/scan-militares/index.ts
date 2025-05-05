
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define a document model/format for military personnel data
const modelDocumentStructure = {
  pessoal: {
    nome: "Nome Completo do Militar",
    nomeGuerra: "Nome de Guerra",
    matricula: "Matrícula",
    posto: "Posto ou Graduação",
    quadro: "Código do Quadro (QOEM, QOE, QORR, QPBM, QPRR)",
    dataNascimento: "AAAA-MM-DD",
    dataIngresso: "AAAA-MM-DD",
    dataUltimaPromocao: "AAAA-MM-DD",
    situacao: "ativo ou inativo",
    tipoSanguineo: "A+, A-, B+, B-, AB+, AB-, O+, O-",
    sexo: "M ou F",
    unidade: "Unidade de Lotação",
    email: "email@exemplo.com",
  },
  formacao: {
    cursosMilitares: [
      {
        nome: "Nome do Curso",
        tipo: "Especialização, CSBM, CFSD, etc",
        instituicao: "Nome da Instituição",
        cargaHoraria: "Carga horária em horas",
        pontos: "Pontuação do curso"
      }
    ],
    cursosCivis: [
      {
        nome: "Nome do Curso",
        tipo: "Superior, Especialização, Mestrado, Doutorado",
        instituicao: "Nome da Instituição",
        cargaHoraria: "Carga horária em horas",
        pontos: "Pontuação do curso"
      }
    ],
    condecoracoes: [
      {
        tipo: "Governo Federal, Governo Estadual, CBMEPI",
        descricao: "Descrição da condecoração",
        dataRecebimento: "AAAA-MM-DD",
        pontos: "Pontuação da condecoração"
      }
    ],
    elogios: [
      {
        tipo: "Individual, Coletivo",
        descricao: "Descrição do elogio",
        dataRecebimento: "AAAA-MM-DD",
        pontos: "Pontuação do elogio"
      }
    ],
    punicoes: [
      {
        tipo: "Repreensão, Detenção, Prisão",
        descricao: "Descrição da punição",
        dataRecebimento: "AAAA-MM-DD",
        pontos: "Pontuação negativa da punição"
      }
    ]
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { fileUrl, militarId } = await req.json();
    
    if (!fileUrl) {
      return new Response(
        JSON.stringify({
          error: "URL do arquivo é obrigatória",
          modelDocument: modelDocumentStructure // Return the model structure for reference
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
    
    // In a real implementation, here we would:
    // 1. Process the PDF or DOCX file
    // 2. Extract military personnel data
    // 3. Classify each person into their respective quadro
    
    // For now, we'll simulate processing and return some mock data
    const processedData = {
      totalMilitares: 5,
      classificados: {
        "QOEM": 1,
        "QOE": 1,
        "QORR": 1,
        "QPBM": 2,
        "QPRR": 0
      },
      militares: [
        {
          nome: "João da Silva",
          posto: "Major",
          quadro: "QOEM",
          situacao: "ativo"
        },
        {
          nome: "Maria Oliveira",
          posto: "Capitão",
          quadro: "QOE",
          situacao: "ativo"
        },
        {
          nome: "Pedro Santos",
          posto: "Tenente-Coronel",
          quadro: "QORR",
          situacao: "inativo"
        },
        {
          nome: "Ana Souza",
          posto: "1º Sargento",
          quadro: "QPBM",
          situacao: "ativo"
        },
        {
          nome: "Carlos Pereira",
          posto: "Cabo",
          quadro: "QPBM",
          situacao: "ativo"
        }
      ]
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Arquivo processado com sucesso", 
        processedData,
        modelDocument: modelDocumentStructure // Include the model structure in the response
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao processar arquivo:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        modelDocument: modelDocumentStructure // Include the model structure even in error responses
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
