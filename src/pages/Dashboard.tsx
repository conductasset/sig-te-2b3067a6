import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Bus, Route, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalEstudantes: number;
  estudantesAtivos: number;
  totalVeiculos: number;
  veiculosAtivos: number;
  totalRotas: number;
  rotasAtivas: number;
  eventosHoje: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEstudantes: 0,
    estudantesAtivos: 0,
    totalVeiculos: 0,
    veiculosAtivos: 0,
    totalRotas: 0,
    rotasAtivas: 0,
    eventosHoje: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Buscar estatísticas dos estudantes
      const { data: estudantes } = await supabase
        .from('estudantes')
        .select('ativo');

      // Buscar estatísticas dos veículos
      const { data: veiculos } = await supabase
        .from('veiculos')
        .select('status');

      // Buscar estatísticas das rotas
      const { data: rotas } = await supabase
        .from('rotas')
        .select('ativa');

      // Buscar eventos de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const { data: eventos } = await supabase
        .from('logs_monitoramento')
        .select('id')
        .gte('created_at', `${hoje}T00:00:00.000Z`)
        .lt('created_at', `${hoje}T23:59:59.999Z`);

      setStats({
        totalEstudantes: estudantes?.length || 0,
        estudantesAtivos: estudantes?.filter(e => e.ativo).length || 0,
        totalVeiculos: veiculos?.length || 0,
        veiculosAtivos: veiculos?.filter(v => v.status === 'ativo').length || 0,
        totalRotas: rotas?.length || 0,
        rotasAtivas: rotas?.filter(r => r.ativa).length || 0,
        eventosHoje: eventos?.length || 0
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend, 
    status 
  }: {
    title: string;
    value: number | string;
    description: string;
    icon: any;
    trend?: string;
    status?: 'success' | 'warning' | 'error';
  }) => (
    <Card className="hover:shadow-hover transition-all duration-300 bg-gradient-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {status && (
            <Badge 
              variant={
                status === 'success' ? 'default' : 
                status === 'warning' ? 'secondary' : 
                'destructive'
              }
              className="ml-2"
            >
              {status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
              {status === 'warning' && <Clock className="h-3 w-3 mr-1" />}
              {status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
              {status === 'success' ? 'Ativo' : status === 'warning' ? 'Atenção' : 'Crítico'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de transporte escolar
          </p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <Activity className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Estudantes"
          value={stats.totalEstudantes}
          description={`${stats.estudantesAtivos} ativos`}
          icon={Users}
          status={stats.estudantesAtivos > 0 ? 'success' : 'warning'}
        />
        
        <StatCard
          title="Veículos"
          value={stats.totalVeiculos}
          description={`${stats.veiculosAtivos} em operação`}
          icon={Bus}
          status={stats.veiculosAtivos > 0 ? 'success' : 'error'}
        />
        
        <StatCard
          title="Rotas"
          value={stats.totalRotas}
          description={`${stats.rotasAtivas} ativas`}
          icon={Route}
          status={stats.rotasAtivas > 0 ? 'success' : 'warning'}
        />
        
        <StatCard
          title="Eventos Hoje"
          value={stats.eventosHoje}
          description="Registros de monitoramento"
          icon={Activity}
          status={stats.eventosHoje > 0 ? 'success' : 'warning'}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Gestão de Estudantes
            </CardTitle>
            <CardDescription>
              Cadastre novos estudantes ou gerencie os existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-primary">
              Gerenciar Estudantes
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Controle de Veículos
            </CardTitle>
            <CardDescription>
              Registre veículos e acompanhe manutenções
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-primary">
              Gerenciar Veículos
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              Planejamento de Rotas
            </CardTitle>
            <CardDescription>
              Configure rotas e otimize trajetos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-primary">
              Gerenciar Rotas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Atividade Recente
          </CardTitle>
          <CardDescription>
            Últimos eventos registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma atividade recente registrada</p>
            <p className="text-sm">Os eventos de monitoramento aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}