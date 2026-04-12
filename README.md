This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


ForkStack
	
"Fork" (dining) + "Stack" (technology stack)
Evokes a full-service tech solution for the food industry. Memorable and descriptive.

Complete System Documentation
1. Executive Summary
Platform Name: VendorHub (example)
Type: Multi‑tenant SaaS for cafes, restaurants, and retail vendors.
Core Value:

Vendors get a branded subdomain, inventory/menu management, order processing, QR table ordering, and WhatsApp messaging to their customers using their own WhatsApp Business number.

Staff can work for multiple vendors (via assignments).

Platform owner earns via subscription plans.

Key Modules:

Tenant isolation & subdomain routing

User roles & multi‑company staff assignments

WhatsApp integration (vendor‑owned numbers)

Menu (items, combos, offers, promo codes)

QR code table ordering

Order, parcel, payment management

Team attendance & salary (for internal staff)

Reports & analytics

External API for vendors

2. System Architecture & Flowcharts
2.1 High‑Level System Flow









2.2 User Roles & Access
Role	Access
ADMIN	Full platform control: manage vendors, plans, team, view all data.
VENDOR_OWNER	Owns one vendor profile. Can manage menu, orders, staff assignments.
TEAM	Assigned to one or more vendors (via UserVendorAssignment). Can work within those vendors only.
SUPPORT	Platform support – can view vendor issues but not modify core data.
2.3 Subdomain Tenant Detection Flow
sequenceDiagram
    participant C as Client
    participant M as Next.js Middleware
    participant DB as Database
    C->>M: GET vendor.yourplatform.com/dashboard
    M->>M: Extract subdomain "vendor"
    M->>DB: Find vendor with tenantSlug = "vendor"
    DB-->>M: vendorId, subscriptionStatus
    alt Vendor exists & active
        M->>M: Set header x-vendor-id
        M->>C: Forward request with vendor context
    else Not found
        M->>C: Return 404
    end
2.4 WhatsApp Embedded Signup Flow (Vendor Own Number)
sequenceDiagram
    participant V as Vendor Dashboard
    participant P as Platform Backend
    participant M as Meta (Facebook)
    participant W as WhatsApp Business API
    V->>P: Click "Connect WhatsApp"
    P->>M: Redirect to Meta OAuth (Embedded Signup)
    M->>V: Show Meta login & permission screen
    V->>M: Authorize platform
    M->>P: Callback with authorization code
    P->>M: Exchange code for access token
    M-->>P: Return token, WABA ID, phone number ID
    P->>P: Encrypt & store token in VendorProfile
    P->>V: Connection success
    V->>W: Later, send messages using stored token

2.5 QR Table Ordering Flow
sequenceDiagram
    participant C as Customer
    participant QR as QR Code on Table
    participant P as Platform Public Page
    participant V as Vendor Dashboard
    C->>QR: Scan code
    QR->>C: Open https://vendor.domain/order?table=123
    C->>P: Browse menu, add items to cart
    C->>P: Place order (name, special instructions)
    P->>P: Create order with tableId, source=QR_TABLE
    P-->>V: Real‑time notification (polling/websocket)
    V->>V: Show order with table number & items
    V->>P: Update order status (Preparing → Ready → Served)
    P-->>C: (Optional) Show tracking link / status

2.6 Order Processing (Stock Deduction & Discounts)


graph LR
    A[Order received] --> B{Contains combos?}
    B -->|Yes| C[Expand combos into individual items]
    B -->|No| D[Use items directly]
    C --> D
    D --> E[Check stock for each item]
    E -->|Insufficient| F[Reject order]
    E -->|Sufficient| G[Apply offers & promo code]
    G --> H[Calculate final amount]
    H --> I[Reduce stock]
    I --> J[Save order + order items + discounts]











3. Database Schema (Prisma)
Below is the complete Prisma schema. Copy this into prisma/schema.prisma.

prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== ENUMS ==========
enum Role {
  ADMIN
  VENDOR_OWNER
  TEAM
  SUPPORT
}

enum SubscriptionPlan {
  BASIC
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  SUSPENDED
  CANCELLED
  EXPIRED
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum ParcelStatus {
  PENDING
  PICKED_UP
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  RETURNED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  HALF_DAY
  LEAVE
}

enum OfferType {
  PERCENTAGE
  FIXED_AMOUNT
  BOGO
  FREE_SHIPPING
}

enum OrderSource {
  VENDOR_DASHBOARD
  QR_TABLE
  API
}

// ========== USER & AUTH ==========
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  password          String
  name              String
  phone             String?
  role              Role
  isActive          Boolean   @default(true)
  joinDate          DateTime  @default(now())
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // For vendor owners (one-to-one)
  ownedVendor       VendorProfile? @relation("VendorOwner")
  
  // For staff (many-to-many via assignment)
  vendorAssignments UserVendorAssignment[]
  
  // For salary/attendance (only TEAM)
  salary            Float?
  attendance        Attendance[]
  salaryRecords     SalaryRecord[]
}

// ========== VENDOR & TENANT ==========
model VendorProfile {
  id                    String             @id @default(cuid())
  ownerId               String?            @unique
  businessName          String
  businessPhone         String
  businessEmail         String
  gstin                 String?
  address               String
  logoUrl               String?
  themeColor            String?            @default("#10B981")
  tenantSlug            String             @unique   // e.g., "sweetbakery"
  customDomain          String?            @unique   // e.g., "portal.sweetbakery.com"
  
  // Subscription
  subscriptionPlan      SubscriptionPlan   @default(BASIC)
  subscriptionStatus    SubscriptionStatus @default(ACTIVE)
  subscriptionStart     DateTime           @default(now())
  subscriptionEnd       DateTime
  stripeCustomerId      String?
  stripeSubscriptionId  String?
  
  // WhatsApp credentials (encrypted)
  whatsappAccessTokenEncrypted  String?
  whatsappPhoneNumberId         String?
  whatsappBusinessAccountId     String?
  whatsappConnectedAt           DateTime?
  whatsappApiKey                String?            @unique   // for external API
  
  // Account management
  accountManagerId      String?
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  // Relations
  owner                 User?              @relation("VendorOwner", fields: [ownerId], references: [id])
  accountManager        User?              @relation("AccountManager", fields: [accountManagerId], references: [id])
  staffAssignments      UserVendorAssignment[]
  tables                Table[]
  menuItems             MenuItem[]
  combos                Combo[]
  offers                Offer[]
  promoCodes            PromoCode[]
  inventory             InventoryItem[]
  orders                Order[]
  parcels               Parcel[]
  payments              Payment[]
  whatsappLogs          WhatsAppLog[]
  subscriptionPayments  SubscriptionPayment[]
}

// Many-to-many between User (TEAM) and VendorProfile
model UserVendorAssignment {
  id            String   @id @default(cuid())
  userId        String
  vendorId      String
  roleInVendor  String   // e.g., "MANAGER", "CASHIER", "KITCHEN"
  isActive      Boolean  @default(true)
  assignedAt    DateTime @default(now())
  
  user          User          @relation(fields: [userId], references: [id])
  vendor        VendorProfile @relation(fields: [vendorId], references: [id])
  
  @@unique([userId, vendorId])
}

// ========== TABLE & QR CODE ==========
model Table {
  id          String   @id @default(cuid())
  vendorId    String
  tableNumber String   // e.g., "T01", "Table 5"
  qrCodeUrl   String?  // S3 URL of generated QR image
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  vendor      VendorProfile @relation(fields: [vendorId], references: [id])
  orders      Order[]
}

// ========== MENU / INVENTORY ==========
model MenuItem {
  id          String   @id @default(cuid())
  vendorId    String
  name        String
  description String?
  price       Float
  category    String   // e.g., "Beverages", "Main Course"
  isAvailable Boolean  @default(true)
  imageUrl    String?
  preparationTime Int?
  taxRate     Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  vendor      VendorProfile @relation(fields: [vendorId], references: [id])
  comboItems  ComboItem[]
  offerItems  OfferItem[]
  orderItems  OrderItem[]
  promoCodeItems PromoCodeItem[]
}

model InventoryItem {
  id                 String    @id @default(cuid())
  vendorId           String
  name               String
  sku                String    @unique
  category           String
  description        String?
  price              Float
  costPrice          Float?
  quantity           Int       @default(0)
  lowStockThreshold  Int       @default(5)
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  vendor             VendorProfile @relation(fields: [vendorId], references: [id])
  orderItems         OrderItem[]
}

// ========== COMBOS ==========
model Combo {
  id          String   @id @default(cuid())
  vendorId    String
  name        String
  description String?
  totalPrice  Float    // discounted combo price
  discount    Float?   // optional discount amount
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  vendor      VendorProfile @relation(fields: [vendorId], references: [id])
  items       ComboItem[]
  orders      OrderCombo[]
}

model ComboItem {
  id          String   @id @default(cuid())
  comboId     String
  menuItemId  String
  quantity    Int      @default(1)
  
  combo       Combo     @relation(fields: [comboId], references: [id])
  menuItem    MenuItem  @relation(fields: [menuItemId], references: [id])
}

// ========== OFFERS ==========
model Offer {
  id          String   @id @default(cuid())
  vendorId    String
  title       String
  description String?
  type        OfferType
  value       Float?    // e.g., 20 for 20%, or 10 for $10 off
  minOrderValue Float?
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  vendor      VendorProfile @relation(fields: [vendorId], references: [id])
  items       OfferItem[]
  promoCode   PromoCode?    // optional: linked to a promo code
}

model OfferItem {
  id          String   @id @default(cuid())
  offerId     String
  menuItemId  String
  
  offer       Offer     @relation(fields: [offerId], references: [id])
  menuItem    MenuItem  @relation(fields: [menuItemId], references: [id])
}

// ========== PROMO CODES ==========
model PromoCode {
  id          String   @id @default(cuid())
  vendorId    String
  code        String   @unique
  type        OfferType
  value       Float
  maxUses     Int?
  usedCount   Int      @default(0)
  maxUsesPerUser Int?
  minOrderValue Float?
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  vendor      VendorProfile @relation(fields: [vendorId], references: [id])
  items       PromoCodeItem[]
}

model PromoCodeItem {
  id          String   @id @default(cuid())
  promoCodeId String
  menuItemId  String
  
  promoCode   PromoCode @relation(fields: [promoCodeId], references: [id])
  menuItem    MenuItem  @relation(fields: [menuItemId], references: [id])
}

// ========== ORDERS ==========
model Order {
  id               String       @id @default(cuid())
  orderNumber      String       @unique
  vendorId         String
  tableId          String?      // if QR order
  customerName     String?
  customerPhone    String
  customerEmail    String?
  customerAddress  String?
  specialInstructions String?
  orderSource      OrderSource  @default(VENDOR_DASHBOARD)
  totalAmount      Float
  discount         Float        @default(0)
  tax              Float        @default(0)
  finalAmount      Float
  status           OrderStatus  @default(PENDING)
  orderDate        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
  notes            String?

  vendor           VendorProfile @relation(fields: [vendorId], references: [id])
  table            Table?        @relation(fields: [tableId], references: [id])
  items            OrderItem[]
  combos           OrderCombo[]
  parcels          Parcel[]
  payment          Payment?
  discounts        OrderDiscount[]
}

model OrderItem {
  id           String   @id @default(cuid())
  orderId      String
  menuItemId   String   // can be from inventory or menu
  quantity     Int
  unitPrice    Float
  totalPrice   Float

  order        Order      @relation(fields: [orderId], references: [id])
  menuItem     MenuItem   @relation(fields: [menuItemId], references: [id])
}

model OrderCombo {
  id          String   @id @default(cuid())
  orderId     String
  comboId     String
  quantity    Int
  unitPrice   Float
  totalPrice  Float

  order       Order   @relation(fields: [orderId], references: [id])
  combo       Combo   @relation(fields: [comboId], references: [id])
}

model OrderDiscount {
  id          String   @id @default(cuid())
  orderId     String
  discountType String   // "OFFER", "PROMO_CODE"
  referenceId String    // offerId or promoCodeId
  amount      Float
  description String?
  
  order       Order   @relation(fields: [orderId], references: [id])
}

// ========== PARCELS ==========
model Parcel {
  id              String       @id @default(cuid())
  orderId         String
  vendorId        String
  trackingNumber  String?      @unique
  courierName     String?
  status          ParcelStatus @default(PENDING)
  shippedDate     DateTime?
  deliveredDate   DateTime?
  weight          Float?
  dimensions      String?
  shippingCost    Float?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  order           Order         @relation(fields: [orderId], references: [id])
  vendor          VendorProfile @relation(fields: [vendorId], references: [id])
}

// ========== PAYMENTS ==========
model Payment {
  id            String        @id @default(cuid())
  orderId       String        @unique
  vendorId      String
  amount        Float
  method        String        // cash, card, upi, bank
  transactionId String?
  status        PaymentStatus @default(PENDING)
  paidAt        DateTime?
  notes         String?
  createdAt     DateTime      @default(now())

  order         Order         @relation(fields: [orderId], references: [id])
  vendor        VendorProfile @relation(fields: [vendorId], references: [id])
}

// ========== TEAM ATTENDANCE ==========
model Attendance {
  id          String           @id @default(cuid())
  userId      String
  date        DateTime         @default(now())
  status      AttendanceStatus
  checkIn     DateTime?
  checkOut    DateTime?
  hoursWorked Float?
  notes       String?

  user        User             @relation(fields: [userId], references: [id])
}

// ========== SALARY RECORDS ==========
model SalaryRecord {
  id         String   @id @default(cuid())
  userId     String
  month      Int
  year       Int
  baseSalary Float
  bonus      Float    @default(0)
  deductions Float    @default(0)
  netSalary  Float
  paid       Boolean  @default(false)
  paidAt     DateTime?
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id])
}

// ========== WHATSAPP LOGS ==========
model WhatsAppLog {
  id         String   @id @default(cuid())
  vendorId   String
  toPhone    String
  message    String
  status     String   // sent, failed, pending
  response   String?
  createdAt  DateTime @default(now())

  vendor     VendorProfile @relation(fields: [vendorId], references: [id])
}

// ========== SUBSCRIPTION PAYMENTS (to platform) ==========
model SubscriptionPayment {
  id         String           @id @default(cuid())
  vendorId   String
  amount     Float
  plan       SubscriptionPlan
  startDate  DateTime
  endDate    DateTime
  stripeId   String?
  status     String
  createdAt  DateTime         @default(now())

  vendor     VendorProfile    @relation(fields: [vendorId], references: [id])
}

// ========== REPORTS (snapshots) ==========
model Report {
  id         String   @id @default(cuid())
  type       String
  title      String
  data       Json
  generatedBy String
  createdAt  DateTime @default(now())
}
4. API Endpoints Summary
Public (Customer) Endpoints – QR Ordering
Method	Endpoint	Description
GET	/api/public/menu/:vendorSlug	Get menu items, combos, offers for a vendor
POST	/api/public/order	Place order from QR (requires tableId, cart items)
GET	/api/public/order-status/:orderId	Track order status (optional)
Vendor (Authenticated) – Internal Management
Module	Endpoints
Tables	GET /api/vendor/tables, POST /api/vendor/tables, PUT /api/vendor/tables, DELETE /api/vendor/tables?id=, GET /api/vendor/tables/:id/qrcode
Menu	GET /api/vendor/menu, POST /api/vendor/menu, PUT /api/vendor/menu, DELETE /api/vendor/menu?id=
Combos	GET /api/vendor/combos, POST /api/vendor/combos, PUT /api/vendor/combos, DELETE /api/vendor/combos?id=
Offers	GET /api/vendor/offers, POST /api/vendor/offers, PUT /api/vendor/offers, DELETE /api/vendor/offers?id=
Promo Codes	GET /api/vendor/promo-codes, POST /api/vendor/promo-codes, PUT /api/vendor/promo-codes, DELETE /api/vendor/promo-codes?id=, POST /api/vendor/promo-codes/validate
Inventory	GET /api/vendor/inventory, POST /api/vendor/inventory, PUT /api/vendor/inventory, DELETE /api/vendor/inventory?id=
Orders	GET /api/vendor/orders, POST /api/vendor/orders, PUT /api/vendor/orders/:id/status
Parcels	GET /api/vendor/parcels, POST /api/vendor/parcels, PUT /api/vendor/parcels/:id
Payments	GET /api/vendor/payments, POST /api/vendor/payments
Reports	GET /api/vendor/reports/sales, GET /api/vendor/reports/inventory, GET /api/vendor/reports/payments
WhatsApp	GET /api/vendor/whatsapp/connect (initiate Embedded Signup), POST /api/vendor/whatsapp/send (send message)
Staff	GET /api/vendor/staff, POST /api/vendor/staff/invite, DELETE /api/vendor/staff/:userId
External API for Vendors (using API key)
Method	Endpoint	Description
POST	/api/vendor/whatsapp/send	Send WhatsApp message (requires apiKey, phoneNumber, message)
POST	/api/vendor/orders	Create order from external system (requires apiKey, order data)
GET	/api/vendor/inventory	Fetch inventory (requires apiKey)
GET	/api/vendor/orders?status=...	Fetch orders (requires apiKey)
Admin Endpoints
Method	Endpoint	Description
GET	/api/admin/vendors	List all vendors
POST	/api/admin/vendors	Create vendor manually
PUT	/api/admin/vendors/:id/suspend	Suspend vendor
GET	/api/admin/team	List internal team
POST	/api/admin/team	Add team member
GET	/api/admin/reports/platform	Platform revenue, active vendors
Team Attendance
Method	Endpoint	Description
POST	/api/team/attendance	Check‑in/out
GET	/api/team/attendance?month=&year=	View attendance
5. Core Features Implementation Guide
5.1 Subdomain Tenant Detection
Middleware (as shown earlier) extracts subdomain, looks up VendorProfile.tenantSlug, sets x-vendor-id header. All API routes must validate this header and scope queries to that vendor.

5.2 WhatsApp Embedded Signup
Create Meta App, configure OAuth redirect URI.

Vendor clicks "Connect WhatsApp" → redirects to Meta.

After authorization, Meta calls your callback with code.

Exchange code for long‑lived access token.

Encrypt token and store in VendorProfile.whatsappAccessTokenEncrypted.

Use that token to send messages.

5.3 QR Code Table Ordering
Steps:

Vendor creates table → system generates QR code (PNG) with URL: https://{tenantSlug}.domain/order?table={tableId}

Customer scans → public page fetches menu via /api/public/menu/:vendorSlug

Customer adds items/combos to cart, submits order with optional name & instructions.

Backend creates order with orderSource = QR_TABLE, tableId, and reduces stock (for menu items).

Vendor dashboard polls for new orders (or uses WebSocket). Kitchen display shows orders with table number.

Vendor updates status (Preparing → Ready → Served). Customer can optionally track.

5.4 Staff Multi‑Company
User with role TEAM can be assigned to multiple VendorProfile via UserVendorAssignment.

When staff logs in to vendorA.domain.com, middleware checks x-vendor-id and validates that the user has an active assignment to that vendor.

No additional UI needed – changing company is done by changing subdomain.

5.5 Subscription & Payments
Use Stripe Checkout for subscription plans.

Webhook updates VendorProfile.subscriptionStatus and subscriptionEnd.

Middleware checks subscriptionStatus and redirects to renewal page if inactive.

5.6 Real‑time Notifications (for orders)
Simplest: Vendor dashboard polls /api/vendor/orders?new=true every 5 seconds.
Production: Use Pusher or Socket.io with Redis.

6. Security & Compliance
Measure	Implementation
Encryption	WhatsApp tokens encrypted with AES‑256 (key from ENCRYPTION_KEY).
Rate Limiting	Per vendor, per IP (e.g., 100 requests/minute).
Audit Logs	Log all sensitive actions (login, token change, order status change) to a separate AuditLog table.
GDPR	Provide data export (CSV) and account deletion for vendors.
HTTPS	Enforce with Next.js and Vercel.
SQL Injection	Prisma ORM prevents injection.
XSS	React/Next.js escapes by default.
7. Deployment & Monitoring
7.1 Recommended Stack
Hosting: Vercel (frontend + API routes)

Database: Neon.tech (PostgreSQL) or Supabase

Redis: Upstash (for rate limiting, queues)

File Storage: AWS S3 (QR codes, menu images)

Monitoring: Sentry (errors), Logtail (logs), UptimeRobot (uptime)

7.2 Environment Variables (.env.production)
env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://yourplatform.com"
NEXTAUTH_SECRET="..."
WHATSAPP_ACCESS_TOKEN=""   # platform token (optional)
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
NEXT_PUBLIC_FACEBOOK_APP_ID="..."
FACEBOOK_APP_SECRET="..."
ENCRYPTION_KEY="32-byte-hex-key"
REDIS_URL="redis://..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="..."
7.3 Deployment Steps
Push code to GitHub.

Connect repository to Vercel.

Add environment variables.

Set wildcard DNS: *.yourplatform.com CNAME to cname.vercel-dns.com.

Run database migrations: npx prisma migrate deploy.

Seed admin user: npx prisma db seed.

8. Roadmap & Future Enhancements
Phase	Features
MVP (Q1)	Subdomain, basic menu, QR ordering, WhatsApp send (mock), Stripe subscription, manual order entry.
Phase 2 (Q2)	Embedded Signup (real WhatsApp), combos, offers, promo codes, real‑time notifications, inventory, reports.
Phase 3 (Q3)	Staff multi‑company, kitchen display, order tracking for customers, parcel integration.
Phase 4 (Q4)	Custom domains, bulk WhatsApp, chatbot, multi‑language, mobile PWA.
9. Conclusion
This documentation covers everything you requested:

✅ Multi‑tenant subdomains with full isolation

✅ Vendor‑owned WhatsApp numbers via Meta Embedded Signup

✅ Menu, combos, offers, promo codes

✅ QR code table ordering with real‑time dashboard

✅ Staff working across multiple companies

✅ Inventory, orders, parcels, payments

✅ Team attendance, salary, reports

✅ API for external systems

✅ Subscription billing with Stripe

✅ Security, deployment, and monitoring

The system is ready to build using Next.js, TypeScript, Prisma, Tailwind, and the WhatsApp Business API.


