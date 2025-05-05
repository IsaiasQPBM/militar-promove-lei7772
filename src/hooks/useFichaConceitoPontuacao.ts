
import { useState, useEffect } from "react";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao, PontuacaoLei5461, PontuacaoItemType } from "@/types";

interface UseFichaConceitoPontuacaoProps {
  cursosMilitares: CursoMilitar[];
  cursosCivis: CursoCivil[];
  condecoracoes: Condecoracao[];
  elogios: Elogio[];
  punicoes: Punicao[];
}

export const useFichaConceitoPontuacao = ({
  cursosMilitares,
  cursosCivis,
  condecoracoes,
  elogios,
  punicoes
}: UseFichaConceitoPontuacaoProps) => {
  const [pontuacao, setPontuacao] = useState<PontuacaoLei5461>({
    tempoServicoQuadro: { quantidade: 0, valor: 1.0, pontosPositivos: 0, pontosNegativos: 0 },
    cursosMilitares: {
      especializacao: { quantidade: 0, valor: 2.5, pontosPositivos: 0, pontosNegativos: 0 },
      csbm: { quantidade: 0, valor: 4.0, pontosPositivos: 0, pontosNegativos: 0 },
      cfsd: { quantidade: 0, valor: 0.5, pontosPositivos: 0, pontosNegativos: 0 },
      chc: { quantidade: 0, valor: 0.75, pontosPositivos: 0, pontosNegativos: 0 },
      chsgt: { quantidade: 0, valor: 1.0, pontosPositivos: 0, pontosNegativos: 0 },
      cas: { quantidade: 0, valor: 1.25, pontosPositivos: 0, pontosNegativos: 0 },
      cho: { quantidade: 0, valor: 1.5, pontosPositivos: 0, pontosNegativos: 0 },
      cfo: { quantidade: 0, valor: 1.75, pontosPositivos: 0, pontosNegativos: 0 },
      cao: { quantidade: 0, valor: 3.0, pontosPositivos: 0, pontosNegativos: 0 },
      csbm2: { quantidade: 0, valor: 2.5, pontosPositivos: 0, pontosNegativos: 0 },
    },
    cursosCivis: {
      superior: { quantidade: 0, valor: 1.5, pontosPositivos: 0, pontosNegativos: 0 },
      especializacao: { quantidade: 0, valor: 2.0, pontosPositivos: 0, pontosNegativos: 0 },
      mestrado: { quantidade: 0, valor: 3.0, pontosPositivos: 0, pontosNegativos: 0 },
      doutorado: { quantidade: 0, valor: 4.0, pontosPositivos: 0, pontosNegativos: 0 },
    },
    condecoracoes: {
      governoFederal: { quantidade: 0, valor: 0.5, pontosPositivos: 0, pontosNegativos: 0 },
      governoEstadual: { quantidade: 0, valor: 0.3, pontosPositivos: 0, pontosNegativos: 0 },
      cbmepi: { quantidade: 0, valor: 0.2, pontosPositivos: 0, pontosNegativos: 0 },
    },
    elogios: {
      individual: { quantidade: 0, valor: 0.15, pontosPositivos: 0, pontosNegativos: 0 },
      coletivo: { quantidade: 0, valor: 0.10, pontosPositivos: 0, pontosNegativos: 0 },
    },
    punicoes: {
      repreensao: { quantidade: 0, valor: 0.5, pontosPositivos: 0, pontosNegativos: 0 },
      detencao: { quantidade: 0, valor: 1.0, pontosPositivos: 0, pontosNegativos: 0 },
      prisao: { quantidade: 0, valor: 2.0, pontosPositivos: 0, pontosNegativos: 0 },
    },
    faltaAproveitamentoCursos: { quantidade: 0, valor: 5.0, pontosPositivos: 0, pontosNegativos: 0 },
    somaTotal: 0
  });

  useEffect(() => {
    // Calcular a pontuação com base nos dados existentes
    const calcularPontuacao = () => {
      const novaPontuacao = { ...pontuacao };
      
      // Processar cursos militares
      const tiposCursosMilitares = cursosMilitares.reduce((acc, curso) => {
        if (curso.tipo === "Especialização") acc.especializacao++;
        else if (curso.tipo === "CSBM") acc.csbm++;
        else if (curso.tipo === "CFSD") acc.cfsd++;
        else if (curso.tipo === "CHC") acc.chc++;
        else if (curso.tipo === "CHSGT") acc.chsgt++;
        else if (curso.tipo === "CAS") acc.cas++;
        else if (curso.tipo === "CHO") acc.cho++;
        else if (curso.tipo === "CFO") acc.cfo++;
        else if (curso.tipo === "CAO") acc.cao++;
        return acc;
      }, {
        especializacao: 0,
        csbm: 0,
        cfsd: 0,
        chc: 0,
        chsgt: 0,
        cas: 0,
        cho: 0,
        cfo: 0,
        cao: 0,
        csbm2: 0
      });
      
      // Atualizar quantidade de cursos militares
      Object.keys(tiposCursosMilitares).forEach(tipo => {
        if (novaPontuacao.cursosMilitares[tipo as keyof typeof novaPontuacao.cursosMilitares]) {
          const item = novaPontuacao.cursosMilitares[tipo as keyof typeof novaPontuacao.cursosMilitares];
          item.quantidade = tiposCursosMilitares[tipo as keyof typeof tiposCursosMilitares];
          item.pontosPositivos = item.quantidade * item.valor;
        }
      });
      
      // Processar cursos civis
      const tiposCursosCivis = cursosCivis.reduce((acc, curso) => {
        if (curso.tipo === "Superior") acc.superior++;
        else if (curso.tipo === "Especialização") acc.especializacao++;
        else if (curso.tipo === "Mestrado") acc.mestrado++;
        else if (curso.tipo === "Doutorado") acc.doutorado++;
        return acc;
      }, { superior: 0, especializacao: 0, mestrado: 0, doutorado: 0 });
      
      // Atualizar quantidade de cursos civis
      Object.keys(tiposCursosCivis).forEach(tipo => {
        if (novaPontuacao.cursosCivis[tipo as keyof typeof novaPontuacao.cursosCivis]) {
          const item = novaPontuacao.cursosCivis[tipo as keyof typeof novaPontuacao.cursosCivis];
          item.quantidade = tiposCursosCivis[tipo as keyof typeof tiposCursosCivis];
          item.pontosPositivos = item.quantidade * item.valor;
        }
      });
      
      // Processar condecorações
      const tiposCondecoracoes = condecoracoes.reduce((acc, cond) => {
        if (cond.tipo === "Concedida pelo Governo Federal" || 
            cond.tipo === "Reconhecido pelo CBMEPI") {
          acc.governoFederal++;
        } 
        else if (cond.tipo === "Concedida pelo Governo Estadual") {
          acc.governoEstadual++;
        }
        else if (cond.tipo === "Concedida Pelo CBMEPI") {
          acc.cbmepi++;
        }
        return acc;
      }, { governoFederal: 0, governoEstadual: 0, cbmepi: 0 });
      
      // Atualizar quantidade de condecorações
      Object.keys(tiposCondecoracoes).forEach(tipo => {
        if (novaPontuacao.condecoracoes[tipo as keyof typeof novaPontuacao.condecoracoes]) {
          const item = novaPontuacao.condecoracoes[tipo as keyof typeof novaPontuacao.condecoracoes];
          item.quantidade = tiposCondecoracoes[tipo as keyof typeof tiposCondecoracoes];
          item.pontosPositivos = item.quantidade * item.valor;
        }
      });
      
      // Processar elogios
      const tiposElogios = elogios.reduce((acc, elogio) => {
        if (elogio.tipo === "Individual") acc.individual++;
        else if (elogio.tipo === "Coletivo") acc.coletivo++;
        return acc;
      }, { individual: 0, coletivo: 0 });
      
      // Atualizar quantidade de elogios
      Object.keys(tiposElogios).forEach(tipo => {
        if (novaPontuacao.elogios[tipo as keyof typeof novaPontuacao.elogios]) {
          const item = novaPontuacao.elogios[tipo as keyof typeof novaPontuacao.elogios];
          item.quantidade = tiposElogios[tipo as keyof typeof tiposElogios];
          item.pontosPositivos = item.quantidade * item.valor;
        }
      });
      
      // Processar punições
      const tiposPunicoes = punicoes.reduce((acc, punicao) => {
        if (punicao.tipo === "Repreensão") acc.repreensao++;
        else if (punicao.tipo === "Detenção") acc.detencao++;
        else if (punicao.tipo === "Prisão") acc.prisao++;
        return acc;
      }, { repreensao: 0, detencao: 0, prisao: 0 });
      
      // Atualizar quantidade de punições
      Object.keys(tiposPunicoes).forEach(tipo => {
        if (novaPontuacao.punicoes[tipo as keyof typeof novaPontuacao.punicoes]) {
          const item = novaPontuacao.punicoes[tipo as keyof typeof novaPontuacao.punicoes];
          item.quantidade = tiposPunicoes[tipo as keyof typeof tiposPunicoes];
          item.pontosNegativos = item.quantidade * item.valor;
        }
      });
      
      // Calcular soma total
      let somaPositivos = 0;
      let somaNegativos = 0;
      
      // Tempo de serviço
      somaPositivos += novaPontuacao.tempoServicoQuadro.pontosPositivos;
      
      // Cursos militares - limitados a 5 pontos
      let somaCursosMilitares = Object.values(novaPontuacao.cursosMilitares)
        .reduce((sum, item) => sum + item.pontosPositivos, 0);
      somaCursosMilitares = Math.min(somaCursosMilitares, 5); // Aplicar limite
      somaPositivos += somaCursosMilitares;
      
      // Cursos civis - limitados a 10 pontos
      let somaCursosCivis = Object.values(novaPontuacao.cursosCivis)
        .reduce((sum, item) => sum + item.pontosPositivos, 0);
      somaCursosCivis = Math.min(somaCursosCivis, 10); // Aplicar limite
      somaPositivos += somaCursosCivis;
      
      // Condecorações - limitadas a 1 ponto
      let somaCondecoracoes = Object.values(novaPontuacao.condecoracoes)
        .reduce((sum, item) => sum + item.pontosPositivos, 0);
      somaCondecoracoes = Math.min(somaCondecoracoes, 1); // Aplicar limite
      somaPositivos += somaCondecoracoes;
      
      // Elogios - limitados a 0.25 pontos
      let somaElogios = Object.values(novaPontuacao.elogios)
        .reduce((sum, item) => sum + item.pontosPositivos, 0);
      somaElogios = Math.min(somaElogios, 0.25); // Aplicar limite
      somaPositivos += somaElogios;
      
      // Punições
      somaNegativos += Object.values(novaPontuacao.punicoes)
        .reduce((sum, item) => sum + (item.pontosNegativos || 0), 0);
      
      // Falta de aproveitamento
      somaNegativos += novaPontuacao.faltaAproveitamentoCursos.pontosNegativos || 0;
      
      // Atualizar soma total
      novaPontuacao.somaTotal = somaPositivos - somaNegativos;
      
      setPontuacao(novaPontuacao);
    };
    
    calcularPontuacao();
  }, [cursosMilitares, cursosCivis, condecoracoes, elogios, punicoes, pontuacao]);

  return { pontuacao, setPontuacao };
};
