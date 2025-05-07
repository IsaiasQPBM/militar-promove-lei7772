
import { useState, useEffect, useCallback } from "react";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao, PontuacaoLei5461 } from "@/types";

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
  
  // Função para calcular a pontuação com base na Lei 5.461
  const calcularPontuacao = useCallback(() => {
    // Criar estrutura base da pontuação
    const pontuacaoBase: PontuacaoLei5461 = {
      tempoServicoQuadro: {
        quantidade: 0,
        valor: 0.1,
        pontosPositivos: 0,
        pontosNegativos: 0
      },
      cursosMilitares: {
        especializacao: { quantidade: 0, valor: 0.5, pontosPositivos: 0, pontosNegativos: 0 },
        csbm: { quantidade: 0, valor: 4.0, pontosPositivos: 0, pontosNegativos: 0 },
        cfsd: { quantidade: 0, valor: 3.0, pontosPositivos: 0, pontosNegativos: 0 },
        chc: { quantidade: 0, valor: 1.0, pontosPositivos: 0, pontosNegativos: 0 },
        chsgt: { quantidade: 0, valor: 1.5, pontosPositivos: 0, pontosNegativos: 0 },
        cas: { quantidade: 0, valor: 2.0, pontosPositivos: 0, pontosNegativos: 0 },
        cho: { quantidade: 0, valor: 2.5, pontosPositivos: 0, pontosNegativos: 0 },
        cfo: { quantidade: 0, valor: 4.0, pontosPositivos: 0, pontosNegativos: 0 },
        cao: { quantidade: 0, valor: 3.0, pontosPositivos: 0, pontosNegativos: 0 },
        csbm2: { quantidade: 0, valor: 3.0, pontosPositivos: 0, pontosNegativos: 0 }
      },
      cursosCivis: {
        superior: { quantidade: 0, valor: 1.0, pontosPositivos: 0, pontosNegativos: 0 },
        especializacao: { quantidade: 0, valor: 1.0, pontosPositivos: 0, pontosNegativos: 0 },
        mestrado: { quantidade: 0, valor: 2.0, pontosPositivos: 0, pontosNegativos: 0 },
        doutorado: { quantidade: 0, valor: 3.0, pontosPositivos: 0, pontosNegativos: 0 }
      },
      condecoracoes: {
        governoFederal: { quantidade: 0, valor: 1.0, pontosPositivos: 0, pontosNegativos: 0 },
        governoEstadual: { quantidade: 0, valor: 0.5, pontosPositivos: 0, pontosNegativos: 0 },
        cbmepi: { quantidade: 0, valor: 0.2, pontosPositivos: 0, pontosNegativos: 0 }
      },
      elogios: {
        individual: { quantidade: 0, valor: 0.2, pontosPositivos: 0, pontosNegativos: 0 },
        coletivo: { quantidade: 0, valor: 0.1, pontosPositivos: 0, pontosNegativos: 0 }
      },
      punicoes: {
        repreensao: { quantidade: 0, valor: 0.5, pontosPositivos: 0, pontosNegativos: 0 },
        detencao: { quantidade: 0, valor: 1.0, pontosPositivos: 0, pontosNegativos: 0 },
        prisao: { quantidade: 0, valor: 1.5, pontosPositivos: 0, pontosNegativos: 0 }
      },
      faltaAproveitamentoCursos: {
        quantidade: 0,
        valor: 1.0,
        pontosPositivos: 0,
        pontosNegativos: 0
      },
      somaTotal: 0
    };
    
    // Processar cursos militares
    cursosMilitares.forEach(curso => {
      const tipo = curso.tipo.toLowerCase();
      
      // Mapear o tipo do curso para a propriedade correspondente
      let tipoPontuacao: string = 'especializacao';
      
      if (tipo.includes('csbm') && !tipo.includes('csbm2')) {
        tipoPontuacao = 'csbm';
      } else if (tipo.includes('csbm2')) {
        tipoPontuacao = 'csbm2';
      } else if (tipo.includes('cfsd')) {
        tipoPontuacao = 'cfsd';
      } else if (tipo.includes('chc')) {
        tipoPontuacao = 'chc';
      } else if (tipo.includes('chsgt')) {
        tipoPontuacao = 'chsgt';
      } else if (tipo.includes('cas')) {
        tipoPontuacao = 'cas';
      } else if (tipo.includes('cho')) {
        tipoPontuacao = 'cho';
      } else if (tipo.includes('cfo')) {
        tipoPontuacao = 'cfo';
      } else if (tipo.includes('cao')) {
        tipoPontuacao = 'cao';
      }
      
      // Incrementar quantidade e pontos
      if (pontuacaoBase.cursosMilitares[tipoPontuacao]) {
        pontuacaoBase.cursosMilitares[tipoPontuacao].quantidade += 1;
        pontuacaoBase.cursosMilitares[tipoPontuacao].pontosPositivos += curso.pontos;
      } else {
        // Se o tipo não existir, criar novo
        pontuacaoBase.cursosMilitares[tipoPontuacao] = {
          quantidade: 1,
          valor: curso.pontos,
          pontosPositivos: curso.pontos,
          pontosNegativos: 0
        };
      }
    });
    
    // Processar cursos civis
    cursosCivis.forEach(curso => {
      const tipo = curso.tipo.toLowerCase();
      
      // Mapear o tipo do curso para a propriedade correspondente
      let tipoPontuacao: string = 'superior';
      
      if (tipo.includes('especial')) {
        tipoPontuacao = 'especializacao';
      } else if (tipo.includes('mestrado')) {
        tipoPontuacao = 'mestrado';
      } else if (tipo.includes('doutorado')) {
        tipoPontuacao = 'doutorado';
      }
      
      // Incrementar quantidade e pontos
      if (pontuacaoBase.cursosCivis[tipoPontuacao]) {
        pontuacaoBase.cursosCivis[tipoPontuacao].quantidade += 1;
        pontuacaoBase.cursosCivis[tipoPontuacao].pontosPositivos += curso.pontos;
      } else {
        // Se o tipo não existir, criar novo
        pontuacaoBase.cursosCivis[tipoPontuacao] = {
          quantidade: 1,
          valor: curso.pontos,
          pontosPositivos: curso.pontos,
          pontosNegativos: 0
        };
      }
    });
    
    // Processar condecorações
    condecoracoes.forEach(condecoracao => {
      const tipo = condecoracao.tipo.toLowerCase();
      
      let tipoPontuacao: string = 'cbmepi';
      
      if (tipo.includes('federal')) {
        tipoPontuacao = 'governoFederal';
      } else if (tipo.includes('estadual')) {
        tipoPontuacao = 'governoEstadual';
      }
      
      // Incrementar quantidade e pontos
      if (pontuacaoBase.condecoracoes[tipoPontuacao]) {
        pontuacaoBase.condecoracoes[tipoPontuacao].quantidade += 1;
        pontuacaoBase.condecoracoes[tipoPontuacao].pontosPositivos += condecoracao.pontos;
      } else {
        // Se o tipo não existir, criar novo
        pontuacaoBase.condecoracoes[tipoPontuacao] = {
          quantidade: 1,
          valor: condecoracao.pontos,
          pontosPositivos: condecoracao.pontos,
          pontosNegativos: 0
        };
      }
    });
    
    // Processar elogios
    elogios.forEach(elogio => {
      const tipo = elogio.tipo.toLowerCase();
      
      let tipoPontuacao: string = 'individual';
      
      if (tipo.includes('coletivo')) {
        tipoPontuacao = 'coletivo';
      }
      
      // Incrementar quantidade e pontos
      if (pontuacaoBase.elogios[tipoPontuacao]) {
        pontuacaoBase.elogios[tipoPontuacao].quantidade += 1;
        pontuacaoBase.elogios[tipoPontuacao].pontosPositivos += elogio.pontos;
      } else {
        // Se o tipo não existir, criar novo
        pontuacaoBase.elogios[tipoPontuacao] = {
          quantidade: 1,
          valor: elogio.pontos,
          pontosPositivos: elogio.pontos,
          pontosNegativos: 0
        };
      }
    });
    
    // Processar punições
    punicoes.forEach(punicao => {
      const tipo = punicao.tipo.toLowerCase();
      
      let tipoPontuacao: string = 'repreensao';
      
      if (tipo.includes('detencao')) {
        tipoPontuacao = 'detencao';
      } else if (tipo.includes('prisao')) {
        tipoPontuacao = 'prisao';
      }
      
      // Incrementar quantidade e pontos negativos
      if (pontuacaoBase.punicoes[tipoPontuacao]) {
        pontuacaoBase.punicoes[tipoPontuacao].quantidade += 1;
        pontuacaoBase.punicoes[tipoPontuacao].pontosNegativos += punicao.pontos;
      } else {
        // Se o tipo não existir, criar novo
        pontuacaoBase.punicoes[tipoPontuacao] = {
          quantidade: 1,
          valor: punicao.pontos,
          pontosPositivos: 0,
          pontosNegativos: punicao.pontos
        };
      }
    });
    
    // Calcular soma total de pontos
    let somaTotal = 0;
    
    // Pontos positivos
    Object.values(pontuacaoBase.cursosMilitares).forEach(item => {
      somaTotal += item.pontosPositivos;
    });
    
    Object.values(pontuacaoBase.cursosCivis).forEach(item => {
      somaTotal += item.pontosPositivos;
    });
    
    Object.values(pontuacaoBase.condecoracoes).forEach(item => {
      somaTotal += item.pontosPositivos;
    });
    
    Object.values(pontuacaoBase.elogios).forEach(item => {
      somaTotal += item.pontosPositivos;
    });
    
    // Tempo de serviço (assumindo que está em meses)
    somaTotal += pontuacaoBase.tempoServicoQuadro.pontosPositivos;
    
    // Pontos negativos
    Object.values(pontuacaoBase.punicoes).forEach(item => {
      somaTotal -= item.pontosNegativos;
    });
    
    somaTotal -= pontuacaoBase.faltaAproveitamentoCursos.pontosNegativos;
    
    pontuacaoBase.somaTotal = somaTotal;
    
    return pontuacaoBase;
  }, [cursosMilitares, cursosCivis, condecoracoes, elogios, punicoes]);

  useEffect(() => {
    const novaPontuacao = calcularPontuacao();
    setPontuacao(novaPontuacao);
  }, [calcularPontuacao]);

  return { pontuacao, setPontuacao };
};

export default useFichaConceitoPontuacao;
