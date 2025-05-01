
import { z } from "zod";
import { isValidDateString } from "./dateValidation";
import { TipoSanguineo } from "@/types";

export const formSchema = z.object({
  quadro: z.string().min(1, { message: "Selecione o quadro de pertencimento" }),
  posto: z.string().min(1, { message: "Selecione o posto/graduação" }),
  nomeCompleto: z.string().min(3, { message: "Nome completo deve ter no mínimo 3 caracteres" }),
  nomeGuerra: z.string().min(2, { message: "Nome de guerra deve ter no mínimo 2 caracteres" }),
  dataNascimento: z.string().refine(isValidDateString, {
    message: "Data inválida. Use o formato DD/MM/AAAA",
  }),
  dataInclusao: z.string().refine(isValidDateString, {
    message: "Data inválida. Use o formato DD/MM/AAAA",
  }),
  dataUltimaPromocao: z.string().refine(isValidDateString, {
    message: "Data inválida. Use o formato DD/MM/AAAA",
  }),
  situacao: z.enum(["ativo", "inativo"]),
  email: z.string().email({ message: "Email inválido" }),
  tipoSanguineo: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const, {
    message: "Selecione um tipo sanguíneo válido"
  }),
  sexo: z.enum(["Masculino", "Feminino"], {
    message: "Selecione o sexo"
  })
});

export type FormValues = z.infer<typeof formSchema>;
