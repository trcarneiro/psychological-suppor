# Configuração do Supabase - Guia Rápido

## 1. Desabilitar Confirmação de Email (DEV)

Acesse: https://supabase.com/dashboard/project/dixwysghljgqvewfmmcj/auth/providers

1. Na seção **"Email"**, clique em **Edit**
2. Desmarque: **"Enable email confirmations"**
3. Clique em **Save**

## 2. Habilitar Login com Google

### 2.1. Criar Credenciais no Google Cloud Console

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie um novo projeto ou selecione existente
3. Clique em **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
4. Application type: **Web application**
5. Name: `Psychological Support Platform`
6. Authorized JavaScript origins:
   - `https://dixwysghljgqvewfmmcj.supabase.co`
   - `http://localhost:5173` (para dev)
   - `https://psicologobelohorizonte.com.br` (produção)
7. Authorized redirect URIs:
   - `https://dixwysghljgqvewfmmcj.supabase.co/auth/v1/callback`
8. Clique em **Create**
9. **Copie** o **Client ID** e **Client Secret**

### 2.2. Configurar no Supabase

1. Acesse: https://supabase.com/dashboard/project/dixwysghljgqvewfmmcj/auth/providers
2. Encontre **"Google"** na lista
3. Clique em **Edit**
4. Enable: **✅ ON**
5. Cole o **Client ID** do Google
6. Cole o **Client Secret** do Google
7. Clique em **Save**

## 3. Criar Usuário Admin de Teste

Acesse: https://supabase.com/dashboard/project/dixwysghljgqvewfmmcj/auth/users

1. Clique em **"Add user"** → **"Create new user"**
2. **Email:** `admin@exemplo.com`
3. **Password:** `admin123`
4. **Auto Confirm User:** ✅ (marque esta opção)
5. **User Metadata (JSON):**
   ```json
   {
     "role": "admin"
   }
   ```
6. Clique em **Create user**

## 4. Variáveis de Ambiente

Já configurado no `.env`:
```
VITE_SUPABASE_URL="https://dixwysghljgqvewfmmcj.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGc..."
```

## 5. URLs de Callback

Após configurar o Google OAuth, adicione estas URLs no Supabase:

**Authentication → URL Configuration:**
- Site URL: `https://psicologobelohorizonte.com.br`
- Redirect URLs:
  - `http://localhost:5173/admin`
  - `https://psicologobelohorizonte.com.br/admin`
  - `http://localhost:5173/client`
  - `https://psicologobelohorizonte.com.br/client`

## Pronto! 🎉

Após seguir estes passos, você terá:
- ✅ Login com email/senha (sem confirmação no dev)
- ✅ Login com Google OAuth
- ✅ Roles (admin/client) configuradas via metadata
