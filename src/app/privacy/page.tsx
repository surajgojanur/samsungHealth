import { Lock, ServerOff, ShieldCheck, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  { icon: ServerOff, title: "Local-first", text: "Your files are processed entirely inside your browser. You can disconnect from the internet after loading the app, and local analysis will still work." },
  { icon: Lock, title: "No server upload by default", text: "Raw Samsung Health files are not sent to a server by default." },
  { icon: ShieldCheck, title: "No account required", text: "HealthLens does not require a cloud account for local analysis." },
  { icon: ShieldCheck, title: "No tracking by default", text: "The app does not include analytics tracking by default." },
  { icon: Lock, title: "IndexedDB only after consent", text: "Remember this analysis on this browser is unchecked by default." },
  { icon: ShieldCheck, title: "Masked outputs", text: "Names, emails, account IDs, device IDs, UUIDs, locations, comments, and images are masked or excluded." },
  { icon: Trash2, title: "Reset anytime", text: "Delete local analysis clears uploaded data, normalized records, parser summaries, symptoms, and local settings from this browser." }
];

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Privacy and trust</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Your files are processed entirely inside your browser. You can disconnect from the internet after loading the app, and local analysis will still work.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Security controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          <p>Allowed extensions: .csv and .json. JPG images are skipped unless image support is explicitly enabled.</p>
          <p>Rejected content: executable files, HTML files, absolute paths, and path traversal entries.</p>
          <p>ZIP protections: compressed-size limit, uncompressed-size limit, file-count limit, and compression-ratio warning.</p>
          <p>Raw rows are not kept in app state after normalization unless parser debug mode is enabled.</p>
        </CardContent>
      </Card>
    </div>
  );
}
