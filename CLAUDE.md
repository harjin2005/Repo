@AGENTS.md

# Skills (MANDATORY — Invoke on Time, Never Skip)

Skills live at `c:/Users/harji/.claude/skills/`. Invoke via the Skill tool.

| When | Skill to invoke |
|------|----------------|
| Building ANY frontend component, page, or UI | `frontend-design` |
| Before any multi-step task (3+ files) | `writing-plans` |
| Working through a written plan | `executing-plans` |
| ANY feature implementation | `test-driven-development` |
| ANY bug, test failure, unexpected behavior | `systematic-debugging` |
| 2+ independent tasks that can run in parallel | `dispatching-parallel-agents` |
| Before claiming any feature is done | `verification-before-completion` |
| After completing a major feature | `requesting-code-review` |
| Acting on code review feedback | `receiving-code-review` |

**Rule:** If task matches a skill above → invoke it BEFORE starting work. Never build first, skill later.
