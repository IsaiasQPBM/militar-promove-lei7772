
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import QFVHeader from "@/components/qfv/QFVHeader";
import QFVContent from "@/components/qfv/QFVContent";
import QFVResumo from "@/components/qfv/QFVResumo";
import QFVExport from "@/components/qfv/QFVExport";
import { useQFVData } from "@/hooks/useQFVData";

const QuadroFixacaoVagas = () => {
  const { qfvData, loading } = useQFVData();
  const [activeTab, setActiveTab] = useState("QOEM");

  return (
    <div className="space-y-6">
      <QFVHeader qfvData={qfvData} />
      
      <Card>
        <CardHeader className="bg-cbmepi-purple text-white">
          <CardTitle>Gestão do Quadro de Fixação de Vagas</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <QFVContent 
              qfvData={qfvData} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              loading={loading} 
            />
            <QFVResumo qfvData={qfvData} loading={loading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuadroFixacaoVagas;
