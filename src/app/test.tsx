import { TexteHello } from "@/components/texte-hello";
import { StyleSheet, View } from "react-native";

export default function TestScreen() {

    // const maVariable = { proprieteA: 42, proprieteB: 'titi' }
    // const { proprieteA, proprieteB } = maVariable;
    // console.log(proprieteA);



    return (
        <View style={styles.contenu}>
            <TexteHello
                style={{ fontSize: 40 }}
                texteAffiche="tata"
                callback={() => console.log("coucou")}>
            </TexteHello>
        </View>

    )
}





const styles = StyleSheet.create(
    {
        contenu: { justifyContent: 'center', alignItems: 'center', flex: 1 },
        texteHello: { color: 'red' }
    }
)
