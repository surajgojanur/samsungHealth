import { CheckCircle2, EyeOff, Lock, ServerOff, ShieldCheck, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const privacyPoints = [
  { 
    icon: ServerOff, 
    title: "Local-First Processing", 
    text: "Your files are processed entirely inside your browser. You can even disconnect your internet after loading the app; it will still work." 
  },
  { 
    icon: EyeOff, 
    title: "No Server Uploads", 
    text: "We never see your raw health files. They stay on your device and are parsed by your browser's own engine." 
  },
  { 
    icon: ShieldCheck, 
    title: "No Account Needed", 
    text: "Start analyzing immediately. We don't want your name, email, or phone number. You are anonymous to us." 
  },
  { 
    icon: Lock, 
    title: "Encrypted Storage", 
    text: "If you choose to 'Remember this analysis', data is stored in your browser's local database (IndexedDB), not in the cloud." 
  },
  { 
    icon: Trash2, 
    title: "Full Control", 
    text: "Delete your data at any time with one click. This clears everything from your browser's memory." 
  },
  { 
    icon: CheckCircle2, 
    title: "Open Source", 
    text: "Our code is public. Anyone can audit how we handle data to ensure we keep our promises." 
  }
];

export default function PrivacyPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="max-w-3xl space-y-4">
        <Badge tone="good" className="rounded-full px-4 py-1">Privacy First</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy is our foundation.</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          HealthLens was built because we believe health data is the most sensitive information you own. 
          Here is exactly how we protect it.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {privacyPoints.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-none bg-slate-50 shadow-none dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm dark:bg-slate-800">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.text}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-3xl bg-primary/5 p-8 md:p-12 dark:bg-primary/10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Deep Dive: Data Masking</h2>
            <p className="text-muted-foreground">
              Even though data stays local, we still apply "Data Masking" to ensure that if you ever show your 
              screen or export a report, sensitive identifiers are removed.
            </p>
            <ul className="grid gap-3 text-sm">
              {[
                "Account IDs and Emails are removed",
                "Device serial numbers are masked",
                "Exact GPS locations are rounded or excluded",
                "Personal comments and notes are optional",
                "Profile images are never loaded"
              ].map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="border-none shadow-xl">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Technical Safeguards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 text-sm font-medium">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">File Types</span>
                <span>.csv, .json only</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">JS Execution</span>
                <span>Sandbox Worker</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Network Requests</span>
                <span>None (Local-only)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Persistence</span>
                <span>Opt-in IndexedDB</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="text-center space-y-4">
        <h3 className="text-xl font-bold">Questions about your privacy?</h3>
        <p className="text-muted-foreground">
          HealthLens is an open-source project. You can inspect our security model on GitHub.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline" className="rounded-full">
            <a href="https://github.com/surajgojanur/samsungHealth/blob/main/PRIVACY_MODEL.md" target="_blank" rel="noreferrer">
              Detailed Privacy Model
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
