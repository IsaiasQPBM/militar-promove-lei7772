import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { PostoPatente, QuadroMilitar, SituacaoMilitar, TipoSanguineo, Sexo } from "@/types";
import { createMilitar } from "@/services/militarService";
import { DatePicker } from "@/components/ui/date-picker";

interface FormData {
  nomeCompleto: string;
  nomeGuerra: string;
  posto: string;
  quadro: string;
  dataNascimento: string;
  dataInclusao: string;
  dataUltimaPromocao: string;
  situacao: SituacaoMilitar;
  email: string;
  tipoSanguineo: TipoSanguineo;
  sexo: Sexo;
}

const ImportarMilitares = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    nomeGuerra: "",
    posto: "Soldado",
    quadro: "QOEM",
    dataNascimento: "",
    dataInclusao: "",
    dataUltimaPromocao: "",
    situacao: "ativo",
    email: "",
    tipoSanguineo: "O+",
    sexo: "M"
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd"); // Formato esperado pelo Supabase
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Extract form data
      const {
        nomeCompleto,
        nomeGuerra,
        posto,
        quadro,
        dataNascimento,
        dataInclusao,
        dataUltimaPromocao,
        situacao,
        email,
        tipoSanguineo,
        sexo
      } = formData;

      // Create the militar object with the required 'unidade' property
      const militar = {
        nome: formData.nomeCompleto,
        nomeCompleto: formData.nomeCompleto,
        nomeGuerra: formData.nomeGuerra,
        posto: formData.posto as PostoPatente,
        quadro: formData.quadro as QuadroMilitar,
        dataNascimento: formatDate(formData.dataNascimento),
        dataInclusao: formatDate(formData.dataInclusao),
        dataUltimaPromocao: formatDate(formData.dataUltimaPromocao),
        situacao: formData.situacao,
        email: formData.email,
        foto: null,
        tipoSanguineo: formData.tipoSanguineo,
        sexo: formData.sexo === "Masculino" ? "M" : "F",
        unidade: "" // Add the required unidade property with empty string as default
      };

      // Create the militar
      await createMilitar(militar);

      toast({
        title: "Sucesso",
        description: "Militar criado com sucesso!",
      });

      // Redirect to the list of militares
      navigate("/militares");
    } catch (error: any) {
      console.error("Erro ao criar militar:", error);
      toast({
        title: "Erro",
        description: `Erro ao criar militar: ${error.message || "Verifique os dados e tente novamente."}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Importar Militar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="nomeCompleto">Nome Completo</Label>
              <Input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="nomeGuerra">Nome de Guerra</Label>
              <Input
                type="text"
                id="nomeGuerra"
                name="nomeGuerra"
                value={formData.nomeGuerra}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="posto">Posto/Graduação</Label>
              <Select
                name="posto"
                value={formData.posto}
                onValueChange={(value) => setFormData(prev => ({ ...prev, posto: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Posto/Graduação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coronel">Coronel</SelectItem>
                  <SelectItem value="Tenente-Coronel">Tenente-Coronel</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Capitão">Capitão</SelectItem>
                  <SelectItem value="1º Tenente">1º Tenente</SelectItem>
                  <SelectItem value="2º Tenente">2º Tenente</SelectItem>
                  <SelectItem value="Subtenente">Subtenente</SelectItem>
                  <SelectItem value="1º Sargento">1º Sargento</SelectItem>
                  <SelectItem value="2º Sargento">2º Sargento</SelectItem>
                  <SelectItem value="3º Sargento">3º Sargento</SelectItem>
                  <SelectItem value="Cabo">Cabo</SelectItem>
                  <SelectItem value="Soldado">Soldado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quadro">Quadro</Label>
              <Select
                name="quadro"
                value={formData.quadro}
                onValueChange={(value) => setFormData(prev => ({ ...prev, quadro: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Quadro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QOEM">QOEM</SelectItem>
                  <SelectItem value="QOE">QOE</SelectItem>
                  <SelectItem value="QOBM-S">QOBM/S</SelectItem>
                  <SelectItem value="QOBM-E">QOBM/E</SelectItem>
                  <SelectItem value="QOBM-C">QOBM/C</SelectItem>
                  <SelectItem value="QPBM">QPBM</SelectItem>
                  <SelectItem value="QORR">QORR</SelectItem>
                  <SelectItem value="QPRR">QPRR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="dataInclusao">Data de Inclusão</Label>
              <Input
                type="date"
                id="dataInclusao"
                name="dataInclusao"
                value={formData.dataInclusao}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="dataUltimaPromocao">Data da Última Promoção</Label>
              <Input
                type="date"
                id="dataUltimaPromocao"
                name="dataUltimaPromocao"
                value={formData.dataUltimaPromocao}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="situacao">Situação</Label>
              <Select
                name="situacao"
                value={formData.situacao}
                onValueChange={(value) => setFormData(prev => ({ ...prev, situacao: value as SituacaoMilitar }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
              <Select
                name="tipoSanguineo"
                value={formData.tipoSanguineo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipoSanguineo: value as TipoSanguineo }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Tipo Sanguíneo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                name="sexo"
                value={formData.sexo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sexo: value as Sexo }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button disabled={isLoading}>
              {isLoading ? "Importando..." : "Importar Militar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportarMilitares;
