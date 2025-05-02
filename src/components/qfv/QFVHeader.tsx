
import { QFVDataByQuadro } from "@/types/qfv";
import QFVExport from "./QFVExport";

interface QFVHeaderProps {
  qfvData: QFVDataByQuadro;
}

const QFVHeader = ({ qfvData }: QFVHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Quadro de Fixação de Vagas (QFV)</h1>
      <QFVExport qfvData={qfvData} />
    </div>
  );
};

export default QFVHeader;
