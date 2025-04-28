
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Militar } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";

type DadosPessoaisProps = {
  militar: Militar;
};

export const DadosPessoais = ({ militar }: DadosPessoaisProps) => {
  return (
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center space-y-3">
          <Avatar className="h-32 w-32">
            <AvatarImage src={militar.foto || ""} />
            <AvatarFallback className="text-3xl">{militar.nomeGuerra.charAt(0)}</AvatarFallback>
          </Avatar>
          <Badge className={militar.situacao === "ativo" ? "bg-green-600" : "bg-orange-500"}>
            {militar.situacao === "ativo" ? "Militar Ativo" : "Militar Inativo"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 flex-grow">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Nome Completo</h3>
            <p className="font-semibold">{militar.nomeCompleto}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Nome de Guerra</h3>
            <p className="font-semibold">{militar.nomeGuerra}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Posto/Graduação</h3>
            <p className="font-semibold">{militar.posto}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Quadro</h3>
            <p className="font-semibold">{militar.quadro}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Data de Nascimento</h3>
            <p className="font-semibold">{format(new Date(militar.dataNascimento), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Data de Inclusão</h3>
            <p className="font-semibold">{format(new Date(militar.dataInclusao), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Data da Última Promoção</h3>
            <p className="font-semibold">{format(new Date(militar.dataUltimaPromocao), "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="font-semibold">{militar.email}</p>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
