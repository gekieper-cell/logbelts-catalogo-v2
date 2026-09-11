import { NextResponse } from 'next/server';
import { commitArchivo } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const archivo = formData.get('archivo') as File;

    if (!archivo) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });
    }

    if (!archivo.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'El archivo debe ser .csv' }, { status: 400 });
    }

    const contenido = await archivo.text();

    await commitArchivo(
      'data/productos.csv',
      '\uFEFF' + contenido.replace(/^\uFEFF/, ''),
      `Actualizar catálogo desde admin (${new Date().toLocaleString('es-AR')})`
    );

    return NextResponse.json({
      ok: true,
      mensaje: 'CSV subido. Vercel está redeployando (1-2 min).',
    });
  } catch (e: any) {
    console.error('Error subiendo CSV:', e);
    return NextResponse.json(
      { error: e.message || 'Error al procesar' },
      { status: 500 }
    );
  }
}
