import { UploadPanel } from "@/components/upload/UploadPanel";

export default function UploadPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Upload</h1>
        <p className="mt-2 text-muted-foreground">Analyze a Samsung Health export locally. Images are ignored by default.</p>
      </div>
      <UploadPanel />
    </div>
  );
}

