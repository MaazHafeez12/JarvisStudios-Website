// Renders a schema.org graph as a JSON-LD script tag. Server component —
// this is inert data, and none of it belongs in the client bundle.
//
// ON THE ESCAPING. `JSON.stringify` output is dropped into an HTML `<script>`
// element, where the parser is looking for `</script` and does not care that
// it is inside a JSON string. A value containing that sequence would close
// the tag early and spill the rest of the graph into the document as markup.
// Escaping `<` as its < form is the standard fix and is invisible to any
// JSON parser, which decodes the escape back to the original character.
//
// Today every value comes from content/ and is studio-authored, so this is a
// precaution rather than a live hole. It stays because the day someone pipes
// a lead's company name or a future CMS field into a graph, the escaping
// needs to already be here rather than be remembered.
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
