export type PublicProject = {
  id: number;
  name: string;
  owner: {
    id: number;
  };
};

export type ProjectDetails = PublicProject & {
  isPrivate?: boolean;
  "private"?: boolean;
  images: {
    id: number;
    url: string;
  }[];
  tags: {
    name: string;
  }[];
};

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");
const requestTimeoutMs = 12_000;

function getApiBaseUrl(): string {
  if (!apiBaseUrl) {
    throw new Error(
      "EXPO_PUBLIC_API_URL n'est pas définie. Configurez l'adresse réseau de l'API.",
    );
  }

  return apiBaseUrl;
}

async function requestApi(path: string): Promise<Response> {
  const url = `${getApiBaseUrl()}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        "L'API ne répond pas. Vérifiez qu'elle est démarrée, que le téléphone est sur le même Wi-Fi et que le port 8080 est autorisé.",
      );
    }

    const reason = error instanceof Error ? ` (${error.message})` : "";
    throw new Error(
      `Impossible de joindre l'API. Vérifiez EXPO_PUBLIC_API_URL et le pare-feu du PC${reason}.`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPublicProjects(): Promise<PublicProject[]> {
  const response = await requestApi("/project/public");
  if (!response.ok) {
    throw new Error(`L'API a répondu avec le statut ${response.status}.`);
  }

  return response.json() as Promise<PublicProject[]>;
}

export async function fetchProject(id: number): Promise<ProjectDetails> {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("L'identifiant du projet est invalide.");
  }

  const response = await requestApi(`/project/${id}`);
  if (response.status === 404) {
    throw new Error("Ce projet n'existe pas.");
  }
  if (!response.ok) {
    throw new Error(`L'API a répondu avec le statut ${response.status}.`);
  }

  return response.json() as Promise<ProjectDetails>;
}
