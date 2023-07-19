import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';


export default function StatButton(props){
    return(
      props.toShow? ( //only show data widget if it meets the toshow criteria
        <View style={[styles.entryItem]}>
        <TouchableOpacity 
          style={props.entry>0 ? (props.entryMeetsGoal ? [styles.addEntryButton, styles.addedEntryButton]: [styles.addEntryButton, styles.addedEntryButtonNotMet]) : styles.addEntryButton}
          onPress={props.action}
        >
          <Text style={{fontSize: 14, color: '#D9D9D9', fontWeight:'bold', paddingBottom:5 }}>{props.entry ? props.entry:0}</Text>
          <Text style={{fontSize: 8, color: '#D9D9D9'}}>{props.metric}</Text>
        </TouchableOpacity> 
       <Text style={styles.entryDescription}>{props.title}</Text>       
      </View>

      ):(
        null
      )
    )
  }

  const styles = StyleSheet.create({

    entryItem: {
      alignItems: 'center',
      flexDirection:'column',
      width:"25%", 
      marginVertical:5,
    },
    addEntryButton: {
      backgroundColor:'#232D37',
      borderWidth:2,
      borderColor:'#DDD',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical:10,
      borderRadius: 10,
      width:60,
      height:60,
      borderColor:'white',
    },
    addedEntryButton: {
      borderWidth:2,
      borderColor:'#0da18c',
    },
    addedEntryButtonNotMet:{
      borderWidth:2,
      borderColor:'#a10d22',
    },
    entryDescription: {
      fontSize: 12, 
      textAlign:'center',
      color:'#D9D9D9',
    },

        
  });
  