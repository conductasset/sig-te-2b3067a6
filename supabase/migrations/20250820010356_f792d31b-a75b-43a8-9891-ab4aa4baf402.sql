-- Fix security vulnerability: Restrict profile SELECT policy to only allow users to view their own profile
DROP POLICY IF EXISTS "Usuários podem ver todos os perfis" ON public.profiles;

-- Create new restrictive policy that only allows users to view their own profile
CREATE POLICY "Usuários podem ver apenas seu próprio perfil" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);