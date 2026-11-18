import { MotDePasse } from "@/components/mot-de-passe";
import { TexteHello } from "@/components/texte-hello";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TestScreen() {
    const [longueurAtteinte, setLongueurAtteinte] = useState(false);

    return (
        <View style={styles.contenu}>
            <TexteHello
                style={{ fontSize: 40 }}
                texteAffiche="tata"
                callback={() => console.log("coucou")}>
            </TexteHello>
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
        </View>
    )
}

const styles = StyleSheet.create(
    {
        contenu: { justifyContent: 'center', alignItems: 'center', flex: 1, padding: 24 },
        motDePasse: { width: '100%', maxWidth: 400, gap: 12, padding: 16, backgroundColor: '#fff', borderRadius: 8 },
        titre: { color: '#222', fontSize: 20, fontWeight: 'bold' },
        indication: { color: '#444' },
    }
)
