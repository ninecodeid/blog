import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Settings as SettingsIcon, Globe, Palette, Mail, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { Setting } from "~backend/settings/types";

export default function AdminSettings() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      try {
        return await backend.settings.getSettings();
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      const initialData: Record<string, string> = {};
      data.settings.forEach((setting) => {
        initialData[setting.key] = setting.value;
      });
      setFormData(initialData);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      try {
        return await backend.settings.updateSetting({ key, value });
      } catch (err) {
        console.error("Update error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil diperbarui",
      });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui pengaturan",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (setting: Setting) => {
    const value = formData[setting.key];
    if (value !== setting.value) {
      updateMutation.mutate({ key: setting.key, value });
    }
  };

  const renderInput = (setting: Setting) => {
    const value = formData[setting.key] || setting.value;

    switch (setting.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
            rows={4}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Switch
              checked={value === 'true'}
              onCheckedChange={(checked) => handleInputChange(setting.key, checked.toString())}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {value === 'true' ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
        );
      case 'color':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={value}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="flex-1 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
              placeholder="#000000"
            />
          </div>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
          />
        );
      case 'url':
        return (
          <Input
            type="url"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
            placeholder="https://example.com"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
          />
        );
    }
  };

  const groupSettings = (settings: Setting[]) => {
    const groups = {
      general: settings.filter(s => s.key.startsWith('site_') || s.key === 'contact_email' || s.key === 'posts_per_page'),
      features: settings.filter(s => s.key.startsWith('enable_') || s.key === 'maintenance_mode'),
      social: settings.filter(s => s.key.startsWith('social_')),
      theme: settings.filter(s => s.key.startsWith('theme_')),
      analytics: settings.filter(s => s.key.startsWith('analytics_')),
    };
    return groups;
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center py-20">
          <p className="text-red-600 dark:text-red-400">Gagal memuat pengaturan. Silakan coba lagi.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {error instanceof Error ? error.message : "Kesalahan tidak diketahui"}
          </p>
        </div>
      </div>
    );
  }

  const groups = groupSettings(data?.settings || []);

  return (
    <div className="p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Pengaturan
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Konfigurasi pengaturan website Anda
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pengaturan Umum</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.general.map((setting) => (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                {renderInput(setting)}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fitur</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.features.map((setting) => (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                {renderInput(setting)}
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media Sosial</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.social.map((setting) => (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                {renderInput(setting)}
              </div>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tema</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.theme.map((setting) => (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                {renderInput(setting)}
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <BarChart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analitik</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {groups.analytics.map((setting) => (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
                {renderInput(setting)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
