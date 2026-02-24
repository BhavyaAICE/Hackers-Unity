import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiPermissions } from "@/types/api.types";

export interface UserPermissions {
  is_super_admin: boolean;
  can_view_dashboard: boolean;
  can_manage_events: boolean;
  can_manage_hackathons: boolean;
  can_view_registrations: boolean;
  can_export_data: boolean;
  can_manage_sponsors: boolean;
  can_manage_testimonials: boolean;
  can_manage_content: boolean;
  can_manage_achievements: boolean;
  can_view_contact_queries: boolean;
  can_manage_users: boolean;
}

const defaultPermissions: UserPermissions = {
  is_super_admin: false,
  can_view_dashboard: false,
  can_manage_events: false,
  can_manage_hackathons: false,
  can_view_registrations: false,
  can_export_data: false,
  can_manage_sponsors: false,
  can_manage_testimonials: false,
  can_manage_content: false,
  can_manage_achievements: false,
  can_view_contact_queries: false,
  can_manage_users: false,
};

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions(defaultPermissions);
        setLoading(false);
        return;
      }

      try {
        // Replaces: supabase.rpc('get_user_permissions', { _user_id: user.id })
        const { permissions: perms } = await api.get<{ permissions: ApiPermissions }>(
          "/api/admin/permissions"
        );
        setPermissions(perms as UserPermissions);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setPermissions(defaultPermissions);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasAnyPermission = (): boolean => {
    return Object.values(permissions).some((v) => v === true);
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions.is_super_admin || permissions[permission];
  };

  return {
    permissions,
    loading,
    hasAnyPermission,
    hasPermission,
  };
};
