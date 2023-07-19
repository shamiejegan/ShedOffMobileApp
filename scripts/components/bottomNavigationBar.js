import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function BottomNavigationBar(props){
    return(
        <View style={styles.navigator}>
        <TouchableOpacity style={styles.navigatorItem} 
        onPress={props.actionHome}>
            <Ionicons name={props.currentPage==="Home" ? 'home' : 'home-outline'} size={24} color={props.currentPage==="Home" ? '#4EB9F5': '#AAA'}/>
            <Text style={[styles.navigatorText,{color:props.currentPage==="Home" ? '#4EB9F5' : '#AAA'}]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigatorItem} 
        onPress={props.actionEntries}>
            <Ionicons name={props.currentPage==="Entries" ? 'create' : 'create-outline'} size={26} color={props.currentPage==="Entries" ? '#4EB9F5': '#AAA'}/>
            <Text style={[styles.navigatorText,{color:props.currentPage==="Entries" ? '#4EB9F5' : '#AAA'}]}>Entries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigatorItem} 
        onPress={props.actionGoals}>
            <Ionicons name={props.currentPage==="Goals" ? 'disc' : 'disc-outline'} size={24} color={props.currentPage==="Goals" ? '#4EB9F5': '#AAA'}/>
            <Text style={[styles.navigatorText,{color:props.currentPage==="Goals" ? '#4EB9F5' : '#AAA'}]}>Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigatorItem} 
        onPress={props.actionProfile}>
            <Ionicons name={props.currentPage==="Profile" ? 'person' : 'person-outline'} size={24} color={props.currentPage==="Profile" ? '#4EB9F5': '#AAA'}/>
            <Text style={[styles.navigatorText,{color:props.currentPage==="Profile" ? '#4EB9F5' : '#AAA'}]}>Profile</Text>
        </TouchableOpacity>
        </View>
      
    )
}

const styles = StyleSheet.create({

    //navigators 
    navigator:{
      flexDirection:'row', 
      justifyContent:'space-evenly',
      alignItems:'center',
      paddingVertical:5,
      borderTopWidth:0.5,
      borderColor:'#AAA',
      height:60, 
      width:"100%",
      position:'absolute',
      bottom:20,
      backgroundColor:'#13181A'
    },
  
    navigatorItem:{
      flexDirection:'column',
      justifyContent:'flex-end',
      alignItems:'center',
      height:50
    },
    navigatorText:{
      color:'#AAA',
      fontSize:10,
      paddingTop:5
    },
})  