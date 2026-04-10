/**
 * Serialize a value for embedding in HTML (e.g. `type="application/json"` script bodies).
 * Escapes `<` so `</script>` cannot appear inside string values and break the parser.
 */
export function serializeJsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
