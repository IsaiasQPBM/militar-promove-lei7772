
import { useState, useEffect } from "react";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao, PontuacaoLei5461 } from "@/types";
import { obterCriteriosLei5461 } from "@/services/promocaoService";

interface UseFichaConceitoPontuacaoProps {
  cursosMilitares: CursoMilitar[];
  cursosCivis: CursoCivil[];
  condecoracoes: Condecoracao[];
  elogios: Elogio[];
  punicoes: Punicao[];
}

const useFichaConceitoPontuacao = ({ 
  cursosMilitares, 
  cursosCivis, 
  condecoracoes, 
  elogios, 
  punicoes 
}: UseFichaConceitoPontuacaoProps) => {
  const [pontuacao, setPontuacao] = useState<PontuacaoLei5461 | null>(null);
  
  // Efeito para calcular pontuação sempre que os dados mudarem
  useEffect(() => {
    // Obter critérios da Lei 5461
    const criterios = obterCriteriosLei5461();
    
    // Inicializar estrutura de pontuação
    const novaPontuacao: PontuacaoLei5461 = {
      tempoServicoQuadro: {
        quantidade: 0,
        valor: criterios.tempoDeServico.pontuacao,
        pontosPositivos: 0,
        pontosNegativos: 0
      },
      cursosMilitares: {
        especializacao: { quantidade: 0, valor: criterios.cursosMilitares.especializacao.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        csbm: { quantidade: 0, valor: criterios.cursosMilitares.csbm.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        cfsd: { quantidade: 0, valor: criterios.cursosMilitares.cfsd.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        chc: { quantidade: 0, valor: criterios.cursosMilitares.chc.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        chsgt: { quantidade: 0, valor: criterios.cursosMilitares.chsgt.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        cas: { quantidade: 0, valor: criterios.cursosMilitares.cas.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        cho: { quantidade: 0, valor: criterios.cursosMilitares.cho.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        cfo: { quantidade: 0, valor: criterios.cursosMilitares.cfo.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        cao: { quantidade: 0, valor: criterios.cursosMilitares.cao.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        csbm2: { quantidade: 0, valor: criterios.cursosMilitares.csbm2.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
      },
      cursosCivis: {
        superior: { quantidade: 0, valor: criterios.cursosCivis.superior.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        especializacao: { quantidade: 0, valor: criterios.cursosCivis.especializacao.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        mestrado: { quantidade: 0, valor: criterios.cursosCivis.mestrado.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        doutorado: { quantidade: 0, valor: criterios.cursosCivis.doutorado.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
      },
      condecoracoes: {
        governoFederal: { quantidade: 0, valor: criterios.condecoracoes.governoFederal.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        governoEstadual: { quantidade: 0, valor: criterios.condecoracoes.governoEstadual.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        cbmepi: { quantidade: 0, valor: criterios.condecoracoes.cbmepi.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
      },
      elogios: {
        individual: { quantidade: 0, valor: criterios.elogios.individual.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        coletivo: { quantidade: 0, valor: criterios.elogios.coletivo.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
      },
      punicoes: {
        repreensao: { quantidade: 0, valor: criterios.punicoes.repreensao.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        detencao: { quantidade: 0, valor: criterios.punicoes.detencao.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
        prisao: { quantidade: 0, valor: criterios.punicoes.prisao.pontuacao, pontosPositivos: 0, pontosNegativos: 0 },
      },
      faltaAproveitamentoCursos: {
        quantidade: 0,
        valor: criterios.faltaAproveitamentoCursos.pontuacao,
        pontosPositivos: 0,
        pontosNegativos: 0
      },
      somaTotal: 0
    };
    
    // Processar cursos militares
    if (cursosMilitares && cursosMilitares.length > 0) {
      cursosMilitares.forEach(curso => {
        // Definir tipo padrão se não estiver presente
        const tipo = curso.tipo?.toLowerCase() || "especializacao";
        
        // Converter tipo para a chave correspondente no objeto de pontuação
        let tipoPontuacao = "especializacao";
        
        if (tipo.includes("csbm") && !tipo.includes("csbm2")) tipoPontuacao = "csbm";
        else if (tipo.includes("cfsd")) tipoPontuacao = "cfsd";
        else if (tipo.includes("chc")) tipoPontuacao = "chc";
        else if (tipo.includes("chsgt")) tipoPontuacao = "chsgt";
        else if (tipo.includes("cas")) tipoPontuacao = "cas";
        else if (tipo.includes("cho")) tipoPontuacao = "cho";
        else if (tipo.includes("cfo")) tipoPontuacao = "cfo";
        else if (tipo.includes("cao")) tipoPontuacao = "cao";
        else if (tipo.includes("csbm2")) tipoPontuacao = "csbm2";
        
        // Incrementar quantidade e pontos
        if (novaPontuacao.cursosMilitares[tipoPontuacao]) {
          novaPontuacao.cursosMilitares[tipoPontuacao].quantidade += 1;
          novaPontuacao.cursosMilitares[tipoPontuacao].pontosPositivos += curso.pontos || 0;
        }
      });
    }
    
    // Processar cursos civis
    if (cursosCivis && cursosCivis.length > 0) {
      cursosCivis.forEach(curso => {
        // Definir tipo padrão se não estiver presente
        const tipo = curso.tipo?.toLowerCase() || "superior";
        
        // Converter tipo para a chave correspondente no objeto de pontuação
        let tipoPontuacao = "superior";
        
        if (tipo.includes("espec")) tipoPontuacao = "especializacao";
        else if (tipo.includes("mestr")) tipoPontuacao = "mestrado";
        else if (tipo.includes("doutor")) tipoPontuacao = "doutorado";
        
        // Incrementar quantidade e pontos
        if (novaPontuacao.cursosCivis[tipoPontuacao]) {
          novaPontuacao.cursosCivis[tipoPontuacao].quantidade += 1;
          novaPontuacao.cursosCivis[tipoPontuacao].pontosPositivos += curso.pontos || 0;
        }
      });
    }
    
    // Processar condecorações
    if (condecoracoes && condecoracoes.length > 0) {
      condecoracoes.forEach(condecoracao => {
        // Definir tipo padrão se não estiver presente
        const tipo = condecoracao.tipo?.toLowerCase() || "";
        
        // Converter tipo para a chave correspondente no objeto de pontuação
        let tipoPontuacao = "cbmepi"; // Default
        
        if (tipo.includes("federal") || tipo.includes("união") || tipo.includes("uniao")) {
          tipoPontuacao = "governoFederal";
        } else if (tipo.includes("estadual") || tipo.includes("estado")) {
          tipoPontuacao = "governoEstadual";
        }
        
        // Incrementar quantidade e pontos
        if (novaPontuacao.condecoracoes[tipoPontuacao]) {
          novaPontuacao.condecoracoes[tipoPontuacao].quantidade += 1;
          novaPontuacao.condecoracoes[tipoPontuacao].pontosPositivos += condecoracao.pontos || 0;
        }
      });
    }
    
    // Processar elogios
    if (elogios && elogios.length > 0) {
      elogios.forEach(elogio => {
        // Definir tipo padrão se não estiver presente
        const tipo = elogio.tipo?.toLowerCase() || "";
        
        // Converter tipo para a chave correspondente no objeto de pontuação
        let tipoPontuacao = "individual"; // Default
        
        if (tipo.includes("colet")) {
          tipoPontuacao = "coletivo";
        }
        
        // Incrementar quantidade e pontos
        if (novaPontuacao.elogios[tipoPontuacao]) {
          novaPontuacao.elogios[tipoPontuacao].quantidade += 1;
          novaPontuacao.elogios[tipoPontuacao].pontosPositivos += elogio.pontos || 0;
        }
      });
    }
    
    // Processar punições
    if (punicoes && punicoes.length > 0) {
      punicoes.forEach(punicao => {
        // Definir tipo padrão se não estiver presente
        const tipo = punicao.tipo?.toLowerCase() || "";
        
        // Converter tipo para a chave correspondente no objeto de pontuação
        let tipoPontuacao = "repreensao"; // Default
        
        if (tipo.includes("deten")) {
          tipoPontuacao = "detencao";
        } else if (tipo.includes("pris")) {
          tipoPontuacao = "prisao";
        }
        
        // Incrementar quantidade e pontos negativos
        if (novaPontuacao.punicoes[tipoPontuacao]) {
          novaPontuacao.punicoes[tipoPontuacao].quantidade += 1;
          novaPontuacao.punicoes[tipoPontuacao].pontosNegativos += punicao.pontos || 0;
        }
      });
    }
    
    // Calcular soma total
    let somaTotal = 0;
    
    // Adicionar pontos de cursos militares
    Object.values(novaPontuacao.cursosMilitares).forEach(item => {
      somaTotal += item.pontosPositivos;
    });
    
    // Adicionar pontos de cursos civis
    Object.values(novaPontuacao.cursosCivis).forEach(item => {
      somaTotal += item.pontosPositivos;
    });
    
    // Adicionar pontos de condecorações
    Object.values(novaPontuacao.condecoracoes).forEach(item => {
      somaTotal += item.pontosPositivos;
    });
    
    // Adicionar pontos de elogios
    Object.values(novaPontuacao.elogios).forEach(item => {
      somaTotal += item.pontosPositivos;
    });
    
    // Subtrair pontos de punições
    Object.values(novaPontuacao.punicoes).forEach(item => {
      somaTotal -= item.pontosNegativos;
    });
    
    // Subtrair pontos de falta de aproveitamento em cursos
    somaTotal -= novaPontuacao.faltaAproveitamentoCursos.pontosNegativos;
    
    // Adicionar pontos por tempo de serviço
    somaTotal += novaPontuacao.tempoServicoQuadro.pontosPositivos;
    
    // Atualizar soma total
    novaPontuacao.somaTotal = somaTotal;
    
    // Atualizar estado
    setPontuacao(novaPontuacao);
  }, [cursosMilitares, cursosCivis, condecoracoes, elogios, punicoes]);
  
  return { pontuacao, setPontuacao };
};

export default useFichaConceitoPontuacao;
