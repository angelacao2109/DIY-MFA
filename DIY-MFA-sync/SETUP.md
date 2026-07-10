# Notion → GitHub sync setup

One-time setup, ~5 minutes. (You can delete this file after.)

## 1. Create a Notion integration
- Go to notion.so/profile/integrations → New integration
- Workspace: yours · Type: Internal · Capabilities: Read content is enough
- Copy the secret token (starts with `ntn_` or `secret_`)

## 2. Connect it to your notes
- Open the **DIY Master's Program** page in Notion
- ••• menu (top right) → Connections → add your integration
- Child pages (Week 3, all Three.js pages) inherit access automatically

## 3. Add the token to GitHub
- Repo → Settings → Secrets and variables → Actions → New repository secret
- Name: `NOTION_TOKEN` · Value: the token from step 1

## 4. Add these files to the repo
- Keep the folder structure exactly as-is (`.github/workflows/` matters)
- Commit and push to `main`

## 5. Run it
- Actions tab → sync-notion-to-github → Run workflow
- Every stub file gets replaced with your actual Notion content

## Ongoing
- Runs automatically every 6 hours (edit the cron in the workflow to change)
- New note in Notion? Add a stub `.md` with its `notion-url` in the frontmatter
- Stop syncing a page: delete its `.md` file
