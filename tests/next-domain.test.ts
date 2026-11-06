import { test } from "node:test";
import assert from "node:assert/strict";
import { validateUpload, validSignature } from "../lib/upload-validation";
import { isSameOrigin } from "../lib/request-security";
test("uploads reject incorrect formats, oversized files and spoofed signatures", () => {
  assert.ok(validateUpload("photo.png", "image/png", 11 * 1024 * 1024).error);
  assert.ok(validateUpload("script.html", "image/png", 100).error);
  assert.equal(
    validateUpload("clip.mp4", "video/mp4", 20 * 1024 * 1024).error,
    null,
  );
  assert.equal(
    validSignature(
      new TextEncoder().encode("<html>spoofed</html>"),
      "image/png",
    ),
    false,
  );
  assert.equal(
    validSignature(
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]),
      "image/png",
    ),
    true,
  );
});
test("CSRF compares browser origin with actual host behind a local reverse proxy", () => {
  assert.equal(
    isSameOrigin(
      new Request("http://localhost:3100/api/contact", {
        headers: { host: "127.0.0.1:3100", origin: "http://127.0.0.1:3100" },
      }),
    ),
    true,
  );
  assert.equal(
    isSameOrigin(
      new Request("http://localhost:3100/api/contact", {
        headers: { host: "127.0.0.1:3100", origin: "https://evil.test" },
      }),
    ),
    false,
  );
});
import {
  validatePayload,
  validateContact,
  safeHref,
  publicRow,
  modules,
  isPublished,
} from "../lib/domain.ts";
test("CMS validation rejects missing required fields and invalid URLs; never accepts ownership", () => {
  const result = validatePayload("projects", {
    slug: "Bad Slug",
    project_url: "javascript:alert(1)",
    owner_id: "attacker",
    created_by: "attacker",
  });
  assert.ok(result.errors.title);
  assert.ok(result.errors.slug);
  assert.ok(result.errors.project_url);
  assert.equal(result.payload.owner_id, undefined);
  assert.equal(result.payload.created_by, undefined);
});
test("valid case study values and intentional empty fields survive validation", () => {
  const result = validatePayload("projects", {
    title: "",
    slug: "test-project",
    summary: "",
    case_study: { problem: "Problem", solution: "Solution" },
  });
  assert.equal(result.payload.summary, "");
  assert.deepEqual(result.payload.case_study, {
    problem: "Problem",
    solution: "Solution",
  });
});
test("public projection excludes private columns and respects scheduled publication", () => {
  assert.equal(
    publicRow(
      { full_name: "Test", last_login_at: "private", email: "private" },
      modules.profile,
    ).last_login_at,
    undefined,
  );
  assert.equal(
    isPublished({ status: "published", published_at: "2999-01-01" }),
    false,
  );
  assert.equal(isPublished({ status: "draft" }), false);
});
test("URL and contact validation rejects injection and malformed submissions", () => {
  for (const url of [
    "//evil.test",
    "javascript:alert(1)",
    "/\\evil.test",
    "data:text/html,hi",
  ])
    assert.equal(safeHref(url), undefined);
  assert.equal(safeHref("/projects/test"), "/projects/test");
  assert.ok(
    validateContact({ name: "x", email: "bad", message: "short" }).errors.email,
  );
  assert.deepEqual(
    validateContact({
      name: "Test User",
      email: "test@example.test",
      message: "A valid isolated test message.",
      subject: "Lainnya",
    }).errors,
    {},
  );
});
