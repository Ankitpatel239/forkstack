import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_DIR = path.join(__dirname, 'src', 'app');

const routes = [
  '(auth)/login/page.tsx',
  '(auth)/register/page.tsx',
  '(auth)/forgot-password/page.tsx',
  '(auth)/layout.tsx',
  '(dashboard)/admin/dashboard/page.tsx',
  '(dashboard)/admin/vendors/page.tsx',
  '(dashboard)/admin/vendors/[id]/page.tsx',
  '(dashboard)/admin/team/page.tsx',
  '(dashboard)/admin/reports/page.tsx',
  '(dashboard)/vendor/dashboard/page.tsx',
  '(dashboard)/vendor/inventory/page.tsx',
  '(dashboard)/vendor/orders/page.tsx',
  '(dashboard)/vendor/orders/[id]/page.tsx',
  '(dashboard)/vendor/menu/items/page.tsx',
  '(dashboard)/vendor/menu/combos/page.tsx',
  '(dashboard)/vendor/menu/offers/page.tsx',
  '(dashboard)/vendor/menu/promo-codes/page.tsx',
  '(dashboard)/vendor/tables/page.tsx',
  '(dashboard)/vendor/whatsapp/page.tsx',
  '(dashboard)/vendor/staff/page.tsx',
  '(dashboard)/vendor/settings/page.tsx',
  '(dashboard)/team/kitchen/page.tsx',
  '(dashboard)/team/attendance/page.tsx',
  '(dashboard)/team/salary/page.tsx',
  '(dashboard)/layout.tsx',
  '[vendorSlug]/order/page.tsx',
  'track/[orderId]/page.tsx',
  'api/auth/[...nextauth]/route.ts',
];

const apiRoutes = [
  'public/menu/[vendorSlug]',
  'public/order',
  'public/order-status/[orderId]',
  'vendor/inventory',
  'vendor/orders',
  'vendor/menu',
  'vendor/combos',
  'vendor/offers',
  'vendor/promo-codes',
  'vendor/tables',
  'vendor/whatsapp/connect',
  'vendor/whatsapp/send',
  'vendor/whatsapp/callback',
  'vendor/staff',
  'vendor/reports',
  'admin/vendors',
  'admin/team',
  'admin/reports',
  'team/attendance',
  'stripe/webhook'
];

console.log('Generating route structure...');

routes.forEach((route) => {
  const fullPath = path.join(APP_DIR, route);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(fullPath)) {
    const isLayout = route.endsWith('layout.tsx');
    const isApi = route.includes('api/');
    
    let content = '';
    if (isApi) {
      content = `export async function GET(request: Request) {\n  return new Response("Not implemented", { status: 501 });\n}\n`;
    } else if (isLayout) {
      content = `export default function Layout({ children }: { children: React.ReactNode }) {\n  return <div>{children}</div>;\n}\n`;
    } else {
      content = `export default function Page() {\n  return <div>${path.basename(dir)} Page</div>;\n}\n`;
    }
    
    fs.writeFileSync(fullPath, content);
  }
});

apiRoutes.forEach((route) => {
  const fullPath = path.join(APP_DIR, 'api', route, 'route.ts');
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(fullPath)) {
    const content = `import { NextResponse } from 'next/server';\n\nexport async function GET(request: Request) {\n  return NextResponse.json({ message: "Not implemented" });\n}\n`;
    fs.writeFileSync(fullPath, content);
  }
});

console.log('✅ Route structure created successfully!');
console.log('Now install dependencies by running:');
console.log('pnpm add next-themes next-auth @upstash/ratelimit @upstash/redis zod bcrypt @auth/prisma-adapter lucide-react @tanstack/react-query react-hook-form @hookform/resolvers next-themes jsonwebtoken');
console.log('pnpm add -D @types/bcrypt @types/jsonwebtoken');
console.log('');
console.log('Then initialize shadcn/ui:');
console.log('pnpx shadcn@latest init');
