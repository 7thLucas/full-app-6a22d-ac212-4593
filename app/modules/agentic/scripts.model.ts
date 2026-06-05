import mongoose, { type Document, type Model, Schema } from "mongoose";

/**
 * AnchorFlow `scripts` table.
 *
 * Single-user app — no ownership/attribution fields. One row per generated
 * anchor script. Stored in Mongo via the host app's existing connection.
 */
export interface ScriptDoc extends Document {
  title: string;
  source_material: string;
  generated_summary: string;
  generated_script: string;
  language: string;
  tone: string;
  duration: string;
  output_style: string;
  estimated_reading_time: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScriptSchema = new Schema<ScriptDoc>(
  {
    title: { type: String, default: "" },
    source_material: { type: String, default: "" },
    generated_summary: { type: String, default: "" },
    generated_script: { type: String, default: "" },
    language: { type: String, default: "English" },
    tone: { type: String, default: "Casual" },
    duration: { type: String, default: "1 minute" },
    output_style: { type: String, default: "Anchor Script" },
    estimated_reading_time: { type: String, default: "" },
  },
  { timestamps: true, collection: "tbl_scripts" },
);

export const ScriptModel: Model<ScriptDoc> =
  (mongoose.models.Script as Model<ScriptDoc>) ||
  mongoose.model<ScriptDoc>("Script", ScriptSchema);
