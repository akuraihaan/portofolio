import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TechnologyMap } from "../components/technology-map";
import { Detail } from "../components/portfolio";
import {
  visibleSections,
  selectVersion,
  sectionAnchor,
} from "../lib/presentation";
import { anchor } from "../lib/domain";
import type { Bundle } from "../lib/data";
const empty: Bundle = {
  settings: {},
  profile: null,
  collections: { sections: { data: [], error: null } },
};
test("server-rendered diagram only includes actual project technology relations", () => {
  const html = renderToStaticMarkup(
    createElement(TechnologyMap, {
      projects: [
        {
          id: "test-id",
          title: "Isolated project",
          slug: "isolated",
          technologies: ["TypeScript"],
        },
      ],
    }),
  );
  assert.ok(html.includes("TypeScript"));
  assert.ok(html.includes("/projects/isolated"));
  assert.ok(!html.includes("Python"));
  const decorative = renderToStaticMarkup(
    createElement(TechnologyMap, { projects: [] }),
  );
  assert.ok(decorative.includes('aria-hidden="true"'));
  assert.ok(!decorative.includes("TypeScript"));
});
test("empty sections collapse while query failures remain visible; legacy anchors normalize", () => {
  const b: Bundle = {
    ...empty,
    collections: {
      sections: {
        data: [
          { id: "1", section_key: "projects", title: "Projects" },
          { id: "2", section_key: "articles", title: "Articles" },
        ],
        error: null,
      },
      projects: { data: [], error: null },
      articles: { data: [], error: "Network unavailable" },
    },
  };
  assert.deepEqual(
    visibleSections(b).map((r) => r.id),
    ["2"],
  );
  assert.equal(anchor("top"), "hero");
  assert.equal(anchor("profile"), "about");
  assert.notEqual(
    sectionAnchor({ section_key: "featured_projects" }),
    sectionAnchor({ section_key: "projects" }),
  );
});
test("versions retain all chosen records, exclude unselected data and omit unselected social contact", () => {
  const b: Bundle = {
    ...empty,
    collections: {
      ...empty.collections,
      projects: {
        data: [
          { id: "one", title: "Selected" },
          { id: "two", title: "Not selected" },
        ],
        error: null,
      },
      social_links: {
        data: [{ id: "social", url: "https://example.test" }],
        error: null,
      },
    },
  };
  const result = selectVersion(b, {
    selected_projects: ["one"],
    show_contact: false,
  });
  assert.deepEqual(
    result.collections.projects.data.map((r) => r.id),
    ["one"],
  );
  assert.equal(result.collections.social_links.data.length, 0);
  assert.ok(
    result.collections.sections.data.some((r) => r.section_key === "projects"),
  );
  assert.equal(b.collections.projects.data.length, 2);
});
test("case studies render on the server with escaped user content and real links", () => {
  const html = renderToStaticMarkup(
    createElement(Detail, {
      bundle: empty,
      moduleKey: "projects",
      row: {
        id: "test-id",
        title: "Isolated case",
        slug: "isolated",
        description: "<script>unsafe()</script>",
        case_study: {
          problem: "Actual test problem",
          solution: "Actual test solution",
        },
        repository_url: "https://example.test/repo",
      },
    }),
  );
  assert.ok(html.includes("Actual test problem"));
  assert.ok(html.includes("Actual test solution"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>unsafe()"));
  assert.ok(html.includes("https://example.test/repo"));
});
