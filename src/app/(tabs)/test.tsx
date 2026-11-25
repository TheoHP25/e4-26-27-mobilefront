import { MotDePasse } from "@/components/mot-de-passe";
import { TexteHello } from "@/components/texte-hello";
import { fetchPublicProjects, type PublicProject } from "@/services/api";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function TestScreen() {
    const router = useRouter();
    const [longueurAtteinte, setLongueurAtteinte] = useState(false);
    const [projects, setProjects] = useState<PublicProject[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [projectError, setProjectError] = useState<string | null>(null);

    const loadProjects = useCallback(() => {
        void fetchPublicProjects()
            .then(setProjects)
            .catch((error: unknown) => {
                setProjectError(
                    error instanceof Error ? error.message : "Impossible de charger les projets.",
                );
            })
            .finally(() => setLoadingProjects(false));
    }, []);

    useEffect(() => {
        void loadProjects();
    }, [loadProjects]);

    return (
        <FlatList
            style={styles.liste}
            contentContainerStyle={styles.contenu}
            data={projects}
            keyExtractor={(project) => String(project.id)}
            ListHeaderComponent={
                <View style={styles.entete}>
                    <TexteHello
                        style={{ fontSize: 40 }}
                        texteAffiche="tata"
                        callback={() => console.log("coucou")}
                    />
                    <View style={styles.motDePasse}>
                        <Text style={styles.titre}>Mot de passe</Text>
                        <Text style={styles.indication}>Saisissez 8 caractères maximum.</Text>
                        <MotDePasse
                            maxLength={8}
                            onChangeText={() => setLongueurAtteinte(false)}
                            callback={() => setLongueurAtteinte(true)}
                        />
                        <Text accessibilityLiveRegion="polite" style={styles.indication}>
                            {longueurAtteinte ? "Nombre maximum de caractères atteint." : ""}
                        </Text>
                    </View>
                    <View style={styles.sectionProjets}>
                        <View style={styles.enteteProjets}>
                            <Text style={styles.titre}>Projets publics</Text>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Actualiser les projets"
                                disabled={loadingProjects}
                                onPress={() => {
                                    setLoadingProjects(true);
                                    setProjectError(null);
                                    loadProjects();
                                }}
                            >
                                <Text style={styles.action}>
                                    {loadingProjects ? "Chargement…" : "Actualiser"}
                                </Text>
                            </Pressable>
                        </View>
                        {loadingProjects && (
                            <ActivityIndicator accessibilityLabel="Chargement des projets" />
                        )}
                        {projectError && (
                            <Text accessibilityLiveRegion="polite" style={styles.erreur}>
                                {projectError}
                            </Text>
                        )}
                    </View>
                </View>
            }
            renderItem={({ item }) => (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Voir le détail du projet ${item.name}`}
                    onPress={() =>
                        router.push({
                            pathname: "/projects/[id]",
                            params: { id: String(item.id) },
                        })
                    }
                    style={({ pressed }) => [styles.projet, pressed && styles.projetAppuye]}
                >
                    <Text style={styles.nomProjet}>{item.name}</Text>
                    <Text style={styles.indication}>Projet #{item.id}</Text>
                </Pressable>
            )}
            ListEmptyComponent={
                !loadingProjects && !projectError ? (
                    <Text style={styles.indication}>Aucun projet public pour le moment.</Text>
                ) : undefined
            }
        />
    )
}

const styles = StyleSheet.create(
    {
        liste: { flex: 1 },
        contenu: { width: '100%', alignItems: 'stretch', flexGrow: 1, padding: 24, gap: 16 },
        entete: { width: '100%', maxWidth: 400, alignItems: 'center', gap: 16 },
        motDePasse: { width: '100%', maxWidth: 400, gap: 12, padding: 16, backgroundColor: '#fff', borderRadius: 8 },
        sectionProjets: { width: '100%', maxWidth: 400, gap: 12, padding: 16, backgroundColor: '#fff', borderRadius: 8 },
        enteteProjets: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
        projet: { alignSelf: 'stretch', width: '100%', maxWidth: 400, minHeight: 56, gap: 4, padding: 16, backgroundColor: '#fff', borderRadius: 8 },
        projetAppuye: { opacity: 0.75 },
        titre: { color: '#222', fontSize: 20, fontWeight: 'bold' },
        indication: { color: '#444' },
        action: { color: '#2563eb', fontWeight: '600' },
        erreur: { color: '#b42318' },
        nomProjet: { color: '#222', fontSize: 16, fontWeight: '600' },
    }
)
