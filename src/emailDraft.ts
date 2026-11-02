/** Mailto opens the visitor's own email app; it never submits or sends a message. */
export function createEmailDraft(
  recipient: string,
  fields: Record<string, string>,
): string {
  if (!/^[^@\s?&#:]+@[^@\s?&#:]+\.[^@\s?&#:]+$/.test(recipient.trim()))
    throw new Error("A valid business email is required.");
  const subject =
    `FSGM Advisory inquiry${fields.organization ? `: ${fields.organization}` : ""}`.replace(
      /[\r\n]+/g,
      " ",
    );
  const body = [
    `Organization: ${fields.organization || ""}`,
    `Contact: ${fields.name || ""}`,
    `Email: ${fields.email || ""}`,
    `Phone: ${fields.phone || "Not provided"}`,
    `Organization type: ${fields.type || ""}`,
    `Assistance needed: ${fields.assistance || ""}`,
    "",
    fields.message || "",
  ].join("\r\n");
  return `mailto:${recipient.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
