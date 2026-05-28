# Backlog After GovFind v1

## P0

No deployment-blocking issues remain for GovFind v1.

## P1

### Reduce `/support/` HTML Size

The `/support/` page uses numbered pagination, but the generated static HTML still includes a large amount of policy card markup. This should be the first post-v1 performance improvement.

Possible directions:

- Generate real static pages for `/support/page/2/` style pagination.
- Move policy-card rendering to a smaller client-side data payload.
- Keep SEO-critical content while limiting initial HTML size.

### Reduce Large Category Page HTML Size

Large category pages, especially `/category/startup/`, are heavy because startup and business data expanded quickly. Apply the same strategy used for `/support/` once the preferred pagination architecture is chosen.

### Improve Search Ranking

Current search is functional, but ranking should better reflect user intent.

Candidate ranking signals:

- exact title match
- category match
- official/open status
- source reliability
- recency
- application deadline certainty
- synonym expansion

Useful synonym groups:

- policy fund, loan, financing, capital
- employment, job, hiring, workforce
- startup, early-stage, commercialization
- export, overseas, global
- R&D, technology, certification

## P2

### Review `update:all` Blocked Sources

Current blocked or review-needed sources should be reviewed before the next large expansion.

- Gov24 needsReview items
- Bizinfo needsReview items
- K-Startup needsReview items

### Add Detail Tags

Add optional tags to improve filtering and search quality without changing the main category structure.

Candidate tags:

- policy fund
- export
- R&D
- technology support
- commercialization
- mentoring
- training
- certification
- marketing
- local welfare

### Refine Category System

The 10 main categories are usable for v1. As the dataset grows, some business and startup policies need secondary classification to avoid category ambiguity.

Focus areas:

- startup vs small business
- employment vs education
- welfare vs local government service
- farming business vs general farming support

## P3

### Additional Data Sources

Add new sources only after performance and search quality improvements are planned.

Possible next sources:

- additional local government datasets
- industry-specific funding sources
- public procurement support sources
- regional startup centers

### Admin Approval Screen

Build an internal approval surface for needsReview items.

Useful capabilities:

- source-level review queue
- duplicate preview
- category correction
- safe apply approval
- report export

### Fully Automated Updates

Full automation should come after review tooling is mature.

Required before full automation:

- stable source-specific validation
- key rotation and secret handling policy
- rollback playbook
- production QA automation
- alerting for count mismatches and build failures

