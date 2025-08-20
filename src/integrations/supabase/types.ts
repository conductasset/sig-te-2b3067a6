export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      estudantes: {
        Row: {
          ativo: boolean
          cpf: string | null
          created_at: string
          data_nascimento: string
          endereco: string
          escola: string
          id: string
          nome_completo: string
          observacoes: string | null
          responsavel_nome: string
          responsavel_telefone: string
          telefone: string | null
          turno: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cpf?: string | null
          created_at?: string
          data_nascimento: string
          endereco: string
          escola: string
          id?: string
          nome_completo: string
          observacoes?: string | null
          responsavel_nome: string
          responsavel_telefone: string
          telefone?: string | null
          turno: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cpf?: string | null
          created_at?: string
          data_nascimento?: string
          endereco?: string
          escola?: string
          id?: string
          nome_completo?: string
          observacoes?: string | null
          responsavel_nome?: string
          responsavel_telefone?: string
          telefone?: string | null
          turno?: string
          updated_at?: string
        }
        Relationships: []
      }
      estudantes_rotas: {
        Row: {
          ativo: boolean
          created_at: string
          estudante_id: string
          horario_embarque: string | null
          id: string
          ponto_embarque: string
          rota_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          estudante_id: string
          horario_embarque?: string | null
          id?: string
          ponto_embarque: string
          rota_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          estudante_id?: string
          horario_embarque?: string | null
          id?: string
          ponto_embarque?: string
          rota_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "estudantes_rotas_estudante_id_fkey"
            columns: ["estudante_id"]
            isOneToOne: false
            referencedRelation: "estudantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estudantes_rotas_rota_id_fkey"
            columns: ["rota_id"]
            isOneToOne: false
            referencedRelation: "rotas"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_monitoramento: {
        Row: {
          created_at: string
          estudante_id: string | null
          id: string
          observacoes: string | null
          rota_id: string
          timestamp: string
          tipo_evento: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          estudante_id?: string | null
          id?: string
          observacoes?: string | null
          rota_id: string
          timestamp?: string
          tipo_evento: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          estudante_id?: string | null
          id?: string
          observacoes?: string | null
          rota_id?: string
          timestamp?: string
          tipo_evento?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_monitoramento_estudante_id_fkey"
            columns: ["estudante_id"]
            isOneToOne: false
            referencedRelation: "estudantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_monitoramento_rota_id_fkey"
            columns: ["rota_id"]
            isOneToOne: false
            referencedRelation: "rotas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_monitoramento_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          funcao: string
          id: string
          nome_completo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          funcao?: string
          id?: string
          nome_completo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          funcao?: string
          id?: string
          nome_completo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rotas: {
        Row: {
          ativa: boolean
          created_at: string
          descricao: string | null
          horario_fim: string | null
          horario_inicio: string
          id: string
          nome: string
          observacoes: string | null
          turno: string
          updated_at: string
          veiculo_id: string | null
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          horario_fim?: string | null
          horario_inicio: string
          id?: string
          nome: string
          observacoes?: string | null
          turno: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Update: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          horario_fim?: string | null
          horario_inicio?: string
          id?: string
          nome?: string
          observacoes?: string | null
          turno?: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rotas_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos: {
        Row: {
          ano: number
          capacidade: number
          chassi: string | null
          cor: string
          created_at: string
          id: string
          marca: string
          modelo: string
          motorista_cnh: string
          motorista_nome: string
          motorista_telefone: string
          observacoes: string | null
          placa: string
          renavam: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ano: number
          capacidade: number
          chassi?: string | null
          cor: string
          created_at?: string
          id?: string
          marca: string
          modelo: string
          motorista_cnh: string
          motorista_nome: string
          motorista_telefone: string
          observacoes?: string | null
          placa: string
          renavam?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ano?: number
          capacidade?: number
          chassi?: string | null
          cor?: string
          created_at?: string
          id?: string
          marca?: string
          modelo?: string
          motorista_cnh?: string
          motorista_nome?: string
          motorista_telefone?: string
          observacoes?: string | null
          placa?: string
          renavam?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
