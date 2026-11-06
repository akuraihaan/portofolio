import test from "node:test";
import assert from "node:assert/strict";
import {
  explore,
  readFilters,
  filterHref,
  safeReturnPath,
} from "../lib/explorer";
import { validateContact } from "../lib/domain";
import { sectionAnchor } from "../lib/presentation";
import { articleBlocks } from "../components/article-content";
const rows = Array.from({ length: 26 }, (_, index) => ({
  id: String(index),
  title: `Project ${index}`,
  category: index % 2 ? "Cloud" : "Web",
  technologies: [index % 3 ? "TypeScript" : "PHP"],
}));
test("combined filters, pagination and returning from detail preserve the selected result set", () => {
  const filters = readFilters(
    new URLSearchParams("category=Web&technology=TypeScript&page=2"),
  );
  const found = explore(rows, filters);
  assert.equal(found.total, 8);
  assert.equal(found.page, 1);
  assert.ok(
    found.rows.every(
      (row) =>
        row.category === "Web" && row.technologies.includes("TypeScript"),
    ),
  );
  assert.equal(
    explore(rows, readFilters(new URLSearchParams("page=2"))).rows[0].id,
    "12",
  );
  assert.equal(
    explore(rows, readFilters(new URLSearchParams("page=999"))).page,
    3,
  );
  assert.equal(readFilters(new URLSearchParams("page=Infinity")).page, 1);
  assert.deepEqual(
    readFilters(
      new URLSearchParams(filterHref("/projects", filters).split("?")[1]),
    ),
    filters,
  );
  assert.equal(safeReturnPath("https://evil.test", "projects"), "/projects");
  assert.equal(
    safeReturnPath("/projects?category=Web", "projects"),
    "/projects?category=Web",
  );
});
test("contact boundaries match the PRD and reject unlisted topics", () => {
  const data = {
    name: "Test Sender",
    email: "test@example.test",
    subject: "Pekerjaan",
    message: "x".repeat(20),
  };
  assert.deepEqual(validateContact(data).errors, {});
  assert.ok(validateContact({ ...data, name: "x".repeat(101) }).errors.name);
  assert.ok(
    validateContact({ ...data, message: "x".repeat(19) }).errors.message,
  );
  assert.ok(
    validateContact({ ...data, subject: "Arbitrary topic" }).errors.subject,
  );
  assert.ok(validateContact({ ...data, website: "spam" }).errors.website);
});
test("article structure preserves code and unique heading anchors without executing markup", () => {
  const blocks = articleBlocks(
    "## Same\n\nText\n\n## Same\n```html\n<script>danger()</script>\n```",
  );
  assert.equal(blocks.filter((row) => row.kind === "heading").length, 2);
  assert.notEqual(blocks[0].id, blocks[2].id);
  assert.equal(blocks[3].text, "<script>danger()</script>");
});
test("contact and collaboration anchors do not collide", () => {
  assert.notEqual(
    sectionAnchor({ section_key: "contact" }),
    sectionAnchor({ section_key: "cta" }),
  );
});
