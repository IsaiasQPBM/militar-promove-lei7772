
import { useState } from "react";
import { useQFVData } from "@/hooks/useQFVData";
import QFVHeader from "@/components/qfv/QFVHeader";
import QFVContent from "@/components/qfv/QFVContent";
import QFVResumo from "@/components/qfv/QFVResumo";

const QuadroFixacaoVagas = () => {
  const { qfvData, loading } = useQFVData();
  const [activeTab, setActiveTab] = useState<string>("QOEM");

  return (
    <div className="space-y-6">
      <QFVHeader qfvData={qfvData} />
      <QFVContent 
        qfvData={qfvData} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        loading={loading} 
      />
      <QFVResumo qfvData={qfvData} loading={loading} />
    </div>
  );
};

export default QuadroFixacaoVagas;
