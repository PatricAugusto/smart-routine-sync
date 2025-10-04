import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/hooks/useTheme';
import { storage } from '@/lib/storage';
import {
  requestNotificationPermission,
  getNotificationSettings,
  setNotificationSettings,
} from '@/lib/notifications';
import { Download, Trash2, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { mode, cycleTheme, getThemeLabel } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(getNotificationSettings());

  const handleExport = () => {
    const tasks = storage.getTasks();
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exportado com sucesso!');
  };

  const handleClearAll = () => {
    if (confirm('Deseja realmente limpar TODOS os dados? Esta ação não pode ser desfeita!')) {
      storage.clearAll();
      toast.success('Todos os dados foram removidos!');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        setNotificationSettings(true);
        toast.success('Notificações ativadas!');
      } else {
        toast.error('Permissão de notificações negada');
      }
    } else {
      setNotificationsEnabled(false);
      setNotificationSettings(false);
      toast.success('Notificações desativadas');
    }
  };

  const lastSync = storage.getLastSyncTime();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize seu planner e gerencie seus dados
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Aparência</h2>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Tema Visual</Label>
                <p className="text-sm text-muted-foreground">
                  Atual: {getThemeLabel()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={cycleTheme}
                className="gap-2"
              >
                <Palette className="h-4 w-4" />
                Alternar Tema
              </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium">Modos disponíveis:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Claro: Interface clara o tempo todo</li>
                <li>• Escuro: Interface escura o tempo todo</li>
                <li>• Neutro: Tons neutros minimalistas</li>
                <li>• Dinâmico: Muda automaticamente baseado no horário</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Notificações</h2>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications">Lembretes de Tarefas</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações para suas tarefas
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <Bell className="h-4 w-4 inline mr-1" />
                As notificações funcionam mesmo offline e ajudam você a não perder nenhuma tarefa importante.
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-4">Dados</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Última sincronização</Label>
                  <p className="text-sm text-muted-foreground">
                    {lastSync
                      ? new Date(lastSync).toLocaleString('pt-BR')
                      : 'Nunca sincronizado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Exportar dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Fazer backup das suas tarefas
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Limpar todos os dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Remove todas as tarefas permanentemente
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleClearAll}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Sobre</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Planner de Rotina Inteligente v1.0</p>
              <p>Progressive Web App com suporte offline</p>
              <p className="text-xs mt-4">
                © 2025 - Criado com Lovable
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
