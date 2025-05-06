
import React from 'react';
import QuadroFixacaoVagas from './QuadroFixacaoVagas';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FixacaoVagas = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quadro de Fixação de Vagas</h1>
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Gestão de Vagas - Lei 7.772/2022</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <QuadroFixacaoVagas />
        </CardContent>
      </Card>
    </div>
  );
};

export default FixacaoVagas;
