import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { ArrowRight, CheckCircle2, LayoutGrid, Users, Zap, Shield } from 'lucide-react';

const Home = () => {
  const token = useAuthStore((s) => s.token);
  return (
    <div className="min-h-screen bg-background bg-mesh">
      <header className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <LayoutGrid className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">TMS</span>
        </div>
        <nav className="flex items-center gap-2">
          {token ? (
            <Button asChild><Link to="/dashboard">Open dashboard <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/login">Log in</Link></Button>
              <Button asChild><Link to="/register">Get started</Link></Button>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="container pt-20 pb-24 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Built for modern product teams
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Ship work that <span className="text-gradient">actually moves</span> the needle.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            TMS is the calm, fast project & task manager your team will actually use.
            Plan projects, assign tasks, and track progress — without the bloat.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="h-12 px-6 shadow-elegant">
              <Link to={token ? '/projects' : '/register'}>
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-6">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {['No credit card', 'Free for small teams', 'Cancel anytime'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" /> {t}
              </div>
            ))}
          </div>
        </section>

        <section className="container pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: LayoutGrid, title: 'Organized projects', desc: 'Group tasks by project. Keep context tight, scope tighter.' },
              { icon: Users, title: 'Team collaboration', desc: 'Invite members, assign owners, and ship together.' },
              { icon: Zap, title: 'Lightning fast', desc: 'Built on a modern stack. No spinners, no waiting around.' },
              { icon: Shield, title: 'Secure by default', desc: 'JWT auth, role-based access, your data stays yours.' },
              { icon: CheckCircle2, title: 'Status that flows', desc: 'To Do → In Progress → Done. Drag-free, click-light.' },
              { icon: ArrowRight, title: 'Built to scale', desc: 'Pagination, filtering, and search baked in from day one.' },
            ].map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-smooth"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-smooth">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container pb-24">
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 md:p-16 text-center shadow-elegant">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to get organized?
              </h2>
              <p className="mt-3 text-primary-foreground/85 max-w-xl mx-auto">
                Create your workspace in under 30 seconds. Your team will thank you.
              </p>
              <Button size="lg" variant="secondary" asChild className="mt-8 h-12 px-6">
                <Link to={token ? '/projects' : '/register'}>
                  Get started free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} TMS. All rights reserved.</span>
          <span>Built with care.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
