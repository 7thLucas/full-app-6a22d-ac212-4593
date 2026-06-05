/**
 * AnchorFlow scripts CRUD routes.
 *
 * Auto-discovered by app/api/routes.ts (matches *.routes.ts). Mounted under /api.
 * Single-user app: no auth guard.
 *
 *   GET    /api/scripts        — list recent scripts (most recent first)
 *   GET    /api/scripts/:id    — fetch one script
 *   POST   /api/scripts        — create a script
 *   PUT    /api/scripts/:id    — update a script
 *   DELETE /api/scripts/:id    — delete a script
 */

import { Router, type Request, type Response } from "express";
import { createLogger } from "~/lib/logger";
import { ScriptModel } from "./scripts.model";

const logger = createLogger("ScriptsRoutes");
const router = Router();

function serialize(doc: any) {
  return {
    id: String(doc._id),
    title: doc.title ?? "",
    source_material: doc.source_material ?? "",
    generated_summary: doc.generated_summary ?? "",
    generated_script: doc.generated_script ?? "",
    language: doc.language ?? "English",
    tone: doc.tone ?? "Casual",
    duration: doc.duration ?? "1 minute",
    output_style: doc.output_style ?? "Anchor Script",
    estimated_reading_time: doc.estimated_reading_time ?? "",
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  };
}

const ALLOWED_FIELDS = [
  "title",
  "source_material",
  "generated_summary",
  "generated_script",
  "language",
  "tone",
  "duration",
  "output_style",
  "estimated_reading_time",
] as const;

function pickFields(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

router.get("/scripts", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const items = await ScriptModel.find().sort({ updatedAt: -1 }).limit(limit).lean();
    return res.json({ success: true, data: items.map(serialize) });
  } catch (error) {
    logger.error("GET /scripts failed", error);
    return res.status(500).json({ success: false, message: "Failed to list scripts" });
  }
});

router.get("/scripts/:id", async (req: Request, res: Response) => {
  try {
    const doc = await ScriptModel.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: "Script not found" });
    }
    return res.json({ success: true, data: serialize(doc) });
  } catch (error) {
    logger.error("GET /scripts/:id failed", error);
    return res.status(400).json({ success: false, message: "Invalid script id" });
  }
});

router.post("/scripts", async (req: Request, res: Response) => {
  try {
    const fields = pickFields(req.body ?? {});
    const doc = await ScriptModel.create(fields);
    return res.status(201).json({ success: true, data: serialize(doc) });
  } catch (error) {
    logger.error("POST /scripts failed", error);
    return res.status(500).json({ success: false, message: "Failed to create script" });
  }
});

router.put("/scripts/:id", async (req: Request, res: Response) => {
  try {
    const fields = pickFields(req.body ?? {});
    const doc = await ScriptModel.findByIdAndUpdate(
      req.params.id,
      { $set: fields },
      { new: true },
    ).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: "Script not found" });
    }
    return res.json({ success: true, data: serialize(doc) });
  } catch (error) {
    logger.error("PUT /scripts/:id failed", error);
    return res.status(400).json({ success: false, message: "Failed to update script" });
  }
});

router.delete("/scripts/:id", async (req: Request, res: Response) => {
  try {
    const doc = await ScriptModel.findByIdAndDelete(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: "Script not found" });
    }
    return res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    logger.error("DELETE /scripts/:id failed", error);
    return res.status(400).json({ success: false, message: "Failed to delete script" });
  }
});

export default router;
