# TechNext Technologies Website

A premium, highly animated corporate website built with pure HTML, CSS, and vanilla JavaScript.

## Deploying to Vercel via GitHub

Because this is a static site (HTML/CSS/JS), deploying it to Vercel via GitHub is incredibly easy and will be completely free. A `vercel.json` file is already included to automatically optimize your deployment with clean URLs and strict caching.

### Step 1: Push the code to GitHub

Open a terminal or command prompt inside this folder (`C:\Users\LENOVO\Desktop\web`) and run the following commands to upload your code to a new GitHub repository:

```bash
git init
git add .
git commit -m "Initial website commit"
git branch -M main

# Replace the URL below with your empty GitHub repository URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy to Vercel

Once your code is safely on GitHub, click the magic button below to deploy it instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Alternatively, you can do it manually:**
1. Log in to your account at [Vercel](https://vercel.com).
2. Click **Add New... > Project**.
3. Find your newly created GitHub repository in the list and click **Import**.
4. Leave all settings exactly as they are (Vercel will auto-detect everything).
5. Click **Deploy**.

Within 30 seconds, your site will be live! Vercel will automatically redeploy your site anytime you push new changes to your GitHub repository in the future.
