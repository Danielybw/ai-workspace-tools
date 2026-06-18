# Task Group: WeKnora offline infrastructure

scope: Docker deployment diagnostics (disk full, login errors), knowledge base sync integration plan, permission proxy architecture, multi-KB search comparison, Feishu wiki upload of plans
applies_to: cwd=/Users/yubangwang/Desktop/AI Engineering/weknora-offline; reuse_rule=safe to reuse for any WeKnora infrastructure or HRLINK integration task in this project

## Task 1: Diagnose and fix WeKnora login failure

### rollout_summary_files
- 2026-06-08T11-44-25-RUTJ-weknora_login_fix_integration_plan_permission_flowcharts.md (cwd=/Users/yubangwang/Desktop/AI Engineering/weknora-offline, rollout_path=/Users/yubangwang/.codex/sessions/2026/06/08/rollout-2026-06-08T19-44-25-019ea70c-5b3e-7583-9d18-aa2ff75f6537.jsonl, updated_at=2026-06-12T02:45:24+00:00, thread_id=019ea70c-5b3e-7583-9d18-aa2ff75f6537)

### keywords
- WeKnora, login fix, docker log rotation, disk full, sshpass, PostgreSQL, no space left on device, bcrypt, daemon.json, logrotate

## Task 2: Produce HRLINK-WeKnora knowledge base sync integration plan

### rollout_summary_files
- 2026-06-08T11-44-25-RUTJ-weknora_login_fix_integration_plan_permission_flowcharts.md (cwd=/Users/yubangwang/Desktop/AI Engineering/weknora-offline, updated_at=2026-06-12T02:45:24+00:00, thread_id=019ea70c-5b3e-7583-9d18-aa2ff75f6537)

### keywords
- WeKnora, HRLINK, knowledge base sync, REST API proxy, hybrid search, file upload, Feishu wiki, lark-cli, integration plan 

## Task 3: Discuss WeKnora permissions and draw Excalidraw flowcharts

### rollout_summary_files
- 2026-06-08T11-44-25-RUTJ-weknora_login_fix_integration_plan_permission_flowcharts.md (cwd=/Users/yubangwang/Desktop/AI Engineering/weknora-offline, updated_at=2026-06-12T02:45:24+00:00, thread_id=019ea70c-5b3e-7583-9d18-aa2ff75f6537)

### keywords
- WeKnora, permission proxy, Excalidraw, flowchart, role permission, multi-KB search

## Task 4: Create multi-KB search comparison document

### rollout_summary_files
- 2026-06-08T11-44-25-RUTJ-weknora_login_fix_integration_plan_permission_flowcharts.md (cwd=/Users/yubangwang/Desktop/AI Engineering/weknora-offline, updated_at=2026-06-12T02:45:24+00:00, thread_id=019ea70c-5b3e-7583-9d18-aa2ff75f6537)

### keywords
- WeKnora, hybrid search, multi-KB, concurrent calls, batch endpoint, comparison document

## Task 5: Upload integration plan to Feishu wiki

### rollout_summary_files
- 2026-06-08T11-44-25-RUTJ-weknora_login_fix_integration_plan_permission_flowcharts.md (cwd=/Users/yubangwang/Desktop/AI Engineering/weknora-offline, updated_at=2026-06-12T02:45:24+00:00, thread_id=019ea70c-5b3e-7583-9d18-aa2ff75f6537)

### keywords
- Feishu wiki, lark-cli, docs +update, --as user, device auth, QR code

## User preferences

- SSH with sshpass using stored password was accepted without objection -> comfortable with automated remote access [Task 1]
- intermittent login problem -> look for recurring system-level causes (disk full, log overflow), not just credentials [Task 1]
- when creating integration plans for developers -> actionable endpoint tables with complete params (kb_id, permission context), practical code examples with error handling [Task 2]
- Excalidraw diagrams with upload links accepted for permission flowcharts [Task 3]
- multi-KB search comparison doc: local file sufficient, no Feishu upload needed [Task 4]
- final plan upload to Feishu via lark-cli with user identity authorization [Task 5]

## Reusable knowledge

- WeKnora login flow: handler/auth.go -> userService.Login() -> userRepo.GetUserByEmail() -> bcrypt compare. Error message intentionally vague (same for missing email and wrong password) [Task 1]
- .env file required; example at WeKnora/.env.example [Task 1]
- Docker log files at /var/lib/docker/containers/<id>/<id>-json.log; truncate: sudo truncate -s 0 [Task 1]
- Docker log rotation: /etc/docker/daemon.json with json-file driver, max-size=50m, max-file=3, overlay2 [Task 1]
- WeKnora SSH: hrlink@192.168.0.76, use sshpass [Task 1]
- HybridSearch only accepts one kb_id. Multi-KB: A) HRLINK concurrent + merge by score; B) add batch endpoint [Task 2-4]
- Permission proxy: HRLINK queries employee_kb_permission table, sends only permitted kb_ids to WeKnora [Task 3]
- lark-cli Feishu: --as user (bot 403). Auth: --no-wait --json -> qrcode -> scan -> --device-code. Upload: docs +update --api-version v2 --command overwrite --doc-format markdown --content @file.md --as user. LARK_CLI_NO_PROXY=1 bypass proxy [Task 5]
- Related skill: skills/weknora-login-fix/SKILL.md

## Failures and how to do differently

- --as bot returns "No permission to operate on this document" -> use --as user for Feishu edits [Task 5]
- after auth expires, lark-cli auth status to check; token auto-refreshes [Task 5]
- first explored wrong project -> confirm exact project/instance name with user [cross-ref]
#'

## Task Group: attendance-config-ai UI/UX

# Task Group: attendance-config-ai UI/UX

scope: research and UI optimization for attendance-config-ai (custom rule modal, AI batch input, conflict detection, search, drag, review reports, code editor)
applies_to: cwd=/Users/yubangwang/Desktop/AI Engineering/pm_agent/projects/attendance-config-ai/Demo; reuse_rule=project-specific; may generalize to React+Vite frontend in pm_agent

## Task 1: attendance project research and UI optimization

### rollout_summary_files
- 2026-06-04T07-45-50-4Thc-attendance_config_ai_research_ui_optimization.md (cwd=/Users/yubangwang/Desktop/AI Engineering/pm_agent, rollout_path=/Users/yubangwang/.codex/sessions/2026/06/04/rollout-2026-06-04T15-45-50-019e9198-7f63-77a3-978d-b388ff7bcc06.jsonl, updated_at=2026-06-15T05:15:59+00:00, thread_id=019e9198-7f63-77a3-978d-b388ff7bcc06)

### keywords
- attendance-config-ai, CustomRuleModal, ConflictDrawer, ImportModal, FloatingAgent, ReportView, AI parse, drag, highlightText, inspection rule, code editor hover

## User preferences

- confirm exact project name with user before exploring code (user corrected punch-rule-system != attendance-config-ai)
- technical backend fields (algorithm branch, decorator code) -> collapse under advanced config with explanation, not required by default
- rule adding: include textarea + "AI parse and fill" button at top (paste-to-recognize like Taobao)
- review report -> show case count, pass/fail breakdown, pass rate, closable modal
- each rule must show case list with expandable dependency data (preconditions, configSnapshot)
- upload/paste from rules list page (ReportView), not welcome page
- floating button -> draggable (onMouseDown + mouse move)
- conflict detection -> each item has "adjust" button jumping to rule editing
- conflict button -> Badge with pending count, red when conflicts exist
- search -> allowClear + keyword highlight (HighlightText)
- code editor textarea hover -> use !important to prevent white background override

## Reusable knowledge

- Project root: /Users/yubangwang/Desktop/AI Engineering/pm_agent/projects/attendance-config-ai/Demo
- Core components (relative to Demo):
  - src/pages/RulesPage/index.tsx -- rules page entry
  - src/pages/RulesPage/ReportView.tsx -- compact rule list (React.createElement to avoid OXC errors)
  - src/pages/RulesPage/WelcomeView.tsx -- welcome page
  - src/components/CustomRuleModal/index.tsx -- rule modal with AI input area
  - src/components/AIParseModal/index.tsx -- natural language rule parsing
  - src/components/ConflictDrawer/index.tsx -- conflict drawer with adjust button
  - src/components/ImportModal/index.tsx -- file upload + paste import
  - src/components/FloatingAgent/index.tsx -- draggable floating button
  - src/components/CodeEditorModal/index.tsx + index.css -- dark code editor (!important for hover)
  - src/services/llmService.ts -- parseBulkConfig, parseAndMatchRule
  - src/stores/rulesStore.ts -- rules/conflicts/sessions state
  - src/stores/configStore.ts -- attendance config state
- Vite 8 + Rolldown/OXC strict on JXX; React.createElement bypasses parse errors
- InspectionRule model: id, systemId, category, name, description, algorithmBranch, decoratorCode, configItems, cases. RuleCase: preconditions, steps, expectedResult, configSnapshot
- Conflict types: scope_overlap, decorator_conflict, config_override, algorithm_conflict, logic_conflict, coverage_gap
- Start: npx vite --port 3000

## Failures and how to do differently

- Python string replacement broke JSX
 in ReportView.tsx (OXC parse errors). Avoid; use AST or verify JSX syntax
- ReportView.tsx once overwritten by WelcomeView content. Always git diff before saving
- useCallback inside useEffect causes Invalid hook call. Hooks at top level only
- browser URL got trailing ***  from markdown bold. Provide clean clickable links
- rg in paths with spaces returns no results. Use find ... | xargs rg or quote paths

# Task Group: Crazy AI AI tool monetization failure

scope: attempt to earn 100 CNY / 20 USD in 2 days building AI tools, market validation, deployment, zero-cost strategies
applies_to: cwd=/Users/yubangwang/Desktop/Crazy AI; reuse_rule=high-value failure shield for monetization or product deployment in Crazy AI

## Task 1: Target setting and market exploration
### rollout_summary_files
- 2026-06-05T11-09-24-42zI-ai_tool_platform_fail_to_earn_100_cny.md (cwd=/Users/yubangwang/Desktop/Crazy AI\ rollout_path=/Users/yubangwang/.codex/sessions/2026/06/05/rollout-2026-06-05T19-09-24-019e9779-3931-7942-9411-320dae718eee.jsonl, updated_at=2026-06-07T02:45:46+00:00, thread_id=019e9779-3931-7942-9411-320dae718eee)
### keywords
- monetization, 100 CNY, zero-cost, market validation, Vercel, GFW, dashscope

## Task 2: Technical build and deployment
### rollout_summary_files
- 2026-06-05T11-09-24-42zI-ai_tool_platform_fail_to_earn_100_cny.md (cwd=/Users/yubangwang/Desktop/Crazy AI, updated_at=2026-06-07T02:45:46+00:00, thread_id=019e9779-3931-7942-9411-320dae718eee)
### keywords
- Vercel, GitHub Pages, CORS, nohup, DashScope API, server.js, GFW, deployment

## Task 3: Xianyu listing attempt
### rollout_summary_files
- 2026-06-05T11-09-24-42zI-ai_tool_platform_fail_to_earn_100_cny.md (cwd=/Users/yubangwang/Desktop/Crazy AI, updated_at=2026-06-07T02:45:46+00:00, thread_id=019e9779-3931-7942-9411-320dae718eee)
### keywords
- Xianyu, goofish.com, Playwright, virtual service, iPhone mirror, cliclick

## Task 4: Final reflection
### rollout_summary_files
- 2026-06-05T11-09-24-42zI-ai_tool_platform_fail_to_earn_100_cny.md (cwd=/Users/yubangwang/Desktop/Crazy AI, updated_at=2026-06-07T02:45:46+00:00, thread_id=019e9779-3931-7942-9411-320dae718eee)
### keywords
- monetization, reflection, business model, user acquisition, revenue

## User preferences

- user said "I only approve key permissions, everything else is handled by you entirely" -> operate autonomously, but ensure actions actually lead to revenue, not busywork [Task 1]
- user questioned business model feasibility: "are you sure this can make money?" -> expect realistic revenue analysis, not idealistic assumptions [Task 1]
- user provided QR code and Xianyu account -> use provided resources to drive actual revenue, not stay in development [Task 1][Task 3]
- user said "the websites can't be used at all" and "why would users pay? they can just use their own browsers" -> product lacked defensible value proposition; simple API wrappers have no moat [Task 4]

## Reusable knowledge

- Zero-cost is a hard constraint. AI api wrapper products without defensible value (convenience, customization, immediacy) will not generate revenue [Task 1][TOp 4]
- Vercel .vercel.app blocked by GFW. Use Cloudflare Workers or domestic platforms (Alibaba FC, Tencent Serverless) [Task 2]
- DashScope API at https://dashscope.aliyuncs.com/compatible-mode/v1, OpenAI SDK compatible. CORS Issues without backend proxy [Task 2]
- nohup does not inherit env vars; set explicitly: DASHSCOPE_API_KEY=xxx nohup node server.js & [Task 2]
- Regex file editing extremely risky; use sed with backup or AST-based. Always git commit before bulk edits [Task 2]
- Xianyu web (goofish.com) blocks virtual service publishing. Content div is [contenteditable=true] [Task 3]
- Best China zero-cost channels: Xianyu virtual services, WeChat private orders, Jike/Juejin -> private domain. Deliver AI services where customers already are [Task 4]

## Failures and how to do differently

- Built website before validating demand/distribution. First identify paying customers, validate value prop, then build minimum delivery [Task 1][TOp 4]
- Attempted platforms without confirming accessibility. Verify after deployment [Task 2]
- Should report failure early, not continue failing approaches [Task 4]
- iPhone mirror + cliclick unreliable for Xianyu. Use real device or guide manually [Task 3]

# Task Group: pm_agent Codex model configuration

scope: model identification (DeepSeek Flash/Pro, Qwen) and switching in pm_agent project
applies_to: cwd=/Users/yubangwang/Desktop/AI Engineering/pm_agent; reuse_rule=safe for any Codex model config task in this or similar .claude-based projects

## Task 1: Identify and switch from DeepSeek Flash to Pro

### rollout_summary_files
- 2026-06-05T02-44-33-PyA7-model_identification_switch_deepseek_flash_pro.md (cwd=/Users/yubangwang/Desktop/AI Engineering/pm_agent, rollout_path=/Users/yubangwang/.codex/sessions/2026/06/05/rollout-2026-06-05T10-44-33-019e95ab-03f6-7432-96b0-d5b3ea20c73f.jsonl, updated_at=2026-06-05T06:15:36+00:00, thread_id=019e95ab-03f6-7432-96b0-d5b3ea20c73f)

### keywords
- model identification, ANTHROPIK_MODEL, ANTHROPIK_BASE_URL, settings.local.json, deepseek-v4-flash, deepseek-v4-pro, sed switch

## User preferences

- when asked "what model is this" -> check BOTH .claude/settings.local.json AND runtime env vars ($ANTHROPIC_MODEL, $ANTHROPIC_BASE_URL). Not just global settings.json [Task 1]
- user knows about model variants ("isn't it pro?") -> may expect agent to confirm/offer switching unprompted [Task 1]
- when user says "I already restarted" but env still shows old -> proactively explain: only brand new Codex session takes effect, not terminal restart. Verify after restart [Task 1]

## Reusable knowledge

- Two-layer config: .claude/settings.json (baseline), .claude/settings.local.json (override, gitignored). Model under env key [Task 1]
- Check: echo "$ANTHROPIK_MODEL", echo "$ANTHROPIC_BASE_URL" [Task 1]
- macOS sed: sed -i '' 's/deepseek-v4-flash/deepseek-v4-pro/g' .claude/settings.local.json [Task 1]
- Helper scripts: bash scripts/switch-deepseek.sh, bash scripts/switch-qwen.sh [Task 1]
- After edit: brand new Codex session required. Env frozen at session start [Task 1]
- Related skill: skills/codex-model-config/SKILL.md

## Failures and how to do differently

- Answered from global settings.json only, missed local override. Check ALL config sources + env vars before stating the model [Task 1]
- Did not explain session restart explicitly. Must say: "The change takes effect on a brand new Codex session, not just terminal restart" [Task 1]


# Task Group: pm_agent custom skills directory

scope: listing custom skills under .agents/skills/, Comet Skill exploration (failed)
applies_to: cwd=/Users/yubangwang/Desktop/AI Engineering/pm_agent; reuse_rule=safe for skill-discovery tasks in pm_agent

## Task 1: Comet Skill research (failed)
### rollout_summary_files
- 2026-06-05T06-15-49-UKMJ-custom_skills_listing_pm_agent.md (cwd=/Users/yubangwang/Desktop/AI Engineering/pm_agent, rollout_path=/Users/yubangwang/.codex/sessions/2026/06/05/rollout-2026-06-05T14-15-49-019e966c-6e96-7392-b6b8-534766f8cc05.jsonl, updated_at=2026-06-11T03:22:16+00:00, thread_id=019e966c-6e96-7392-b6b8-534766f8cc05)
### keywords
- Comet Skill, web_search unsupported, deepwiki transport error, GitHub API fetch failure, network restriction

## Task 2: Custom skills directory
### rollout_summary_files
- 2026-06-05T06-15-49-UKMJ-custom_skills_listing_pm_agent.md (cwd=/Users/yubangwang/Desktop/AI Engineering/pm_agent, updated_at=2026-06-11T03:22:16+00:00, thread_id=019e966c-6e96-7392-b6b8-534766f8cc05)
### keywords
- .agents/skills/, custom skills, pm_agent skill directory, skill listing

## Reusable knowledge

- Custom skills at: /Users/yubangwang/Desktop/AI Engineering/pm_agent/.agents/skills/ (13 folders: demo-prd, demo-tester, dev-design-doc, domain-mcp, drawio-generator, hrlink-scraper, lark-cli, market-research, pc-demo, prd-check, prd-writer, qa-engineer, test-case-generator) [Task 2]
- Context/context-engineer.md exists at project root level [Task 2]

## Failures and how to do differently

- web_search, deepwiki, GitHub API fetch all fail in this environment. Do not rely on these for external lookups [Task 1]
