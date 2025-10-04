import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/hooks/useTheme';
import { storage } from '@/lib/storage';
import { Download, Trash2, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

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
          <div>
            <h2 className="text-lg font-semibold mb-4">Aparência</h2>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Tema</Label>
                <p className="text-sm text-muted-foreground">
                  Alternar entre modo claro e escuro
                </p>
              </div>
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    Escuro
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    Claro
                  </>
                )}
              </Button>
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
