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
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
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
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={4}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === 'true'}
              onCheckedChange={(checked) => handleInputChange(setting.key, checked.toString())}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {value === 'true' ? 'Enabled' : 'Disabled'}
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
              className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(setting.key, e.target.value)}
              className="flex-1 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );
      case 'url':
        return (
          <Input
            type="url"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="https://example.com"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
      <div className="p-6 lg:p-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-20">
          <p className="text-red-600 dark:text-red-400">Failed to load settings. Please try again.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const groups = groupSettings(data?.settings || []);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-600 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Configure your website settings
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">General Settings</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.general.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Features</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.features.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Social Media</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.social.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.theme.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {groups.analytics.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 dark:text-gray-300 font-medium">
                    {setting.description || setting.key}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(setting)}
                    disabled={updateMutation.isPending || formData[setting.key] === setting.value}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
