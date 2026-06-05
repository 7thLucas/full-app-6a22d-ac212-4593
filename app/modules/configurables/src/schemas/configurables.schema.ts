/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 160,
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "generatorHeading",
      type: "string",
      required: false,
      label: "Generator Heading",
      maxLength: 120,
    },
    {
      fieldName: "generatorSubheading",
      type: "string",
      required: false,
      label: "Generator Subheading",
      maxLength: 200,
    },
    {
      fieldName: "inputPlaceholder",
      type: "string",
      required: false,
      label: "Paste Input Placeholder",
      maxLength: 200,
    },
    {
      fieldName: "generateButtonLabel",
      type: "string",
      required: false,
      label: "Generate Button Label",
      maxLength: 60,
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
      maxLength: 200,
    },
    {
      fieldName: "defaultLanguage",
      type: "enum",
      required: false,
      label: "Default Language",
      options: ["English", "Bahasa Indonesia"],
    },
    {
      fieldName: "defaultTone",
      type: "enum",
      required: false,
      label: "Default Tone",
      options: ["Casual", "Business News", "Formal News"],
    },
    {
      fieldName: "defaultDuration",
      type: "enum",
      required: false,
      label: "Default Duration",
      options: ["30 seconds", "1 minute", "2 minutes", "3 minutes"],
    },
    {
      fieldName: "defaultOutputStyle",
      type: "enum",
      required: false,
      label: "Default Output Style",
      options: ["Anchor Script", "Short Brief", "Opening Monologue"],
    },
    {
      fieldName: "aiSystemPrompt",
      type: "string",
      required: false,
      label: "AI System Prompt",
      maxLength: 2000,
    },
  ],
};