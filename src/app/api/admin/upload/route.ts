import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'Arquivo ausente' }, { status: 400 });

    const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    if (!allowed.includes(file.type))
      return NextResponse.json({ error: 'Tipo invalido. Use JPG, PNG, WebP ou GIF' }, { status: 415 });

    const MAX_MB = 8;
    if (file.size > MAX_MB * 1024 * 1024)
      return NextResponse.json({ error: `Arquivo muito grande. Maximo ${MAX_MB}MB` }, { status: 413 });

    const buffer = Buffer.from(await file.arrayBuffer());

    // Otimizacao SEO/dados moveis:
    // - Redimensiona para max 800x800 mantendo proporcao
    // - Converte para WebP (melhor compressao)
    // - Qualidade 82 (balanco visual x peso)
    // - Strip metadata EXIF (privacidade + menos bytes)
    const optimized = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const blobName = `produtos/${Date.now()}-${originalName.replace(/\.[^.]+$/, '')}.webp`;

    const blob = await put(blobName, optimized, {
      access: 'public',
      contentType: 'image/webp',
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Upload erro:', err);
    return NextResponse.json({ error: 'Erro interno no upload' }, { status: 500 });
  }
}
