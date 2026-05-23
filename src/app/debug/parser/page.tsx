"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthStore } from "@/store/healthStore";

export default function ParserDebugPage() {
  const importResult = useHealthStore((state) => state.importResult);
  const debugMode = useHealthStore((state) => state.debugMode);

  if (!debugMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Parser Debug</CardTitle>
          <CardDescription>Enable parser debug in settings to inspect masked parser details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/settings">Open settings</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Parser Debug</h1>
        <p className="mt-2 text-muted-foreground">Masked file-level parser state. Raw sensitive values are hidden.</p>
      </div>
      {!importResult ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">No parsed export yet.</CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>File name, category, row counts, sidecar joins, warnings, and errors.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-2 pr-3">File</th>
                    <th className="py-2 pr-3">Category</th>
                    <th className="py-2 pr-3">Confidence</th>
                    <th className="py-2 pr-3">Rows</th>
                    <th className="py-2 pr-3">Parsed</th>
                    <th className="py-2 pr-3">Skipped</th>
                    <th className="py-2 pr-3">Warnings</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importResult.report.inventory.map((item) => (
                    <tr key={item.path} className="border-b last:border-0">
                      <td className="py-2 pr-3">{item.fileName}</td>
                      <td className="py-2 pr-3">{item.category}</td>
                      <td className="py-2 pr-3">{item.confidence}</td>
                      <td className="py-2 pr-3">{item.rowCount ?? 0}</td>
                      <td className="py-2 pr-3">{item.parsedCount ?? 0}</td>
                      <td className="py-2 pr-3">{item.skippedCount ?? 0}</td>
                      <td className="py-2 pr-3">{item.warnings.length}</td>
                      <td className="py-2">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Masked normalized preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(importResult.debugPreview ?? [], null, 2)}</pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

