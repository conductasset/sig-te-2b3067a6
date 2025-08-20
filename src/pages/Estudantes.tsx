import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, School, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Estudante {
  id: string;
  nome_completo: string;
  escola: string;
  turno: string;
  ativo: boolean;
  responsavel_nome: string;
  responsavel_telefone: string;
}

export default function Estudantes() {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEstudantes();
  }, []);

  const loadEstudantes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('estudantes')
        .select('*')
        .order('nome_completo');

      if (error) throw error;
      setEstudantes(data || []);
    } catch (error) {
      console.error('Erro ao carregar estudantes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os estudantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEstudantes = estudantes.filter(estudante =>
    estudante.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudante.escola.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudante.responsavel_nome.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estudantes</h1>
          <p className="text-muted-foreground">
            Gerencie os estudantes do transporte escolar
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Novo Estudante
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, escola ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={loadEstudantes}>
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-primary mr-4" />
            <div>
              <p className="text-2xl font-bold">{estudantes.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <School className="h-8 w-8 text-success mr-4" />
            <div>
              <p className="text-2xl font-bold">{estudantes.filter(e => e.ativo).length}</p>
              <p className="text-sm text-muted-foreground">Ativos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-warning mr-4" />
            <div>
              <p className="text-2xl font-bold">{estudantes.filter(e => !e.ativo).length}</p>
              <p className="text-sm text-muted-foreground">Inativos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
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
        ) : filteredEstudantes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum estudante encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece cadastrando um novo estudante'}
              </p>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Novo Estudante
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredEstudantes.map((estudante) => (
            <Card key={estudante.id} className="hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{estudante.nome_completo}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <School className="h-4 w-4 mr-1" />
                          {estudante.escola}
                        </span>
                        <Badge className={getTurnoColor(estudante.turno)}>
                          {getTurnoLabel(estudante.turno)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Responsável: {estudante.responsavel_nome} - {estudante.responsavel_telefone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={estudante.ativo ? "default" : "secondary"}>
                      {estudante.ativo ? "Ativo" : "Inativo"}
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