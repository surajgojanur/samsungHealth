import { UploadPanel } from "@/components/upload/UploadPanel";

export default function UploadPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Analyze your Samsung Health export</h1>
        <p className="mt-2 text-muted-foreground">
          Your data stays here. HealthLens processes your files directly in your browser. No cloud, no tracking, no server upload by default.
        </p>
      </div>
      <UploadPanel />
    </div>
  );
}
