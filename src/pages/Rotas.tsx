import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Route, Bus, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Rota {
  id: string;
  nome: string;
  descricao: string;
  veiculo_id: string;
  turno: string;
  horario_inicio: string;
  horario_fim: string;
  ativa: boolean;
  veiculos?: {
    placa: string;
    modelo: string;
    marca: string;
  };
}

export default function Rotas() {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRotas();
  }, []);

  const loadRotas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rotas')
        .select(`
          *,
          veiculos (
            placa,
            modelo,
            marca
          )
        `)
        .order('nome');

      if (error) throw error;
      setRotas(data || []);
    } catch (error) {
      console.error('Erro ao carregar rotas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as rotas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRotas = rotas.filter(rota =>
    rota.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rota.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rota.veiculos?.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTurnoColor = (turno: string) => {
    switch (turno) {
      case 'manha': return 'bg-yellow-100 text-yellow-800';
      case 'tarde': return 'bg-orange-100 text-orange-800';
      case 'noite': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTurnoLabel = (turno: string) => {
    switch (turno) {
      case 'manha': return 'Manhã';
      case 'tarde': return 'Tarde';
      case 'noite': return 'Noite';
      default: return turno;
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rotas</h1>
          <p className="text-muted-foreground">
            Gerencie as rotas de transporte escolar
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Nova Rota
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, descrição ou veículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={loadRotas}>
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center p-6">
            <Route className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-2xl font-bold">{rotas.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <MapPin className="h-8 w-8 text-success mr-4" />
            <div>
              <p className="text-2xl font-bold">{rotas.filter(r => r.ativa).length}</p>
              <p className="text-sm text-muted-foreground">Ativas</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-warning mr-4" />
            <div>
              <p className="text-2xl font-bold">{rotas.filter(r => !r.ativa).length}</p>
              <p className="text-sm text-muted-foreground">Inativas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : filteredRotas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Route className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma rota encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece cadastrando uma nova rota'}
              </p>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Nova Rota
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredRotas.map((rota) => (
            <Card key={rota.id} className="hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Route className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{rota.nome}</h3>
                      {rota.descricao && (
                        <p className="text-sm text-muted-foreground mb-2">{rota.descricao}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(rota.horario_inicio)}
                          {rota.horario_fim && ` - ${formatTime(rota.horario_fim)}`}
                        </span>
                        <Badge className={getTurnoColor(rota.turno)}>
                          {getTurnoLabel(rota.turno)}
                        </Badge>
                        {rota.veiculos && (
                          <span className="flex items-center">
                            <Bus className="h-4 w-4 mr-1" />
                            {rota.veiculos.placa} - {rota.veiculos.marca} {rota.veiculos.modelo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={rota.ativa ? "default" : "secondary"}>
                      {rota.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}