import Link from "next/link";
import { ArrowRight, BarChart3, FileArchive, FileText, Github, HeartPulse, Lock, Microscope, ShieldCheck, Sparkles, Stethoscope, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="space-y-14">
      <section className="grid min-h-[72vh] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="good">Processed locally in your browser</Badge>
            <Badge>For personal tracking and doctor discussion only</Badge>
          </div>
          <div>
            <p className="text-lg font-semibold">HealthLens</p>
            <p className="text-sm text-muted-foreground">Samsung Health Insights</p>
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-normal md:text-6xl">Turn your Samsung Health export into private, understandable insights.</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Upload your Samsung Health export ZIP or folder and get a local-first dashboard, plain-language insights, symptom patterns, data-quality checks, and a doctor-ready summary — without sending your raw health files to a server.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/upload">
                Analyze my export
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/demo">View sample dashboard</Link>
            </Button>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">HealthLens is an independent open-source project and is not affiliated with Samsung.</p>
        </div>
        <div className="grid gap-3">
          {[
            { icon: FileArchive, title: "1. Export Samsung Health data", text: "Use Samsung Health personal data export from your phone." },
            { icon: UploadCloud, title: "2. Upload ZIP/folder", text: "ZIP, folder, or manual CSV/JSON selection, all parsed in-browser." },
            { icon: FileText, title: "3. Get dashboard and doctor report", text: "Trends, data quality, symptoms, and exportable reports." }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.text}</CardContent>
              </Card>
            );
          })}
          <Card className="border-primary/30">
            <CardContent className="flex items-center gap-3 p-5">
              <Lock className="h-5 w-5 text-primary" />
              <p className="text-sm">Your files are processed inside your browser. No cloud account. No server upload by default. No tracking by default.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Section title="What you get">
        {[
          { icon: Sparkles, title: "Health Story", text: "A calm summary of the strongest patterns, improvements, limitations, and doctor discussion points." },
          { icon: Microscope, title: "Insight Hub", text: "Plain-English trend, baseline, outlier, symptom, and data-quality insights with confidence labels." },
          { icon: BarChart3, title: "Symptom Pattern Timeline", text: "Optional local symptom logs compared with sleep, activity, heart rate, workouts, and SpO2 trends." },
          { icon: Stethoscope, title: "Doctor-Ready Summary", text: "A masked, practical report for appointments and personal notes." },
          { icon: ShieldCheck, title: "Data Quality Report", text: "Readable coverage, missing-category, sparse-data, and parser warning summaries." },
          { icon: Lock, title: "Private Local Processing", text: "No account, no tracking by default, and IndexedDB storage only after consent." }
        ].map((item) => (
          <FeatureCard key={item.title} {...item} />
        ))}
      </Section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Privacy promise</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            Your files are processed inside your browser. No cloud account. No server upload by default. No tracking by default.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demo mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Open a fake-data demo before uploading personal data. It includes a Health Story, Insight Hub, symptom patterns, data quality, and doctor report preview.</p>
            <Button asChild variant="secondary">
              <Link href="/demo">Open fake-data demo</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-md border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Open source and transparent</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Local-first, TypeScript, Next.js, privacy-first, built for learning and transparency, and GitHub-ready for parser and insight contributions.
            </p>
          </div>
          <Github className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-muted-foreground">{text}</CardContent>
    </Card>
  );
}
