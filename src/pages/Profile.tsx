import AppLayout from "../layouts/AppLayout";
import Button from "../components/Button";
import Card from "../components/Card";
import PageSection from "../components/PageSection";
import { useAuth } from "../auth/useAuth";

const Profile = () => {
  const { user, logout } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  return (
    <AppLayout
      title="Profile"
      subtitle="Configurações e informações da conta"
      breadcrumb="Profile / Settings"
    >
      <div className="space-y-5">
        <PageSection title="Conta" description="Dados da sessão autenticada">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Conta">
              <div className="space-y-3 text-sm text-white/70">
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/40">Email</div>
                  <div className="text-white">{user?.email}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/40">Role</div>
                  <div className="text-white">{user?.role}</div>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </Card>
            <Card title="API Base URL">
              <div className="text-sm text-white/70">
                A aplicação está consumindo a API em:
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                  {apiBaseUrl}
                </div>
              </div>
            </Card>
          </div>
        </PageSection>
      </div>
    </AppLayout>
  );
};

export default Profile;
