---
type: "query"
date: "2026-06-18T11:51:29.406Z"
question: "What is LanguageCode and why does it connect 13 communities?"
contributor: "graphify"
source_nodes: ["LanguageCode", "SUPPORTED_LANGUAGES"]
---

# Q: What is LanguageCode and why does it connect 13 communities?

## Answer

LanguageCode is a one-line derived union type in src/shared/constants.ts (line 35): type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number], i.e. the union en|el|es|fr|de|tr|ar derived from the SUPPORTED_LANGUAGES tuple. It has degree 20: 19 files import it plus 1 contains edge from constants.ts. Unlike useScreenAirConsole.ts (a hub by fan-OUT, importing from 11 communities), LanguageCode is a hub by fan-IN: it imports nothing and is a pure leaf type that nearly every controller view, screen phase, and both AirConsole hooks depend on. Its high betweenness is healthy - it is a shared vocabulary/contract type, the localization spine. This is the textbook good kind of god-node: a stable, dependency-free type at the bottom of the import graph. No refactor needed.

## Source Nodes

- LanguageCode
- SUPPORTED_LANGUAGES