import { StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function PageHeading(props){
  return(
    <View style ={styles.heading}>
      <Text style= {styles.topTitle}>{props.title}</Text>
      <View style= {styles.iconSection}>
        <Ionicons name={props.sideIconName} size={props.sideIconSize} color={props.sideIconColor}/>
        <Text style={{color:props.sideIconColor}}>{props.sideIconDescription}</Text>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({

  heading: {
    padding:20,
    width:'100%', 
    flexDirection:'row',
    paddingHorizontal:20,
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomWidth:2,
    borderColor:'#222'

  },
  topTitle: {
    fontSize: 28, 
    fontWeight:'bold', 
    color:'#C9C9C9',
  },
  iconSection:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },

});
