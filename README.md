# Shopnextify

> **Note** I don't own this theme. This is a demo site for a Shopify theme. Certain functionalities have been disabled to make it more suitable for a demo.

> **Note**: This template is in **BETA**. Some features may change as Payload CMS evolves.

![Storefront](/git-images/hero.png)
![Admin](/git-images/admin.png)

A production-ready ecommerce template built with [Payload CMS](https://payloadcms.com) and [Next.js](https://nextjs.org). This template includes a fully-working backend, enterprise-grade admin panel, and a beautifully designed, production-ready ecommerce website.

## ✨ Features

- 🛍️ **Full Ecommerce Functionality** - Products, categories, cart, checkout, and order management
- 📦 **Payload CMS Admin Panel** - Enterprise-grade admin interface for content management
- 🎨 **Modern UI** - Beautiful, responsive design built with Tailwind CSS and Radix UI
- 🔐 **Authentication** - User accounts, login, registration, and password reset
- 📝 **Content Management** - Rich text editing, SEO optimization, and form builder
- 🖼️ **Media Management** - UploadThing integration for file storage
- 🌐 **TypeScript** - Full type safety throughout the application
- ✅ **Testing** - E2E tests with Playwright and integration tests with Vitest
- 🚀 **Production Ready** - Optimized for performance and SEO

## 🚀 Quick Start

### Prerequisites

- Node.js `^18.20.2` or `>=20.9.0`
- pnpm (recommended) or npm/yarn
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- UploadThing account (for media storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shopnextify
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL=mongodb://localhost:27017/shopnextify

   # Payload CMS
   PAYLOAD_SECRET=your-secret-key-here

   # Server URL
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000

   # UploadThing (get from https://uploadthing.com)
   UPLOADTHING_TOKEN=sk_live_...

   # Optional: Preview secret for draft previews
   PREVIEW_SECRET=your-preview-secret
   ```

4. **Generate Payload types**

   ```bash
   pnpm generate:types
   ```

5. **Generate import map**

   ```bash
   pnpm generate:importmap
   ```

6. **Start the development server**

   ```bash
   pnpm dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

### First User Setup

When you first access the admin panel, you'll be prompted to create an admin user. This user will have full access to the admin panel.

## 📁 Project Structure

```
shopnextify/
├── src/
│   ├── app/
│   │   ├── (app)/               # Storefront
│   │   └── (payload)/           # Payload CMS
│   ├── collections/             # Payload collection configs
│   │   ├── Categories.ts
│   │   ├── Media.ts
│   │   ├── Pages.ts
│   │   ├── Products/
│   │   └── Users/
│   ├── globals/                 # Payload global configs
│   │   ├── Header.ts
│   │   ├── Footer.ts
│   │   └── Store.ts
│   ├── components/             # React components
│   │   ├── Cart/
│   │   ├── checkout/
│   │   ├── forms/
│   │   └── ui/
│   ├── blocks/                  # Page builder blocks
│   ├── access/                  # Access control functions
│   ├── hooks/                   # Payload hooks
│   ├── endpoints/               # Custom API endpoints
│   ├── utilities/               # Utility functions
│   └── payload.config.ts        # Payload CMS configuration
├── tests/
│   ├── e2e/                     # Playwright E2E tests
│   └── int/                     # Vitest integration tests
├── public/                      # Static assets
└── package.json
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm dev:turbo` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm generate:types` - Generate TypeScript types from Payload schema
- `pnpm generate:importmap` - Generate import map for Payload components
- `pnpm test` - Run all tests
- `pnpm test:e2e` - Run E2E tests with Playwright
- `pnpm test:int` - Run integration tests with Vitest

## 🔧 Configuration

### Database

This project uses MongoDB. You can use:

- **Local MongoDB**: `mongodb://localhost:27017/shopnextify`
- **MongoDB Atlas**: Get connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### UploadThing Setup

1. Create an account at https://uploadthing.com
2. Create a new app
3. Copy your token to `UPLOADTHING_TOKEN` in `.env`

## 🧪 Testing

### E2E Tests

E2E tests use Playwright and test the full user flow:

```bash
pnpm test:e2e
```

### Integration Tests

Integration tests use Vitest and test API endpoints:

```bash
pnpm test:int
```

### Running Tests in Development

For E2E tests, the dev server will start automatically. Make sure your `.env` file is configured correctly.

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS
- DigitalOcean
- etc.

Make sure to set all required environment variables in your deployment platform.

## 🔐 Security Best Practices

When deploying to production:

1. **Use strong secrets**: Generate a strong `PAYLOAD_SECRET` (at least 32 characters)
2. **Secure your database**: Use MongoDB Atlas with IP whitelisting
3. **Environment variables**: Never commit `.env` files
4. **HTTPS**: Always use HTTPS in production
5. **HTTPS**: Always use HTTPS in production
6. **Access control**: Review access control functions in `src/access/`

## 📚 Documentation

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [UploadThing Documentation](https://docs.uploadthing.com)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to this project.

## 📄 License

MIT

## 🆘 Support

If you encounter any issues or have questions, open an issue on GitHub

## 🙏 Acknowledgments

Built with:

- [Payload CMS](https://payloadcms.com) - Headless CMS
- [Next.js](https://nextjs.org) - React Framework
- [UploadThing](https://uploadthing.com) - File Storage
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Shadcn](https://ui.shadcn.com/) - UI Components

---
