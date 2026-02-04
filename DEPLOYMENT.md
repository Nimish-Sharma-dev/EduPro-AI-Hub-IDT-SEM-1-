# Deployment Guide

This guide will help you deploy the Unified Smart Productivity Suite to various hosting platforms.

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Prerequisites
- A Vercel account (free tier available)
- Your Supabase project set up
- Your LLM API key ready

### Steps

1. **Install Vercel CLI (optional):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard:**

   a. Push your code to GitHub, GitLab, or Bitbucket
   
   b. Go to [vercel.com](https://vercel.com) and sign in
   
   c. Click "New Project"
   
   d. Import your repository
   
   e. Configure your project:
      - Framework Preset: Next.js
      - Root Directory: `./`
      - Build Command: `npm run build`
      - Output Directory: `.next`

3. **Set Environment Variables:**

   In the Vercel dashboard, go to Settings → Environment Variables and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4-turbo-preview
   LLM_PROVIDER=openai
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Deploy:**
   
   Click "Deploy" and wait for the build to complete.

5. **Update Supabase Settings:**

   In your Supabase dashboard:
   - Go to Authentication → URL Configuration
   - Add your Vercel URL to "Site URL"
   - Add `https://your-app.vercel.app/**` to "Redirect URLs"

### Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add OPENAI_API_KEY
# ... add all other variables

# Deploy to production
vercel --prod
```

## Netlify Deployment

### Steps

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Install Next.js Plugin:**
   
   Add to `netlify.toml`:
   ```toml
   [[plugins]]
   package = "@netlify/plugin-nextjs"
   ```

3. **Environment Variables:**
   
   Add all environment variables in Netlify dashboard under Site Settings → Environment Variables

4. **Deploy:**
   
   Connect your repository and deploy

## Self-Hosted Deployment

### Using Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS base

   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t productivity-suite .
   docker run -p 3000:3000 --env-file .env.local productivity-suite
   ```

### Using PM2

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start with PM2:**
   ```bash
   pm2 start npm --name "productivity-suite" -- start
   pm2 save
   pm2 startup
   ```

## Environment Variables Checklist

Make sure to set these environment variables in your deployment platform:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `OPENAI_API_KEY` (if using OpenAI)
- ✅ `OPENAI_MODEL` (if using OpenAI)
- ✅ `LM_STUDIO_URL` (if using LM Studio)
- ✅ `LM_STUDIO_MODEL` (if using LM Studio)
- ✅ `LLM_PROVIDER` (either 'openai' or 'lmstudio')
- ✅ `NEXT_PUBLIC_APP_URL`

## Post-Deployment Checklist

1. ✅ Test authentication (sign up, login, logout)
2. ✅ Test file uploads (check size limits)
3. ✅ Test all 5 modules
4. ✅ Verify LLM integration works
5. ✅ Check error handling
6. ✅ Test on mobile devices
7. ✅ Verify Supabase RLS policies
8. ✅ Check performance and loading times

## Troubleshooting

### Build Errors

**Issue:** TypeScript errors during build
- **Solution:** Run `npm run build` locally first to catch errors

**Issue:** Missing environment variables
- **Solution:** Double-check all variables are set in your deployment platform

### Runtime Errors

**Issue:** Supabase authentication not working
- **Solution:** Verify redirect URLs in Supabase dashboard match your deployment URL

**Issue:** LLM API calls failing
- **Solution:** Check API key is valid and has sufficient credits/quota

**Issue:** File uploads failing
- **Solution:** Check serverless function size limits (increase if needed)

### Performance Issues

**Issue:** Slow initial load
- **Solution:** Enable caching, use CDN, optimize images

**Issue:** API routes timing out
- **Solution:** Increase serverless function timeout limits

## Monitoring

Consider adding monitoring services:
- **Vercel Analytics** (built-in for Vercel)
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage tracking

## Security Recommendations

1. Enable HTTPS (automatic on Vercel/Netlify)
2. Set up CORS properly
3. Use environment variables for all secrets
4. Enable Supabase RLS policies
5. Implement rate limiting for API routes
6. Regular security audits

## Scaling Considerations

- Use Vercel's Edge Functions for better performance
- Implement caching strategies
- Consider CDN for static assets
- Monitor API usage and costs
- Set up database connection pooling

---

For more help, refer to:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
