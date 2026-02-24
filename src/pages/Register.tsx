import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../auth/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Informe email e senha.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter ao menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password);
      navigate("/dashboard");
    } catch {
      setError("Não foi possível criar a conta.");
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
            <h1 className="text-2xl font-semibold font-display">Criar conta</h1>
            <p className="text-sm text-white/60">
              Crie um acesso para começar a monitorar endpoints.
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
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
              </div>
              {error ? <div className="text-sm text-rose-200">{error}</div> : null}
              <Button type="submit" loading={loading} className="w-full justify-center">
                Criar conta
              </Button>
            </form>
            <div className="mt-6 text-sm text-white/60">
              Já tem conta?{" "}
              <Link to="/login" className="text-cyan-200 hover:text-cyan-100">
                Fazer login
              </Link>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default Register;
