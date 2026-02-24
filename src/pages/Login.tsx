import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../auth/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch {
      setError("Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-lg p-8">
        <div className="grid gap-7 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <section className="space-y-3">
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">PulseAPI</div>
            <h1 className="text-2xl font-semibold font-display">Acesso seguro</h1>
            <p className="text-sm text-white/60">
              Entre para visualizar o status dos monitores e alertas.
            </p>
          </section>
          <section>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  placeholder="email@dominio.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  placeholder="Sua senha"
                  autoComplete="current-password"
                />
              </div>
              {error ? <div className="text-sm text-rose-200">{error}</div> : null}
              <Button type="submit" loading={loading} className="w-full justify-center">
                Entrar
              </Button>
            </form>
            <div className="mt-6 text-sm text-white/60">
              Ainda não tem conta?{" "}
              <Link to="/register" className="text-cyan-200 hover:text-cyan-100">
                Criar acesso
              </Link>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default Login;
