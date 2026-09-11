import { Octokit } from '@octokit/rest';

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER || 'gekieper-cell';
const repo = process.env.GITHUB_REPO || 'logbelts-catalogo-v2';

if (!token) {
  console.warn('⚠️ GITHUB_TOKEN no está configurado');
}

export const octokit = new Octokit({ auth: token });
export { owner, repo };

export async function commitArchivo(
  ruta: string,
  contenido: string,
  mensaje: string,
  esBase64 = false
) {
  // Ver si el archivo ya existe (para obtener su SHA)
  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: ruta });
    if (!Array.isArray(data) && 'sha' in data) {
      sha = data.sha;
    }
  } catch {
    // No existe, lo creamos
  }

  return octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: ruta,
    message: mensaje,
    content: esBase64 ? contenido : Buffer.from(contenido).toString('base64'),
    sha,
  });
}

export async function getUltimoCommit() {
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 1,
    });
    return data[0] || null;
  } catch {
    return null;
  }
}
