import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';


export default function ToggleThreeButtons(props){
  return(
    <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
      <TouchableOpacity 
        style={[styles.toggleButton, props.button1Condition ? {backgroundColor:'#0D47A1'} : {backgroundColor:'#ADADAD'}]}
        onPress={props.onButton1Press}>
        <Text style={props.button1Condition ? {color:'white'} : {color:'black'}}>{props.button1Text}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.toggleButton,props.button2Condition ? {backgroundColor:'#0D47A1'} : {backgroundColor:'#ADADAD'}]}
        onPress={props.onButton2Press}>
        <Text style={props.button2Condition ? {color:'white'} : {color:'black'}}>{props.button2Text}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.toggleButton,props.button3Condition ? {backgroundColor:'#0D47A1'} : {backgroundColor:'#ADADAD'}]}
        onPress={props.onButton3Press}>
        <Text style={props.button3Condition ? {color:'white'} : {color:'black'}}>{props.button3Text}</Text>
      </TouchableOpacity>
    </View>

  )
}

const styles = StyleSheet.create({

  toggleButton:{
    height:50,
    width:"33%",
    borderWidth:1,
    borderColor:'#0D47A1',
    marginTop:10,
    marginBottom:20,
    height: 40,
    alignItems:'center',
    justifyContent:'center'
  },

});

