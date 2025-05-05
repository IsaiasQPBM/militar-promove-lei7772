
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define a document model/format for importing data to military files
const modelDocumentStructure = {
  pessoal: {
    nome: "Nome Completo do Militar",
    nomeGuerra: "Nome de Guerra",
    matricula: "Matrícula",
    posto: "Posto ou Graduação",
    quadro: "Código do Quadro (QOEM, QOE, QORR, QPBM, QPRR)",
    dataNascimento: "AAAA-MM-DD",
    tipoSanguineo: "A+, A-, B+, B-, AB+, AB-, O+, O-",
    sexo: "M ou F",
  },
  formacao: {
    cursosMilitares: [
      {
        nome: "Nome do Curso",
        tipo: "Especialização, CSBM, CFSD, etc",
        instituicao: "Nome da Instituição",
        cargaHoraria: "Carga horária em horas"
      }
    ],
    cursosCivis: [
      {
        nome: "Nome do Curso",
        tipo: "Superior, Especialização, Mestrado, Doutorado",
        instituicao: "Nome da Instituição",
        cargaHoraria: "Carga horária em horas"
      }
    ],
    condecoracoes: [
      {
        tipo: "Governo Federal, Governo Estadual, CBMEPI",
        descricao: "Descrição da condecoração",
        dataRecebimento: "AAAA-MM-DD"
      }
    ],
    elogios: [
      {
        tipo: "Individual, Coletivo",
        descricao: "Descrição do elogio",
        dataRecebimento: "AAAA-MM-DD"
      }
    ],
    punicoes: [
      {
        tipo: "Repreensão, Detenção, Prisão",
        descricao: "Descrição da punição",
        dataRecebimento: "AAAA-MM-DD"
      }
    ],
    fichaConceitoLei5461: {
      tempoServicoQuadro: "Tempo (em anos) no posto atual",
      cursosMilitares: {
        especializacao: "Quantidade",
        csbm: "Quantidade",
        cfsd: "Quantidade",
        chc: "Quantidade",
        chsgt: "Quantidade",
        cas: "Quantidade",
        cho: "Quantidade",
        cfo: "Quantidade",
        cao: "Quantidade"
      },
      cursosCivis: {
        superior: "Quantidade",
        especializacao: "Quantidade",
        mestrado: "Quantidade",
        doutorado: "Quantidade"
      },
      condecoracoes: {
        governoFederal: "Quantidade",
        governoEstadual: "Quantidade",
        cbmepi: "Quantidade"
      },
      elogios: {
        individual: "Quantidade",
        coletivo: "Quantidade"
      },
      punicoes: {
        repreensao: "Quantidade",
        detencao: "Quantidade",
        prisao: "Quantidade"
      },
      faltaAproveitamentoCursos: "Quantidade"
    }
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
          modelDocument: modelDocumentStructure
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
    
    // In a real implementation, we would process the PDF here
    // For now, we'll simulate extraction with mock data
    
    const extractedData = {
      cursosMilitares: [
        {
          nome: "Curso de Especialização em Combate a Incêndio",
          tipo: "Especialização",
          instituicao: "CBMEPI",
          cargaHoraria: 120,
          pontos: 2
        }
      ],
      cursosCivis: [
        {
          nome: "Administração Pública",
          tipo: "Superior",
          instituicao: "UFPI",
          cargaHoraria: 3600,
          pontos: 1.5
        }
      ],
      condecoracoes: [
        {
          tipo: "CBMEPI",
          descricao: "Medalha por Tempo de Serviço",
          dataRecebimento: "2022-05-15",
          pontos: 0.2
        }
      ],
      elogios: [
        {
          tipo: "Individual",
          descricao: "Desempenho exemplar durante operação de resgate",
          dataRecebimento: "2023-01-10",
          pontos: 0.15
        }
      ],
      fichaConceitoLei5461: {
        tempoServicoQuadro: 3,
        cursosMilitares: {
          especializacao: 2,
          csbm: 1
        },
        pontosTotal: 8.5
      }
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Arquivo processado com sucesso", 
        extractedData,
        modelDocument: modelDocumentStructure
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
        modelDocument: modelDocumentStructure
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
