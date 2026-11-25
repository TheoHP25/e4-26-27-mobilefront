import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fetchProject, type ProjectDetails } from "@/services/api";

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const projectId = Number(id);
  const isValidProjectId = Number.isSafeInteger(projectId) && projectId > 0;
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(() => {
    if (!isValidProjectId) {
      return;
    }

    void fetchProject(projectId)
      .then(setProject)
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Impossible de charger ce projet.",
        );
      })
      .finally(() => setLoading(false));
  }, [isValidProjectId, projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const isPrivate = project?.isPrivate ?? project?.["private"];

  return (
    <ScrollView contentContainerStyle={styles.contenu}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour aux projets"
        onPress={() => router.back()}
        style={styles.retour}
      >
        <Text style={styles.action}>{"< Projets"}</Text>
      </Pressable>

      {!isValidProjectId ? (
        <Text style={styles.erreur}>Identifiant de projet invalide.</Text>
      ) : loading ? (
        <ActivityIndicator accessibilityLabel="Chargement du projet" />
      ) : error ? (
        <View style={styles.carte}>
          <Text accessibilityLiveRegion="polite" style={styles.erreur}>
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setLoading(true);
              setError(null);
              setProject(null);
              loadProject();
            }}
          >
            <Text style={styles.action}>Réessayer</Text>
          </Pressable>
        </View>
      ) : project ? (
        <View style={styles.carte}>
          <Text style={styles.titre}>{project.name}</Text>
          <Text style={styles.indication}>Projet #{project.id}</Text>
          {typeof isPrivate === "boolean" && (
            <Text style={styles.indication}>
              Visibilité : {isPrivate ? "Privé" : "Public"}
            </Text>
          )}
          <Text style={styles.indication}>
            Propriétaire : #{project.owner.id}
          </Text>

          {project.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sousTitre}>Tags</Text>
              <View style={styles.tags}>
                {project.tags.map((tag, index) => (
                  <Text key={`${tag.name}-${index}`} style={styles.tag}>
                    {tag.name}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {project.images.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sousTitre}>Images</Text>
              {project.images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.url }}
                  contentFit="cover"
                  accessibilityLabel={`Image du projet ${project.name}`}
                  style={styles.image}
                />
              ))}
            </View>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenu: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  retour: {
    width: "100%",
    maxWidth: 520,
    minHeight: 48,
    justifyContent: "center",
    paddingVertical: 12,
  },
  carte: {
    width: "100%",
    maxWidth: 520,
    gap: 12,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  titre: {
    color: "#222",
    fontSize: 24,
    fontWeight: "bold",
  },
  sousTitre: {
    color: "#222",
    fontSize: 18,
    fontWeight: "600",
  },
  indication: {
    color: "#444",
  },
  action: {
    color: "#2563eb",
    fontWeight: "600",
  },
  erreur: {
    color: "#b42318",
  },
  section: {
    gap: 10,
    marginTop: 8,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: "#1d4ed8",
    backgroundColor: "#eff6ff",
    borderRadius: 16,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 8,
  },
});
