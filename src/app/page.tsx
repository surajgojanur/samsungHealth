import Link from "next/link";
import { ArrowRight, FileArchive, FileText, Lock, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="space-y-12">
      <section className="grid min-h-[72vh] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-6">
          <div className="inline-flex rounded-md border bg-card px-3 py-1 text-sm text-muted-foreground">Private Mode: files stay on your device.</div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-normal md:text-6xl">Turn your Samsung Health export into clear private health insights.</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            HealthLens parses Samsung Health ZIPs locally, builds a wellness dashboard, lets you add symptoms, and creates a doctor-friendly report without uploading raw health data.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/upload">
                Analyze my export
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard">Try sample dashboard</Link>
            </Button>
          </div>
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
              <p className="text-sm">No raw upload by default. IndexedDB storage only after explicit consent.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

