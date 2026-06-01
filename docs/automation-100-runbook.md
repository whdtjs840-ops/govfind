# GovFind Automation 100 Runbook

## Scope

This runbook defines automation 100% for the current GovFind static publishing workflow.

Automation 100% does not mean uncontrolled writes. It means the system can:

- refresh the built public index,
- check every integrated source from cache/staging,
- decide whether discovery, dry-run, review, or no action is next,
- verify expired policies are excluded from public discovery surfaces,
- generate an approval manifest,
- block apply and deploy until a person explicitly approves them,
- produce machine-readable reports for the next operator action.

## Commands

Default safe automation cycle:

```powershell
npm.cmd run automation:cycle
```

This command is cache-only. It runs:

```powershell
npm.cmd run legacy:build
npm.cmd run update:all
npm.cmd run update:plan
npm.cmd run ops:check
```

It writes:

```text
data/staging/automation/automation-cycle-report.json
data/staging/automation/automation-approval-manifest.json
```

The command does not call APIs, does not apply data, does not commit, and does not deploy.

Optional source dry-run after reviewing the plan:

```powershell
npm.cmd run automation:cycle -- --source=<source> --limit=<count> --execute-dry-run
```

This can execute only source-specific dry-run/generate/apply-dry-run commands. It still cannot run real apply or deploy.

## Approval Boundary

The approval manifest may include commands for:

- discovery,
- dry-run,
- apply,
- post-apply verification,
- deployment.

These commands are suggestions only. Real writes require a separate user instruction.

Blocked by default:

- API fetch/discovery,
- real apply,
- commit,
- production deploy.

## Expired Policy Rule

Expired policies stay in the source-of-truth dataset to preserve detail URLs.

They must be excluded from:

- home latest sections,
- `/support/`,
- search results,
- tag filters,
- category pages,
- `dist/search-index.json`.

The automation cycle records:

- source-of-truth count,
- public search-index count,
- expired excluded count,
- search-only excluded count.

## Stop Conditions

Stop and report if:

- `automation:cycle` exits non-zero,
- public search-index count changes unexpectedly,
- update reports and search-index counts disagree,
- `ops:check` is not `operational_stability_100_ready`,
- a source API quota/rate-limit/auth error appears,
- a secret or API key could be printed,
- a real apply would modify `src/data/policies.ts` without explicit approval,
- dry-run selected count differs from the intended apply count,
- post-apply QA, validation, tests, or build fails.

## Normal Operating Flow

1. Run `npm.cmd run automation:cycle`.
2. Open `data/staging/automation/automation-cycle-report.json`.
3. If `automationState` is `ready_for_source_dry_run`, run the suggested dry-run only.
4. If `automationState` is `needs_approved_discovery`, approve a source-specific discovery command.
5. If `automationState` is `needs_review_or_new_source`, review blocked source reports or choose a new data source.
6. After a successful source dry-run, approve exactly one real apply command.
7. After apply, run smoke QA, validation, tests, build, update reports, and `ops:check`.
8. Commit and deploy only after explicit approval.
9. Run production QA and save the production QA report.

## Completion Criteria

Automation is 100% for this stage when:

- `automation:cycle` passes,
- `ops:check` score is 100,
- public search-index count is consistent across build, update reports, smoke QA, and ops report,
- expired policies remain hidden from public discovery surfaces,
- approval manifest is generated,
- apply and deploy are blocked by default,
- next action is clear without manual source-by-source guessing.
