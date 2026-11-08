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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      cash_closings: {
        Row: {
          cash_out: number
          cash_sales: number
          closing_date: string
          closing_id: number
          counted_cash: number
          created_at: string
          difference: number
          expected_cash: number
          note: string | null
          opening_cash: number
          user_id: number
        }
        Insert: {
          cash_out?: number
          cash_sales?: number
          closing_date: string
          closing_id?: number
          counted_cash?: number
          created_at?: string
          difference?: number
          expected_cash?: number
          note?: string | null
          opening_cash?: number
          user_id: number
        }
        Update: {
          cash_out?: number
          cash_sales?: number
          closing_date?: string
          closing_id?: number
          counted_cash?: number
          created_at?: string
          difference?: number
          expected_cash?: number
          note?: string | null
          opening_cash?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cash_closings_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      checkout_tokens: {
        Row: {
          created_at: string
          token: string
          transaction_id: number | null
          used_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          token?: string
          transaction_id?: number | null
          used_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          token?: string
          transaction_id?: number | null
          used_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "checkout_tokens_transaction_fk"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "cashier_transactions_today"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "checkout_tokens_transaction_fk"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "checkout_tokens_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      finance: {
        Row: {
          amount: number
          category: string
          date: string
          description: string | null
          finance_id: number
          pool: string
          type: string
          user_id: number
        }
        Insert: {
          amount: number
          category: string
          date?: string
          description?: string | null
          finance_id?: number
          pool: string
          type: string
          user_id: number
        }
        Update: {
          amount?: number
          category?: string
          date?: string
          description?: string | null
          finance_id?: number
          pool?: string
          type?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "finance_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempt_id: number
          attempted_at: string
          ip_address: string
          username: string
        }
        Insert: {
          attempt_id?: number
          attempted_at?: string
          ip_address: string
          username: string
        }
        Update: {
          attempt_id?: number
          attempted_at?: string
          ip_address?: string
          username?: string
        }
        Relationships: []
      }
      menu: {
        Row: {
          available: boolean
          category: string
          code: string
          cost_price: number
          menu_id: number
          name: string
          photo: string | null
          price: number
          status: boolean
        }
        Insert: {
          available?: boolean
          category?: string
          code: string
          cost_price?: number
          menu_id?: number
          name: string
          photo?: string | null
          price?: number
          status?: boolean
        }
        Update: {
          available?: boolean
          category?: string
          code?: string
          cost_price?: number
          menu_id?: number
          name?: string
          photo?: string | null
          price?: number
          status?: boolean
        }
        Relationships: []
      }
      menu_modifier_groups: {
        Row: {
          group_id: number
          is_required: boolean
          menu_id: number
          name: string
          type: string
        }
        Insert: {
          group_id?: number
          is_required?: boolean
          menu_id: number
          name: string
          type?: string
        }
        Update: {
          group_id?: number
          is_required?: boolean
          menu_id?: number
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_modifier_groups_menu_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "cashier_menu"
            referencedColumns: ["menu_id"]
          },
          {
            foreignKeyName: "menu_modifier_groups_menu_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["menu_id"]
          },
        ]
      }
      menu_modifier_items: {
        Row: {
          available: boolean
          extra_cost: number
          extra_price: number
          group_id: number
          hint: string | null
          modifier_id: number
          name: string
        }
        Insert: {
          available?: boolean
          extra_cost?: number
          extra_price?: number
          group_id: number
          hint?: string | null
          modifier_id?: number
          name: string
        }
        Update: {
          available?: boolean
          extra_cost?: number
          extra_price?: number
          group_id?: number
          hint?: string | null
          modifier_id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_modifier_items_group_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cashier_menu_modifier_groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "menu_modifier_items_group_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "menu_modifier_groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      order_item_modifiers: {
        Row: {
          cost_price: number
          modifier_name: string
          order_id: number
          order_modifier_id: number
          price: number
        }
        Insert: {
          cost_price?: number
          modifier_name: string
          order_id: number
          order_modifier_id?: number
          price?: number
        }
        Update: {
          cost_price?: number
          modifier_name?: string
          order_id?: number
          order_modifier_id?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_modifiers_order_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "cashier_orders_today"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_modifiers_order_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      orders: {
        Row: {
          cost_price: number
          menu_id: number
          modifier_cost: number
          modifier_price: number
          note: string | null
          order_id: number
          price: number
          quantity: number
          subtotal: number
          transaction_id: number
        }
        Insert: {
          cost_price: number
          menu_id: number
          modifier_cost?: number
          modifier_price?: number
          note?: string | null
          order_id?: number
          price: number
          quantity: number
          subtotal: number
          transaction_id: number
        }
        Update: {
          cost_price?: number
          menu_id?: number
          modifier_cost?: number
          modifier_price?: number
          note?: string | null
          order_id?: number
          price?: number
          quantity?: number
          subtotal?: number
          transaction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_menu_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "cashier_menu"
            referencedColumns: ["menu_id"]
          },
          {
            foreignKeyName: "orders_menu_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["menu_id"]
          },
          {
            foreignKeyName: "orders_transaction_fk"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "cashier_transactions_today"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "orders_transaction_fk"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      settings: {
        Row: {
          business_address: string | null
          business_name: string
          operating_percent: number
          qris_bank: string | null
          qris_image: string | null
          qris_owner_name: string | null
          receipt_footer: string | null
          settings_id: number
          table_count: number
        }
        Insert: {
          business_address?: string | null
          business_name: string
          operating_percent?: number
          qris_bank?: string | null
          qris_image?: string | null
          qris_owner_name?: string | null
          receipt_footer?: string | null
          settings_id?: number
          table_count?: number
        }
        Update: {
          business_address?: string | null
          business_name?: string
          operating_percent?: number
          qris_bank?: string | null
          qris_image?: string | null
          qris_owner_name?: string | null
          receipt_footer?: string | null
          settings_id?: number
          table_count?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          alloc_operating: number
          alloc_profit: number
          alloc_restock: number
          change_due: number
          completed_at: string | null
          date: string
          duration_seconds: number | null
          gross_profit: number
          method: string
          order_date: string
          order_no: number
          paid: number
          status: string
          table_no: string
          total: number
          total_cost: number
          transaction_id: number
          user_id: number
          void_reason: string | null
          voided_at: string | null
          voided_by: number | null
        }
        Insert: {
          alloc_operating?: number
          alloc_profit?: number
          alloc_restock?: number
          change_due?: number
          completed_at?: string | null
          date?: string
          duration_seconds?: number | null
          gross_profit?: number
          method: string
          order_date: string
          order_no: number
          paid: number
          status?: string
          table_no: string
          total: number
          total_cost?: number
          transaction_id?: number
          user_id: number
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: number | null
        }
        Update: {
          alloc_operating?: number
          alloc_profit?: number
          alloc_restock?: number
          change_due?: number
          completed_at?: string | null
          date?: string
          duration_seconds?: number | null
          gross_profit?: number
          method?: string
          order_date?: string
          order_no?: number
          paid?: number
          status?: string
          table_no?: string
          total?: number
          total_cost?: number
          transaction_id?: number
          user_id?: number
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_voided_by_fk"
            columns: ["voided_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string
          name: string
          status: boolean
          user_id: number
          username: string
        }
        Insert: {
          auth_id: string
          name: string
          status?: boolean
          user_id?: number
          username: string
        }
        Update: {
          auth_id?: string
          name?: string
          status?: boolean
          user_id?: number
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      cashier_menu: {
        Row: {
          available: boolean | null
          category: string | null
          code: string | null
          menu_id: number | null
          name: string | null
          photo: string | null
          price: number | null
          status: boolean | null
        }
        Insert: {
          available?: boolean | null
          category?: string | null
          code?: string | null
          menu_id?: number | null
          name?: string | null
          photo?: string | null
          price?: number | null
          status?: boolean | null
        }
        Update: {
          available?: boolean | null
          category?: string | null
          code?: string | null
          menu_id?: number | null
          name?: string | null
          photo?: string | null
          price?: number | null
          status?: boolean | null
        }
        Relationships: []
      }
      cashier_menu_modifier_groups: {
        Row: {
          group_id: number | null
          is_required: boolean | null
          menu_id: number | null
          name: string | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_modifier_groups_menu_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "cashier_menu"
            referencedColumns: ["menu_id"]
          },
          {
            foreignKeyName: "menu_modifier_groups_menu_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["menu_id"]
          },
        ]
      }
      cashier_menu_modifier_items: {
        Row: {
          available: boolean | null
          extra_price: number | null
          group_id: number | null
          hint: string | null
          modifier_id: number | null
          name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_modifier_items_group_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cashier_menu_modifier_groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "menu_modifier_items_group_fk"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "menu_modifier_groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      cashier_order_modifiers_today: {
        Row: {
          modifier_name: string | null
          order_id: number | null
          order_modifier_id: number | null
          price: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_modifiers_order_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "cashier_orders_today"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_modifiers_order_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      cashier_orders_today: {
        Row: {
          menu_id: number | null
          modifier_price: number | null
          note: string | null
          order_id: number | null
          price: number | null
          quantity: number | null
          subtotal: number | null
          transaction_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_menu_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "cashier_menu"
            referencedColumns: ["menu_id"]
          },
          {
            foreignKeyName: "orders_menu_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["menu_id"]
          },
          {
            foreignKeyName: "orders_transaction_fk"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "cashier_transactions_today"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "orders_transaction_fk"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      cashier_transactions_today: {
        Row: {
          change_due: number | null
          completed_at: string | null
          date: string | null
          duration_seconds: number | null
          method: string | null
          order_date: string | null
          order_no: number | null
          paid: number | null
          status: string | null
          table_no: string | null
          total: number | null
          transaction_id: number | null
          user_id: number | null
        }
        Insert: {
          change_due?: number | null
          completed_at?: string | null
          date?: string | null
          duration_seconds?: number | null
          method?: string | null
          order_date?: string | null
          order_no?: number | null
          paid?: number | null
          status?: string | null
          table_no?: string | null
          total?: number | null
          transaction_id?: number | null
          user_id?: number | null
        }
        Update: {
          change_due?: number | null
          completed_at?: string | null
          date?: string | null
          duration_seconds?: number | null
          method?: string | null
          order_date?: string | null
          order_no?: number | null
          paid?: number | null
          status?: string | null
          table_no?: string | null
          total?: number | null
          transaction_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      staff_settings: {
        Row: {
          business_address: string | null
          business_name: string | null
          qris_bank: string | null
          qris_image: string | null
          qris_owner_name: string | null
          receipt_footer: string | null
          settings_id: number | null
          table_count: number | null
        }
        Insert: {
          business_address?: string | null
          business_name?: string | null
          qris_bank?: string | null
          qris_image?: string | null
          qris_owner_name?: string | null
          receipt_footer?: string | null
          settings_id?: number | null
          table_count?: number | null
        }
        Update: {
          business_address?: string | null
          business_name?: string | null
          qris_bank?: string | null
          qris_image?: string | null
          qris_owner_name?: string | null
          receipt_footer?: string | null
          settings_id?: number | null
          table_count?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      clear_login_attempts: {
        Args: { _ip_address: string; _username: string }
        Returns: undefined
      }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      record_login_failure: {
        Args: { _ip_address: string; _username: string }
        Returns: {
          is_locked: boolean
          seconds_remaining: number
        }[]
      }
      reserve_login_attempt: {
        Args: { _ip_address: string; _username: string }
        Returns: {
          is_locked: boolean
          reserved_attempt_id: number
          seconds_remaining: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "cashier"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "cashier"],
    },
  },
} as const
