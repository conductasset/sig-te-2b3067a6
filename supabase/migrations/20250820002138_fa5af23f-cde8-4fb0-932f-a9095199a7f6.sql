-- Criar tabela de perfis para usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  funcao TEXT NOT NULL DEFAULT 'monitor',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estudantes
CREATE TABLE public.estudantes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  cpf TEXT UNIQUE,
  endereco TEXT NOT NULL,
  telefone TEXT,
  responsavel_nome TEXT NOT NULL,
  responsavel_telefone TEXT NOT NULL,
  escola TEXT NOT NULL,
  turno TEXT NOT NULL CHECK (turno IN ('manha', 'tarde', 'noite')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de veículos
CREATE TABLE public.veiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  placa TEXT NOT NULL UNIQUE,
  modelo TEXT NOT NULL,
  marca TEXT NOT NULL,
  ano INTEGER NOT NULL,
  capacidade INTEGER NOT NULL,
  cor TEXT NOT NULL,
  renavam TEXT,
  chassi TEXT,
  motorista_nome TEXT NOT NULL,
  motorista_cnh TEXT NOT NULL,
  motorista_telefone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'manutencao', 'inativo')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de rotas
CREATE TABLE public.rotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  veiculo_id UUID REFERENCES public.veiculos(id),
  turno TEXT NOT NULL CHECK (turno IN ('manha', 'tarde', 'noite')),
  horario_inicio TIME NOT NULL,
  horario_fim TIME,
  ativa BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estudantes por rota
CREATE TABLE public.estudantes_rotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estudante_id UUID NOT NULL REFERENCES public.estudantes(id) ON DELETE CASCADE,
  rota_id UUID NOT NULL REFERENCES public.rotas(id) ON DELETE CASCADE,
  ponto_embarque TEXT NOT NULL,
  horario_embarque TIME,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(estudante_id, rota_id)
);

-- Criar tabela de logs de monitoramento
CREATE TABLE public.logs_monitoramento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rota_id UUID NOT NULL REFERENCES public.rotas(id),
  estudante_id UUID REFERENCES public.estudantes(id),
  tipo_evento TEXT NOT NULL CHECK (tipo_evento IN ('embarque', 'desembarque', 'falta', 'atraso')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  observacoes TEXT,
  usuario_id UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudantes_rotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_monitoramento ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem inserir seu próprio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para estudantes
CREATE POLICY "Usuários autenticados podem ver estudantes" ON public.estudantes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem inserir estudantes" ON public.estudantes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem atualizar estudantes" ON public.estudantes FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem deletar estudantes" ON public.estudantes FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas RLS para veículos
CREATE POLICY "Usuários autenticados podem ver veículos" ON public.veiculos FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem inserir veículos" ON public.veiculos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem atualizar veículos" ON public.veiculos FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem deletar veículos" ON public.veiculos FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas RLS para rotas
CREATE POLICY "Usuários autenticados podem ver rotas" ON public.rotas FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem inserir rotas" ON public.rotas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem atualizar rotas" ON public.rotas FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem deletar rotas" ON public.rotas FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas RLS para estudantes_rotas
CREATE POLICY "Usuários autenticados podem ver estudantes_rotas" ON public.estudantes_rotas FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem inserir estudantes_rotas" ON public.estudantes_rotas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem atualizar estudantes_rotas" ON public.estudantes_rotas FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem deletar estudantes_rotas" ON public.estudantes_rotas FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas RLS para logs_monitoramento
CREATE POLICY "Usuários autenticados podem ver logs" ON public.logs_monitoramento FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuários autenticados podem inserir logs" ON public.logs_monitoramento FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers de updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_estudantes_updated_at BEFORE UPDATE ON public.estudantes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_veiculos_updated_at BEFORE UPDATE ON public.veiculos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rotas_updated_at BEFORE UPDATE ON public.rotas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();