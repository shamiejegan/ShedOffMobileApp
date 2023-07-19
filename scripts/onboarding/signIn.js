import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';

import * as SQLite from 'expo-sqlite';

export default function SignIn({navigation}){

  const db = SQLite.openDatabase('userDB.db');

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // send email address and password to the server 
  const login = async() => {

    if(email && password){

      //confirm that both password and email fields have been entered 
      let userID = email+password; 

      try {
        // Check if there exists a completed registration record based on the email in the db 
        await db.transaction(async(tx) => {
          await tx.executeSql(
            'SELECT email, password_encrypted FROM user_profile WHERE userid="'+userID+'" AND registered=1',
            [],
            (_, result) => {
              if(result.rows.length>0){
                console.log("signing in");
                navigation.navigate('Home',userID); 
              }
              else {
                console.log("Invalid password / email");
                Alert.alert("Invalid email / password");
                return 0;
              } 
            }
          );
        });

        
      } catch(err) {
        console.log(err)
      }

    }
    else{
      Alert.alert("Please enter both email and password");
    }
  }

  
  
  return(
    <SafeAreaView style={styles.safeArea}>
      
      <View style ={styles.content}>
        <View>
          <Text style={styles.fieldHeading}>Email Address</Text>
          <TextInput style={styles.input} 
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"/>
        </View>
        <View>
          <Text style={styles.fieldHeading}>Password</Text>
          <TextInput style={styles.input}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry/>
        </View>

        <TouchableOpacity style={styles.primaryButton} 
          onPress={() => {login()}}>
          <Text style={{fontWeight:'bold',color:'#D7D7D7'}}>Log In</Text>
        </TouchableOpacity>

      </View>
    <StatusBar style="light"/>

  </SafeAreaView>
  );
}; 

const styles = StyleSheet.create({

    //sections 
    safeArea: {
      backgroundColor: '#13181A',
      justifyContent:'flex-start',
      flexDirection:"column",
      flex:1, 
      height:"100%",
      width:"100%",
    },
    heading: {
      width:'100%', 
      flexDirection:'row',
      paddingHorizontal:20,
      justifyContent:'space-between',
      alignItems:'center',
      paddingVertical:20,
      borderBottomWidth:2,
      borderColor:'#222'
    },
    topTitle: {
      fontSize: 28, 
      fontWeight:'bold',
      color:'#D9D9D9',
    },
    
    content: {
      padding:20
    },
    fieldHeading:{
      color:'#D9D9D9',
      fontWeight:'bold',
    },
    input: {
      borderWidth:1, 
      borderColor: '#5A5A5A',
      alrightSelf:'stretch',
      marginTop:10,
      marginBottom:20,
      height: 40,
      borderRadius:5, 
      paddingHorizontal:20,
      color:'white',
    },
    description:{
      color:'#D9D9D9',
      alignSelf:'center',
    },
    primaryButton: {
      backgroundColor:'#0D47A1',
      width:"90%",
      marginHorizontal:"5%",
      marginVertical:10,
      height:50,
      alignItems:'center',
      alignSelf:'center',
      padding:10,
      justifyContent:'center',
      borderRadius:10,
      flexDirection:'row',
    },
    secondaryButton: {
      backgroundColor:'#11CCFF',
      width:"50%",
      height:50,
      alignItems:'center',
      alignSelf:'center',
      justifyContent:'center',
      borderRadius:10,
    }
  });
  