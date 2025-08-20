-- Create security definer function to get current user role
-- This prevents RLS recursion issues
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT funcao FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop all existing policies for estudantes table
DROP POLICY IF EXISTS "Usuários autenticados podem ver estudantes" ON public.estudantes;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir estudantes" ON public.estudantes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar estudantes" ON public.estudantes;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar estudantes" ON public.estudantes;
DROP POLICY IF EXISTS "Admin e coordenador podem ver estudantes" ON public.estudantes;
DROP POLICY IF EXISTS "Admin e coordenador podem inserir estudantes" ON public.estudantes;
DROP POLICY IF EXISTS "Admin e coordenador podem atualizar estudantes" ON public.estudantes;
DROP POLICY IF EXISTS "Admin pode deletar estudantes" ON public.estudantes;

-- Create new role-based policies for estudantes table
-- Only admin and coordenador can view all student data
CREATE POLICY "Acesso_visualizar_estudantes_por_funcao" 
ON public.estudantes 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin', 'coordenador'));

-- Only admin and coordenador can insert student data
CREATE POLICY "Acesso_inserir_estudantes_por_funcao" 
ON public.estudantes 
FOR INSERT 
WITH CHECK (public.get_current_user_role() IN ('admin', 'coordenador'));

-- Only admin and coordenador can update student data
CREATE POLICY "Acesso_atualizar_estudantes_por_funcao" 
ON public.estudantes 
FOR UPDATE 
USING (public.get_current_user_role() IN ('admin', 'coordenador'));

-- Only admin can delete student data
CREATE POLICY "Acesso_deletar_estudantes_admin_apenas" 
ON public.estudantes 
FOR DELETE 
USING (public.get_current_user_role() = 'admin');