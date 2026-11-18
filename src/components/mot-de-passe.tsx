import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export type MotDePasseProps = {
  maxLength: number;
  onChangeText?: (motDePasse: string) => void;
  callback?: (motDePasse: string) => void;
};

export function MotDePasse({
  maxLength,
  onChangeText,
  callback,
}: MotDePasseProps) {
  const [motDePasse, setMotDePasse] = useState("");
  const [visible, setVisible] = useState(false);

  function modifierMotDePasse(texte: string) {
    setMotDePasse(texte);
    onChangeText?.(texte);

    if (maxLength > 0 && texte.length === maxLength) {
      callback?.(texte);
    }
  }

  return (
    <View style={styles.conteneur}>
      <TextInput
        accessibilityLabel="Mot de passe"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={maxLength}
        onChangeText={modifierMotDePasse}
        placeholder="Mot de passe"
        secureTextEntry={!visible}
        style={styles.champ}
        value={motDePasse}
      />
      <Pressable
        accessibilityLabel={
          visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
        accessibilityRole="button"
        onPress={() => setVisible((valeur) => !valeur)}
        style={styles.bouton}
      >
        <Text style={styles.boutonTexte}>
          {" "}
          {visible ? "Masquer" : "Afficher"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    alignItems: "center",
    borderColor: "#777",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
  },
  champ: {
    color: "#222",
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  bouton: {
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 12,
  },
  boutonTexte: {
    color: "#222",
  },
});
