/**
 * Client-side API for the AnchorFlow scripts CRUD endpoints.
 */

import { apiGet, apiRequest } from "~/lib/api.client";
import type { ScriptRecord } from "./scripts.types";

export async function listScripts(): Promise<ScriptRecord[]> {
  const res = await apiGet<ScriptRecord[]>("/api/scripts");
  if (!res.success || !res.data) return [];
  return res.data;
}

export async function getScript(id: string): Promise<ScriptRecord | null> {
  const res = await apiGet<ScriptRecord>(`/api/scripts/${id}`);
  if (!res.success || !res.data) return null;
  return res.data;
}

export async function createScript(
  payload: Partial<ScriptRecord>,
): Promise<ScriptRecord> {
  const res = await apiRequest<ScriptRecord>("/api/scripts", {
    method: "POST",
    data: payload,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to save script");
  }
  return res.data;
}

export async function updateScript(
  id: string,
  payload: Partial<ScriptRecord>,
): Promise<ScriptRecord> {
  const res = await apiRequest<ScriptRecord>(`/api/scripts/${id}`, {
    method: "PUT",
    data: payload,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to update script");
  }
  return res.data;
}

export async function deleteScript(id: string): Promise<void> {
  const res = await apiRequest(`/api/scripts/${id}`, { method: "DELETE" });
  if (!res.success) {
    throw new Error(res.message ?? "Failed to delete script");
  }
}

/**
 * Upload a source document (PDF/DOCX/TXT/transcript) through the uploader
 * scaffold. Returns the stored file metadata. Used to persist a reference to
 * the uploaded source alongside the generated script.
 */
export async function uploadSourceDocument(file: File): Promise<{
  url: string;
  path: string;
  originalname: string;
}> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/uploader/document", {
    method: "POST",
    body: form,
  });
  const json = (await res.json()) as {
    success?: boolean;
    message?: string;
    data?: { url: string; path: string; originalname: string };
  };
  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Failed to upload document");
  }
  return json.data;
}
