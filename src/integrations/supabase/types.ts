export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      condecoracoes: {
        Row: {
          anexo: string | null
          created_at: string | null
          datarecebimento: string | null
          descricao: string | null
          id: string
          militar_id: string | null
          pontos: number | null
          tipo: string
        }
        Insert: {
          anexo?: string | null
          created_at?: string | null
          datarecebimento?: string | null
          descricao?: string | null
          id?: string
          militar_id?: string | null
          pontos?: number | null
          tipo: string
        }
        Update: {
          anexo?: string | null
          created_at?: string | null
          datarecebimento?: string | null
          descricao?: string | null
          id?: string
          militar_id?: string | null
          pontos?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "condecoracoes_militar_id_fkey"
            columns: ["militar_id"]
            isOneToOne: false
            referencedRelation: "militares"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos_civis: {
        Row: {
          anexo: string | null
          cargahoraria: number | null
          created_at: string | null
          id: string
          instituicao: string | null
          militar_id: string | null
          nome: string
          pontos: number | null
          tipo: string | null
        }
        Insert: {
          anexo?: string | null
          cargahoraria?: number | null
          created_at?: string | null
          id?: string
          instituicao?: string | null
          militar_id?: string | null
          nome: string
          pontos?: number | null
          tipo?: string | null
        }
        Update: {
          anexo?: string | null
          cargahoraria?: number | null
          created_at?: string | null
          id?: string
          instituicao?: string | null
          militar_id?: string | null
          nome?: string
          pontos?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cursos_civis_militar_id_fkey"
            columns: ["militar_id"]
            isOneToOne: false
            referencedRelation: "militares"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos_militares: {
        Row: {
          anexo: string | null
          cargahoraria: number | null
          created_at: string | null
          id: string
          instituicao: string | null
          militar_id: string | null
          nome: string
          pontos: number | null
          tipo: string | null
        }
        Insert: {
          anexo?: string | null
          cargahoraria?: number | null
          created_at?: string | null
          id?: string
          instituicao?: string | null
          militar_id?: string | null
          nome: string
          pontos?: number | null
          tipo?: string | null
        }
        Update: {
          anexo?: string | null
          cargahoraria?: number | null
          created_at?: string | null
          id?: string
          instituicao?: string | null
          militar_id?: string | null
          nome?: string
          pontos?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cursos_militares_militar_id_fkey"
            columns: ["militar_id"]
            isOneToOne: false
            referencedRelation: "militares"
            referencedColumns: ["id"]
          },
        ]
      }
      elogios: {
        Row: {
          anexo: string | null
          created_at: string | null
          datarecebimento: string | null
          descricao: string | null
          id: string
          militar_id: string | null
          pontos: number | null
          tipo: string
        }
        Insert: {
          anexo?: string | null
          created_at?: string | null
          datarecebimento?: string | null
          descricao?: string | null
          id?: string
          militar_id?: string | null
          pontos?: number | null
          tipo: string
        }
        Update: {
          anexo?: string | null
          created_at?: string | null
          datarecebimento?: string | null
          descricao?: string | null
          id?: string
          militar_id?: string | null
          pontos?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "elogios_militar_id_fkey"
            columns: ["militar_id"]
            isOneToOne: false
            referencedRelation: "militares"
            referencedColumns: ["id"]
          },
        ]
      }
      fichas_conceito: {
        Row: {
          id: string
          militar_id: string | null
          temposervicoquadro: number | null
          totalpontos: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          militar_id?: string | null
          temposervicoquadro?: number | null
          totalpontos?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          militar_id?: string | null
          temposervicoquadro?: number | null
          totalpontos?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fichas_conceito_militar_id_fkey"
            columns: ["militar_id"]
            isOneToOne: true
            referencedRelation: "militares"
            referencedColumns: ["id"]
          },
        ]
      }
      militares: {
        Row: {
          data_ingresso: string | null
          datanascimento: string | null
          dataultimapromocao: string | null
          email: string | null
          foto: string | null
          id: string
          matricula: string | null
          nome: string
          nomeguerra: string | null
          posto: string | null
          quadro: string | null
          sexo: string
          situacao: string | null
          tipo_sanguineo: string
          unidade: string | null
        }
        Insert: {
          data_ingresso?: string | null
          datanascimento?: string | null
          dataultimapromocao?: string | null
          email?: string | null
          foto?: string | null
          id?: string
          matricula?: string | null
          nome: string
          nomeguerra?: string | null
          posto?: string | null
          quadro?: string | null
          sexo: string
          situacao?: string | null
          tipo_sanguineo: string
          unidade?: string | null
        }
        Update: {
          data_ingresso?: string | null
          datanascimento?: string | null
          dataultimapromocao?: string | null
          email?: string | null
          foto?: string | null
          id?: string
          matricula?: string | null
          nome?: string
          nomeguerra?: string | null
          posto?: string | null
          quadro?: string | null
          sexo?: string
          situacao?: string | null
          tipo_sanguineo?: string
          unidade?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promocoes: {
        Row: {
          data_promocao: string | null
          id: string
          militar_id: string | null
          publicada: boolean | null
          tipo_promocao: string | null
        }
        Insert: {
          data_promocao?: string | null
          id?: string
          militar_id?: string | null
          publicada?: boolean | null
          tipo_promocao?: string | null
        }
        Update: {
          data_promocao?: string | null
          id?: string
          militar_id?: string | null
          publicada?: boolean | null
          tipo_promocao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promocoes_militar_id_fkey"
            columns: ["militar_id"]
            isOneToOne: false
            referencedRelation: "militares"
            referencedColumns: ["id"]
          },
        ]
      }
      punicoes: {
        Row: {
          anexo: string | null
          created_at: string | null
          datarecebimento: string | null
          descricao: string | null
          id: string
          militar_id: string | null
          pontos: number | null
          tipo: string
        }
        Insert: {
          anexo?: string | null
          created_at?: string | null
          datarecebimento?: string | null
          descricao?: string | null
          id?: string
          militar_id?: string | null
          pontos?: number | null
          tipo: string
        }
        Update: {
          anexo?: string | null
          created_at?: string | null
          datarecebimento?: string | null
          descricao?: string | null
          id?: string
          militar_id?: string | null
          pontos?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "punicoes_militar_id_fkey"
            columns: ["militar_id"]
            isOneToOne: false
            referencedRelation: "militares"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
