import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  Bus, 
  Route,
  Calendar,
  BarChart3,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  estudantesAtivos: number;
  veiculosOperacionais: number;
  rotasAtivas: number;
  eventosHoje: number;
  eventosSemana: number;
  eventosMes: number;
}

export default function Relatorios() {
  const [reportData, setReportData] = useState<ReportData>({
    estudantesAtivos: 0,
    veiculosOperacionais: 0,
    rotasAtivas: 0,
    eventosHoje: 0,
    eventosSemana: 0,
    eventosMes: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Buscar dados para relatórios
      const [estudantesRes, veiculosRes, rotasRes, eventosRes] = await Promise.all([
        supabase.from('estudantes').select('ativo'),
        supabase.from('veiculos').select('status'),
        supabase.from('rotas').select('ativa'),
        supabase.from('logs_monitoramento').select('created_at')
      ]);

      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      const eventosHoje = eventosRes.data?.filter(evento => {
        const dataEvento = new Date(evento.created_at);
        return dataEvento.toDateString() === hoje.toDateString();
      }).length || 0;

      const eventosSemana = eventosRes.data?.filter(evento => {
        const dataEvento = new Date(evento.created_at);
        return dataEvento >= inicioSemana;
      }).length || 0;

      const eventosMes = eventosRes.data?.filter(evento => {
        const dataEvento = new Date(evento.created_at);
        return dataEvento >= inicioMes;
      }).length || 0;

      setReportData({
        estudantesAtivos: estudantesRes.data?.filter(e => e.ativo).length || 0,
        veiculosOperacionais: veiculosRes.data?.filter(v => v.status === 'ativo').length || 0,
        rotasAtivas: rotasRes.data?.filter(r => r.ativa).length || 0,
        eventosHoje,
        eventosSemana,
        eventosMes
      });
    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados dos relatórios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const reportCards = [
    {
      title: "Relatório de Estudantes",
      description: "Dados detalhados sobre estudantes cadastrados e ativos",
      icon: Users,
      value: reportData.estudantesAtivos,
      label: "estudantes ativos",
      color: "text-blue-600"
    },
    {
      title: "Relatório de Veículos",
      description: "Status da frota e informações de manutenção",
      icon: Bus,
      value: reportData.veiculosOperacionais,
      label: "veículos operacionais",
      color: "text-green-600"
    },
    {
      title: "Relatório de Rotas",
      description: "Análise de rotas ativas e eficiência",
      icon: Route,
      value: reportData.rotasAtivas,
      label: "rotas ativas",
      color: "text-purple-600"
    },
    {
      title: "Atividade Diária",
      description: "Eventos e monitoramento de hoje",
      icon: Calendar,
      value: reportData.eventosHoje,
      label: "eventos hoje",
      color: "text-orange-600"
    }
  ];

  const quickReports = [
    {
      title: "Resumo Semanal",
      description: "Atividades dos últimos 7 dias",
      icon: BarChart3,
      value: reportData.eventosSemana,
      period: "Esta semana"
    },
    {
      title: "Resumo Mensal",
      description: "Estatísticas do mês atual", 
      icon: PieChart,
      value: reportData.eventosMes,
      period: "Este mês"
    }
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e estatísticas do sistema de transporte escolar
          </p>
        </div>
        <Button onClick={loadReportData} variant="outline">
          <TrendingUp className="mr-2 h-4 w-4" />
          Atualizar Dados
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((card, index) => (
          <Card key={index} className="hover:shadow-hover transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{loading ? "..." : card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportCards.map((report, index) => (
          <Card key={index} className="hover:shadow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className={`h-5 w-5 ${report.color}`} />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total:</span>
                  <Badge variant="outline">{loading ? "..." : report.value}</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Reports */}
      <div className="grid gap-6 md:grid-cols-2">
        {quickReports.map((report, index) => (
          <Card key={index} className="hover:shadow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className="h-5 w-5 text-primary" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-primary">
                    {loading ? "..." : report.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{report.period}</p>
                </div>
                <Button className="w-full bg-gradient-primary">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Personalizados</CardTitle>
          <CardDescription>
            Crie relatórios customizados com filtros específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
          <p className="text-muted-foreground mb-4">
            Funcionalidade de relatórios personalizados em breve
          </p>
          <Button variant="outline" disabled>
            Criar Relatório Personalizado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}