# Day 5 – Demo and Retrospective

## Today's Focus
Deliver your live demo, walk through the architecture with your cohort, and conduct a technical retrospective.

## Tasks
- Prepare your demo environment: run `make build && make up` one final time from a clean state. Confirm every service is healthy and the application is working end-to-end. Have a backup plan (recorded screen capture) if live infra has issues.
- Write a 5-minute demo script: (1) show the running Docker Compose stack and explain each service's role, (2) make a live API call and trace it through the logs, (3) show the Kubernetes dashboard or `kubectl get all` output, (4) trigger the CI pipeline by pushing a commit and watch it run in GitHub Actions, (5) explain one interesting technical decision you made and why.
- Present to the cohort: deliver the demo, narrate what you are doing in real time, and explain trade-offs. Practice answering "why did you choose X over Y?" for every major component.
- Run a retrospective: write down (1) three things that worked well in the project, (2) two things you would do differently, (3) one thing you learned that surprised you. Share openly with the cohort.
- Write a final `REFLECTION.md` in your project repo: summarise the full 10-week journey, what you built, what you learned, and what you want to learn next. This is for yourself — be honest about gaps.
- Archive the project: tag `v1.0.0` with `git tag -a v1.0.0 -m "Capstone final submission"`, push the tag, and create a GitHub Release with release notes summarising the project's features.

## Reading / Reference
- [The Art of the Technical Demo](https://www.intercom.com/blog/how-to-give-a-great-product-demo/) — adapts to technical presentations.
- [Blameless Post-Mortems and a Culture of Learning (Etsy)](https://www.etsy.com/codeascraft/blameless-postmortems/) — the mindset for honest retrospectives.
- [Staff Engineer by Will Larson](https://staffeng.com/book) — Chapter 3 on technical writing and design documents is relevant as you level up.
