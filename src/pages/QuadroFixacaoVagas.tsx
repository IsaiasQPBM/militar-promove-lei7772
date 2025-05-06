
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QFVHeader } from "@/components/qfv/QFVHeader";
import { QFVContent } from "@/components/qfv/QFVContent";
import { QFVResumo } from "@/components/qfv/QFVResumo";
import { QFVExport } from "@/components/qfv/QFVExport";

const QuadroFixacaoVagas = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quadro de Fixação de Vagas (QFV)</h1>
        <QFVExport />
      </div>
      
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Gestão do Quadro de Fixação de Vagas</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <QFVHeader />
            <QFVContent />
            <QFVResumo />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuadroFixacaoVagas;
