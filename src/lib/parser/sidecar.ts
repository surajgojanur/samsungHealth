export interface VirtualTextFile {
  path: string;
  fileName: string;
  size: number;
  text?: string;
}

export class SidecarResolver {
  private byFileName = new Map<string, VirtualTextFile[]>();
  private parsed = new Map<string, unknown>();

  constructor(files: VirtualTextFile[]) {
    for (const file of files) {
      const list = this.byFileName.get(file.fileName) ?? [];
      list.push(file);
      this.byFileName.set(file.fileName, list);
    }
  }

  resolve(tableName: string | undefined, reference: unknown): VirtualTextFile | undefined {
    if (!reference || typeof reference !== "string") return undefined;
    const candidates = this.byFileName.get(reference) ?? [];
    if (candidates.length === 0) return undefined;
    if (!tableName) return candidates[0];
    const direct = candidates.find((file) => file.path.includes(`/jsons/${tableName}/`));
    return direct ?? candidates[0];
  }

  parse(tableName: string | undefined, reference: unknown): unknown | undefined {
    const file = this.resolve(tableName, reference);
    if (!file?.text) return undefined;
    if (this.parsed.has(file.path)) return this.parsed.get(file.path);
    try {
      const parsed = JSON.parse(file.text);
      this.parsed.set(file.path, parsed);
      return parsed;
    } catch {
      return undefined;
    }
  }
}

