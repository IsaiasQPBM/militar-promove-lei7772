
import { useEffect, useState } from "react";
import { CursoMilitar, CursoCivil, Condecoracao, Elogio, Punicao, PontuacaoLei5461 } from "@/types";

const useFichaConceitoPontuacao = (
  militarId: string,
  cursosMilitares: CursoMilitar[],
  cursosCivis: CursoCivil[],
  condecoracoes: Condecoracao[],
  elogios: Elogio[],
  punicoes: Punicao[]
) => {
  const [pontuacao, setPontuacao] = useState<PontuacaoLei5461 | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calcularPontuacao = () => {
      // Inicializar estrutura de pontuação
      const pontuacao: PontuacaoLei5461 = {
        tempoServicoQuadro: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
        cursosMilitares: {
          especializacao: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          csbm: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          cfsd: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          chc: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          chsgt: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          cas: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          cho: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          cfo: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          cao: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          csbm2: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
        },
        cursosCivis: {
          superior: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          especializacao: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          mestrado: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          doutorado: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 }
        },
        condecoracoes: {
          governoFederal: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          governoEstadual: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          cbmepi: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 }
        },
        elogios: {
          individual: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          coletivo: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 }
        },
        punicoes: {
          repreensao: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          detencao: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
          prisao: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 }
        },
        faltaAproveitamentoCursos: { quantidade: 0, valor: 0, pontosPositivos: 0, pontosNegativos: 0 },
        somaTotal: 0
      };

      // Contabilizar pontos de cursos militares
      cursosMilitares.forEach(curso => {
        switch (curso.tipo.toUpperCase()) {
          case "ESPECIALIZAÇÃO":
            pontuacao.cursosMilitares.especializacao.quantidade++;
            pontuacao.cursosMilitares.especializacao.pontosPositivos += curso.pontos;
            break;
          case "CSBM":
            pontuacao.cursosMilitares.csbm.quantidade++;
            pontuacao.cursosMilitares.csbm.pontosPositivos += curso.pontos;
            break;
          case "CFSD":
            pontuacao.cursosMilitares.cfsd.quantidade++;
            pontuacao.cursosMilitares.cfsd.pontosPositivos += curso.pontos;
            break;
          case "CHC":
            pontuacao.cursosMilitares.chc.quantidade++;
            pontuacao.cursosMilitares.chc.pontosPositivos += curso.pontos;
            break;
          case "CHSGT":
            pontuacao.cursosMilitares.chsgt.quantidade++;
            pontuacao.cursosMilitares.chsgt.pontosPositivos += curso.pontos;
            break;
          case "CAS":
            pontuacao.cursosMilitares.cas.quantidade++;
            pontuacao.cursosMilitares.cas.pontosPositivos += curso.pontos;
            break;
          case "CHO":
            pontuacao.cursosMilitares.cho.quantidade++;
            pontuacao.cursosMilitares.cho.pontosPositivos += curso.pontos;
            break;
          case "CFO":
            pontuacao.cursosMilitares.cfo.quantidade++;
            pontuacao.cursosMilitares.cfo.pontosPositivos += curso.pontos;
            break;
          case "CAO":
            pontuacao.cursosMilitares.cao.quantidade++;
            pontuacao.cursosMilitares.cao.pontosPositivos += curso.pontos;
            break;
          case "CSBM2":
            pontuacao.cursosMilitares.csbm2.quantidade++;
            pontuacao.cursosMilitares.csbm2.pontosPositivos += curso.pontos;
            break;
          default:
            // Se não cair em nenhum caso específico, considerar como curso de especialização
            pontuacao.cursosMilitares.especializacao.quantidade++;
            pontuacao.cursosMilitares.especializacao.pontosPositivos += curso.pontos;
        }
      });

      // Contabilizar pontos de cursos civis
      cursosCivis.forEach(curso => {
        switch (curso.tipo.toUpperCase()) {
          case "SUPERIOR":
            pontuacao.cursosCivis.superior.quantidade++;
            pontuacao.cursosCivis.superior.pontosPositivos += curso.pontos;
            break;
          case "ESPECIALIZAÇÃO":
            pontuacao.cursosCivis.especializacao.quantidade++;
            pontuacao.cursosCivis.especializacao.pontosPositivos += curso.pontos;
            break;
          case "MESTRADO":
            pontuacao.cursosCivis.mestrado.quantidade++;
            pontuacao.cursosCivis.mestrado.pontosPositivos += curso.pontos;
            break;
          case "DOUTORADO":
            pontuacao.cursosCivis.doutorado.quantidade++;
            pontuacao.cursosCivis.doutorado.pontosPositivos += curso.pontos;
            break;
          default:
            // Se não cair em nenhum caso específico, considerar como curso superior
            pontuacao.cursosCivis.superior.quantidade++;
            pontuacao.cursosCivis.superior.pontosPositivos += curso.pontos;
        }
      });

      // Contabilizar pontos de condecorações
      condecoracoes.forEach(condecoracao => {
        const tipoLowerCase = condecoracao.tipo.toLowerCase();
        if (tipoLowerCase.includes("federal")) {
          pontuacao.condecoracoes.governoFederal.quantidade++;
          pontuacao.condecoracoes.governoFederal.pontosPositivos += condecoracao.pontos;
        } else if (tipoLowerCase.includes("estadual")) {
          pontuacao.condecoracoes.governoEstadual.quantidade++;
          pontuacao.condecoracoes.governoEstadual.pontosPositivos += condecoracao.pontos;
        } else {
          pontuacao.condecoracoes.cbmepi.quantidade++;
          pontuacao.condecoracoes.cbmepi.pontosPositivos += condecoracao.pontos;
        }
      });

      // Contabilizar pontos de elogios
      elogios.forEach(elogio => {
        if (elogio.tipo.toLowerCase() === "individual") {
          pontuacao.elogios.individual.quantidade++;
          pontuacao.elogios.individual.pontosPositivos += elogio.pontos;
        } else {
          pontuacao.elogios.coletivo.quantidade++;
          pontuacao.elogios.coletivo.pontosPositivos += elogio.pontos;
        }
      });

      // Contabilizar pontos de punições (pontos negativos)
      punicoes.forEach(punicao => {
        const tipoLowerCase = punicao.tipo.toLowerCase();
        if (tipoLowerCase.includes("repreensão")) {
          pontuacao.punicoes.repreensao.quantidade++;
          pontuacao.punicoes.repreensao.pontosNegativos! += punicao.pontos;
        } else if (tipoLowerCase.includes("detenção")) {
          pontuacao.punicoes.detencao.quantidade++;
          pontuacao.punicoes.detencao.pontosNegativos! += punicao.pontos;
        } else {
          pontuacao.punicoes.prisao.quantidade++;
          pontuacao.punicoes.prisao.pontosNegativos! += punicao.pontos;
        }
      });

      // Calcular soma total de pontos positivos
      let totalPositivo = 0;

      // Somar pontos positivos de cursos militares
      Object.values(pontuacao.cursosMilitares).forEach(item => {
        totalPositivo += item.pontosPositivos;
      });

      // Somar pontos positivos de cursos civis
      Object.values(pontuacao.cursosCivis).forEach(item => {
        totalPositivo += item.pontosPositivos;
      });

      // Somar pontos positivos de condecorações
      Object.values(pontuacao.condecoracoes).forEach(item => {
        totalPositivo += item.pontosPositivos;
      });

      // Somar pontos positivos de elogios
      Object.values(pontuacao.elogios).forEach(item => {
        totalPositivo += item.pontosPositivos;
      });

      // Calcular soma total de pontos negativos
      let totalNegativo = 0;

      // Somar pontos negativos de punições
      Object.values(pontuacao.punicoes).forEach(item => {
        totalNegativo += item.pontosNegativos || 0;
      });

      // Somar pontos negativos de falta de aproveitamento em cursos
      totalNegativo += pontuacao.faltaAproveitamentoCursos.pontosNegativos || 0;

      // Calcular soma final
      pontuacao.somaTotal = totalPositivo - totalNegativo;

      setPontuacao(pontuacao);
      setLoading(false);
    };

    calcularPontuacao();
  }, [militarId, cursosMilitares, cursosCivis, condecoracoes, elogios, punicoes]);

  return { pontuacao, loading };
};

export default useFichaConceitoPontuacao;
