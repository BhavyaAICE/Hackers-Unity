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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          display_order: number
          glow: string
          gradient: string
          icon_name: string
          id: string
          is_active: boolean | null
          label: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          glow?: string
          gradient?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          label?: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          glow?: string
          gradient?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          label?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          can_export_data: boolean | null
          can_manage_achievements: boolean | null
          can_manage_content: boolean | null
          can_manage_events: boolean | null
          can_manage_hackathons: boolean | null
          can_manage_sponsors: boolean | null
          can_manage_testimonials: boolean | null
          can_manage_users: boolean | null
          can_view_contact_queries: boolean | null
          can_view_dashboard: boolean | null
          can_view_registrations: boolean | null
          created_at: string | null
          email: string
          id: string
          invite_accepted_at: string | null
          invite_token: string | null
          invited_by: string | null
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          can_export_data?: boolean | null
          can_manage_achievements?: boolean | null
          can_manage_content?: boolean | null
          can_manage_events?: boolean | null
          can_manage_hackathons?: boolean | null
          can_manage_sponsors?: boolean | null
          can_manage_testimonials?: boolean | null
          can_manage_users?: boolean | null
          can_view_contact_queries?: boolean | null
          can_view_dashboard?: boolean | null
          can_view_registrations?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          invite_accepted_at?: string | null
          invite_token?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          can_export_data?: boolean | null
          can_manage_achievements?: boolean | null
          can_manage_content?: boolean | null
          can_manage_events?: boolean | null
          can_manage_hackathons?: boolean | null
          can_manage_sponsors?: boolean | null
          can_manage_testimonials?: boolean | null
          can_manage_users?: boolean | null
          can_view_contact_queries?: boolean | null
          can_view_dashboard?: boolean | null
          can_view_registrations?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          invite_accepted_at?: string | null
          invite_token?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contact_queries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          agree_to_contact: boolean | null
          city: string | null
          custom_fields: Json | null
          date_of_birth: string | null
          designation: string | null
          email: string
          event_id: string | null
          first_name: string | null
          full_name: string
          gender: string | null
          id: string
          last_name: string | null
          organization: string | null
          phone: string | null
          registered_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          agree_to_contact?: boolean | null
          city?: string | null
          custom_fields?: Json | null
          date_of_birth?: string | null
          designation?: string | null
          email: string
          event_id?: string | null
          first_name?: string | null
          full_name: string
          gender?: string | null
          id?: string
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          registered_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          agree_to_contact?: boolean | null
          city?: string | null
          custom_fields?: Json | null
          date_of_birth?: string | null
          designation?: string | null
          email?: string
          event_id?: string | null
          first_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          registered_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_speakers: {
        Row: {
          display_order: number | null
          event_id: string | null
          id: string
          speaker_id: string | null
        }
        Insert: {
          display_order?: number | null
          event_id?: string | null
          id?: string
          speaker_id?: string | null
        }
        Update: {
          display_order?: number | null
          event_id?: string | null
          id?: string
          speaker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_speakers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_speakers_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_image: string | null
          benefits_text: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_days: number | null
          event_date: string | null
          event_end_date: string | null
          event_type: string
          external_link: string | null
          id: string
          location_address: string | null
          location_name: string | null
          location_type: string | null
          max_participants: number | null
          prize_pool: string | null
          registration_count: number | null
          registration_deadline: string | null
          registration_enabled: boolean | null
          status: string | null
          subtitle: string | null
          tags: Json | null
          thumbnail_image: string | null
          timing: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_image?: string | null
          benefits_text?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_days?: number | null
          event_date?: string | null
          event_end_date?: string | null
          event_type?: string
          external_link?: string | null
          id?: string
          location_address?: string | null
          location_name?: string | null
          location_type?: string | null
          max_participants?: number | null
          prize_pool?: string | null
          registration_count?: number | null
          registration_deadline?: string | null
          registration_enabled?: boolean | null
          status?: string | null
          subtitle?: string | null
          tags?: Json | null
          thumbnail_image?: string | null
          timing?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_image?: string | null
          benefits_text?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_days?: number | null
          event_date?: string | null
          event_end_date?: string | null
          event_type?: string
          external_link?: string | null
          id?: string
          location_address?: string | null
          location_name?: string | null
          location_type?: string | null
          max_participants?: number | null
          prize_pool?: string | null
          registration_count?: number | null
          registration_deadline?: string | null
          registration_enabled?: boolean | null
          status?: string | null
          subtitle?: string | null
          tags?: Json | null
          thumbnail_image?: string | null
          timing?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hackathon_challenges: {
        Row: {
          created_at: string | null
          description: string | null
          detailed_description: string | null
          display_order: number | null
          event_id: string
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          display_order?: number | null
          event_id: string
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          display_order?: number | null
          event_id?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_challenges_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathon_faqs: {
        Row: {
          answer: string
          created_at: string | null
          display_order: number | null
          event_id: string
          id: string
          is_active: boolean | null
          question: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          display_order?: number | null
          event_id: string
          id?: string
          is_active?: boolean | null
          question: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          display_order?: number | null
          event_id?: string
          id?: string
          is_active?: boolean | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_faqs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathon_jury: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_order: number | null
          event_id: string
          id: string
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          organization: string | null
          title: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          event_id: string
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          organization?: string | null
          title?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          event_id?: string
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          organization?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_jury_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathon_mentors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_order: number | null
          event_id: string
          id: string
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          organization: string | null
          title: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          event_id: string
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          organization?: string | null
          title?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          event_id?: string
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          organization?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_mentors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathon_prizes: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          event_id: string
          icon_url: string | null
          id: string
          is_active: boolean | null
          position: string
          prize_amount: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          event_id: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          position: string
          prize_amount?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          event_id?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          position?: string
          prize_amount?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_prizes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathon_winners: {
        Row: {
          created_at: string | null
          display_order: number | null
          event_id: string
          github_url: string | null
          id: string
          image_url: string | null
          members: string | null
          position: string
          prize_won: string | null
          project_description: string | null
          project_name: string
          project_url: string | null
          team_name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          event_id: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          members?: string | null
          position: string
          prize_won?: string | null
          project_description?: string | null
          project_name: string
          project_url?: string | null
          team_name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          event_id?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          members?: string | null
          position?: string
          prize_won?: string | null
          project_description?: string | null
          project_name?: string
          project_url?: string | null
          team_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_winners_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      image_assets: {
        Row: {
          alt_text: string | null
          created_at: string | null
          created_by: string | null
          file_size: number | null
          height: number | null
          id: string
          mime_type: string | null
          original_filename: string
          storage_path: string
          updated_at: string | null
          variants: Json | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          created_by?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          mime_type?: string | null
          original_filename: string
          storage_path: string
          updated_at?: string | null
          variants?: Json | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          created_by?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string
          storage_path?: string
          updated_at?: string | null
          variants?: Json | null
          width?: number | null
        }
        Relationships: []
      }
      schedule_items: {
        Row: {
          created_at: string | null
          day: number | null
          description: string | null
          display_order: number | null
          end_time: string | null
          event_id: string | null
          id: string
          schedule_date: string | null
          speaker_id: string | null
          start_time: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          day?: number | null
          description?: string | null
          display_order?: number | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          schedule_date?: string | null
          speaker_id?: string | null
          start_time?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          day?: number | null
          description?: string | null
          display_order?: number | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          schedule_date?: string | null
          speaker_id?: string | null
          start_time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_items_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      speakers: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          linkedin_url: string | null
          name: string
          organization: string | null
          title: string | null
          twitter_url: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          organization?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          organization?: string | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string
          name: string
          tier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url: string
          name: string
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string
          name?: string
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          organization: string | null
          rating: number | null
          role: string
          testimonial: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          organization?: string | null
          rating?: number | null
          role: string
          testimonial: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          organization?: string | null
          rating?: number | null
          role?: string
          testimonial?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          content: Json | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: Json | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: Json | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_profiles_public: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_email: { Args: { _user_id: string }; Returns: string }
      get_user_permissions: { Args: { _user_id: string }; Returns: Json }
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
