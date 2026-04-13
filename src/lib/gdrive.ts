
import { prisma } from './db';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

async function refreshAccessToken(driveId: string, refreshToken: string) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(`Refresh Failed: ${data.error_description}`);

  // Update drive in DB
  const updatedDrive = await prisma.connectedDrive.update({
    where: { id: driveId },
    data: {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    },
  });

  return updatedDrive.accessToken;
}

async function getOrCreateFolder(token: string, folderName: string, parentId?: string) {
  const query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false${parentId ? ` and '${parentId}' in parents` : ''}`;
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  
  if (data.files && data.files.length > 0) return data.files[0].id;

  // Create it
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    })
  });
  const folder = await createRes.json();
  return folder.id;
}

export async function uploadToGoogleDrive(vendorId: string, base64Data: string, fileName: string, subFolder: 'Branding' | 'Menu' = 'Menu') {
  const vendor = await prisma.vendorProfile.findUnique({ where: { id: vendorId } });
  const drive = await prisma.connectedDrive.findFirst({
    where: { vendorId, type: 'GOOGLE', status: 'ACTIVE' },
  });

  if (!drive || !drive.refreshToken || !vendor) throw new Error('No active storage node or vendor profile');

  let token = drive.accessToken;
  const isExpired = drive.expiresAt && drive.expiresAt < new Date();
  if (!token || isExpired) token = await refreshAccessToken(drive.id, drive.refreshToken);

  // 1. Manage Folder Structure: ForkStack > VendorSlug > [Branding|Menu]
  const rootId = await getOrCreateFolder(token, 'ForkStack_Media');
  const vendorFolderId = await getOrCreateFolder(token, vendor.tenantSlug, rootId);
  const targetFolderId = await getOrCreateFolder(token, subFolder, vendorFolderId);

  // 2. Prepare Multipart Upload
  const [header, content] = base64Data.split(';base64,');
  const mimeType = header.split(':')[1];
  const buffer = Buffer.from(content, 'base64');

  const metadata = {
    name: fileName,
    mimeType: mimeType,
    parents: [targetFolderId]
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body = Buffer.concat([
    Buffer.from(delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + delimiter),
    Buffer.from(`Content-Type: ${mimeType}\r\n\r\n`),
    buffer,
    Buffer.from(closeDelimiter),
  ]);

  const response = await fetch(DRIVE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: body,
  });

  const file = await response.json();
  if (file.error) throw new Error(`Deploy Failed: ${file.error.message}`);

  // 3. Set Public Permissions (Anyone with link can view)
  await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' })
  });

  // 4. Transform to High-Speed Public Thumbnail Link
  // Thumbnail links are highly reliable for cross-origin dashboard display
  return `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
}

export async function deleteFromGoogleDrive(vendorId: string, fileUrl: string) {
  if (!fileUrl || !fileUrl.includes('id=')) return;

  const drive = await prisma.connectedDrive.findFirst({
    where: { vendorId, type: 'GOOGLE', status: 'ACTIVE' },
  });

  if (!drive || !drive.refreshToken) return;

  let token = drive.accessToken;
  const isExpired = drive.expiresAt && drive.expiresAt < new Date();
  if (!token || isExpired) token = await refreshAccessToken(drive.id, drive.refreshToken);

  // Extract ID: drive.google.com/thumbnail?id=FILE_ID&sz=w1000
  const urlObj = new URL(fileUrl);
  const fileId = urlObj.searchParams.get('id');

  if (!fileId) return;

  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}
