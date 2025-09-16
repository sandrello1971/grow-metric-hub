import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const authSchema = z.object({
  email: z.string().email('Inserisci un email valida'),
  password: z.string().min(6, 'La password deve avere almeno 6 caratteri'),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

type AuthForm = z.infer<typeof authSchema>;

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session:', session, 'Error:', error);
        if (session) {
          console.log('User already logged in, redirecting...');
          navigate('/business');
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (data: AuthForm) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting login with:', data.email);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      console.log('Login response:', { authData, error });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          setError('Email o password non corretti');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Conferma la tua email prima di accedere');
        } else {
          setError(`Errore di accesso: ${error.message}`);
        }
        return;
      }

      console.log('Login successful, user:', authData.user);
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto nella piattaforma business!",
      });

      navigate('/business');
    } catch (err) {
      console.error('Login exception:', err);
      setError('Errore durante l\'accesso');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: AuthForm) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting signup with:', data.email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      console.log('Signup response:', { authData, error });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('User already registered')) {
          setError('Utente già registrato. Prova ad accedere.');
        } else if (error.message.includes('Password should be')) {
          setError('La password deve essere più sicura');
        } else {
          setError(`Errore di registrazione: ${error.message}`);
        }
        return;
      }

      console.log('Signup successful, user:', authData.user);
      toast({
        title: "Registrazione completata",
        description: "Controlla la tua email per confermare l'account",
      });

      setMode('login');
    } catch (err) {
      console.error('Signup exception:', err);
      setError('Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: AuthForm) => {
    console.log('Form submitted with data:', data);
    console.log('Current mode:', mode);
    if (mode === 'login') {
      console.log('Calling handleLogin');
      handleLogin(data);
    } else {
      console.log('Calling handleSignup');
      handleSignup(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card shadow-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Business Platform
          </CardTitle>
          <p className="text-muted-foreground">
            Gestisci la tua attività con semplicità
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={mode} onValueChange={(value) => setMode(value as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Accedi</TabsTrigger>
              <TabsTrigger value="signup">Registrati</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="la-tua-email@esempio.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Password</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    onClick={() => console.log('Login button clicked')}
                  >
                    {loading ? 'Accesso in corso...' : 'Accedi'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="la-tua-email@esempio.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Password</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Conferma Password</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    onClick={() => console.log('Signup button clicked')}
                  >
                    {loading ? 'Registrazione in corso...' : 'Registrati'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}