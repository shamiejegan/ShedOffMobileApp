import { StyleSheet, View} from 'react-native';


export default function OnboardingStepIndicator(props){
    return(
        <View style={styles.stepsIndicatorSection}>
            <View style={props.step1=="pending" ? styles.stepsIndicator:styles.stepsIndicatorComplete}></View> 
            <View style={props.step2=="pending" ? styles.stepsIndicator:styles.stepsIndicatorComplete}></View> 
            <View style={props.step3=="pending" ? styles.stepsIndicator:styles.stepsIndicatorComplete}></View> 
        </View>

    )
}

const styles = StyleSheet.create({

    stepsIndicatorSection:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    stepsIndicatorComplete:{
        height:10, 
        width:"32%", 
        backgroundColor:"#0D47A1"
    },    
    stepsIndicator:{
        height:10, 
        width:"32%", 
        backgroundColor:"#D9D9D9"
    },
});
  