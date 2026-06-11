import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, CheckCircle2, FileArchive, FileText, Github, HeartPulse, Lock, Microscope, ShieldCheck, Sparkles, Stethoscope, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/50 px-3 py-1 text-sm font-medium backdrop-blur-sm dark:bg-slate-950/50">
              <Badge tone="good" className="rounded-full">Private</Badge>
              <span className="text-muted-foreground">Processed locally in your browser</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                Unlock your <span className="text-primary">Samsung Health</span> data.
              </h1>
              <p className="max-w-xl text-xl leading-relaxed text-muted-foreground">
                Upload your Samsung Health export and get private health insights, symptom patterns, and doctor-ready reports. No server upload. No account required.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-14 rounded-full px-8 text-lg shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Link href="/upload">
                  Analyze My Export
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full px-8 text-lg transition-all hover:bg-muted">
                <Link href="/demo">Try Demo</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Local-first</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Open Source</span>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-10">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-secondary/20 blur-2xl" />
            <Card className="relative overflow-hidden border-2 shadow-2xl">
              <div className="bg-muted/50 p-4 border-b">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
              </div>
              <CardContent className="p-0">
                <Image 
                  src="/docs/assets/overview.png" 
                  alt="HealthLens Dashboard Preview" 
                  width={800}
                  height={500}
                  className="w-full object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl">Get insights in 4 simple steps</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            No technical skills needed. Just follow these steps to turn your raw Samsung Health files into a meaningful health story.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { step: 1, icon: HeartPulse, title: "Export Data", text: "Open Samsung Health on your phone and export your personal data." },
            { step: 2, icon: FileArchive, title: "Upload ZIP", text: "Drop your export ZIP or folder into HealthLens. It stays in your browser." },
            { step: 3, icon: Sparkles, title: "View Insights", text: "See trends, sleep patterns, and data quality checks in plain English." },
            { step: 4, icon: Stethoscope, title: "Doctor Report", text: "Download a clean, masked summary for your next appointment." }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="group relative space-y-4 rounded-2xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                  {item.step}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why HealthLens */}
      <section className="rounded-3xl bg-slate-900 px-6 py-16 text-white dark:bg-slate-950 sm:px-12 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Your health data is <span className="text-primary">none of our business.</span></h2>
            <p className="text-lg text-slate-300">
              Most health apps want your data in the cloud. We don't. HealthLens is built on a "local-first" philosophy. Your sensitive health files never leave your computer.
            </p>
            <ul className="space-y-4">
              {[
                "No account or login required",
                "Raw health files are processed in-browser",
                "No cloud tracking or hidden analytics",
                "100% Open source and transparent"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="secondary" size="lg" className="rounded-full">
              <Link href="/privacy">Read our Privacy Promise</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: "Secure", text: "Bank-level privacy through local processing." },
              { icon: Lock, title: "Private", text: "No servers means no data breaches." },
              { icon: BarChart3, title: "Powerful", text: "Advanced analytics without the privacy cost." },
              { icon: Microscope, title: "Accurate", text: "Direct parsing of original Samsung Health CSVs." }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6">
                <item.icon className="mb-4 h-8 w-8 text-primary" />
                <h4 className="mb-2 font-bold">{item.title}</h4>
                <p className="text-sm text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to understand your health</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            HealthLens analyzes your Samsung Health export to find patterns you might miss.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: Sparkles, title: "Health Story", text: "A plain-English summary of your strongest patterns, improvements, and discussion points." },
            { icon: Microscope, title: "Insight Hub", text: "Trend, baseline, and outlier detection with confidence labels for every health category." },
            { icon: BarChart3, title: "Symptom Timeline", text: "Compare your local symptom logs with sleep, activity, heart rate, and workouts." },
            { icon: Stethoscope, title: "Doctor-Ready Summary", text: "A practical, masked report designed for clinical appointments or personal notes." },
            { icon: ShieldCheck, title: "Data Quality Audit", text: "See which categories have enough data for high-confidence insights." },
            { icon: Lock, title: "No Account Required", text: "Start analyzing immediately. We don't need your email or phone number." }
          ].map((item) => (
            <Card key={item.title} className="border-none bg-slate-50 shadow-none dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm dark:bg-slate-800">
                  <item.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Common questions about HealthLens and Samsung Health data.</p>
        </div>

        <div className="grid gap-6">
          {[
            {
              q: "Is my data uploaded to any server?",
              a: "No. HealthLens uses 'in-browser' parsing. When you drop a file, your browser reads it locally. No health data is sent to our servers or any third parties."
            },
            {
              q: "How do I export Samsung Health data?",
              a: "Open Samsung Health on your phone > Settings > Download personal data. You'll receive a ZIP file containing your health records."
            },
            {
              q: "Is this medical advice?",
              a: "No. HealthLens is a data visualization and pattern detection tool. It is intended for personal tracking and to facilitate discussions with your doctor. Always consult a medical professional for health concerns."
            },
            {
              q: "Can I try it without uploading my own data?",
              a: "Yes! Click the 'Try Demo' button at the top to see how HealthLens works with sample data."
            },
            {
              q: "What data types are supported?",
              a: "We support steps, sleep, heart rate, workouts, SpO2, stress, water, nutrition, and body metrics exported from Samsung Health."
            }
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border bg-card p-6">
              <h3 className="mb-2 text-lg font-bold">{item.q}</h3>
              <p className="text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="text-center space-y-8 rounded-[3rem] bg-primary/5 py-16 dark:bg-primary/10">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to see your health story?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of users who analyze their Samsung Health data privately.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-10">
            <Link href="/upload">Analyze My Export</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="rounded-full px-10">
            <Link href="https://github.com/surajgojanur/samsungHealth" target="_blank">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          HealthLens is an independent open-source project and is not affiliated with Samsung.
        </p>
      </section>
    </div>
  );
}
