import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert} from 'react-native';
import {useState} from 'react';

import * as SQLite from 'expo-sqlite';

//custom components
import OnboardingStepIndicator from '../components/onboardingStepIndicator';

export default function SignUp({navigation}){

  const db = SQLite.openDatabase('userDB.db');

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const checkExistingAccount = async (email) =>{
    try {
      // Check if there exists a completed registration record based on the email in the db 
      await db.transaction(async(tx) => {
        await tx.executeSql(
          'SELECT * FROM user_profile WHERE email="'+email+'"',
          [],
          (_, result) => {
            if(result.rows.length>0){
              Alert.alert("Oh no...",
                "You have registered an account with this email address, please log in instead!",
                [{text:'Go back', onPress: () =>{navigation.navigate('Welcome')}}]
                );
              return 1;
            }
            else{
              setData();
              return 0;
            }
          }
        );
      });
    } catch(err) {
      console.log(err)
    }

  }

  const setData = async () => {

    if (!email || !password) {
      //TODO: Add more regex conditions 
      Alert.alert("Oh no...","Please enter your email and password to register"); 
    }

    else {

      let userID = email+password; 

      try {
        // Add the user's email and password to the database 
        await db.transaction(async (tx) => {
          await tx.executeSql(
            "INSERT INTO user_profile (userid, email, password_encrypted, dob, gender, height, streak_days, loggedin, registered) VALUES (?,?,?,?,?,?,?,?,?)",
            [userID, email, password,new Date().getTime(),"OTHERS",0,0,0,0],
            (_, result) => {
              if (result.rowsAffected > 0) {
                console.log('Initialised user_profile table');
              } else {
                console.error('Insert query failed or no rows were affected');
                return 0;
              }
            },
            (_, error) => {
              console.error('Insert query failed with error: ', error);
              return 0;
            }
          ); 
          await tx.executeSql(
            "INSERT INTO user_access (userid, access_level) VALUES (?,?)",
            [userID, "basic"],
            (_, result) => {
              if (result.rowsAffected > 0) {
                console.log('Initialised user_access table');
              } else {
                console.error('Insert query failed or no rows were affected');
                return 0;
              }
            },
            (_, error) => {
              console.error('Insert query failed with error: ', error);
              return 0;
            }
          ); 
          await tx.executeSql(
            "INSERT INTO user_metrics (userid, weight, height, energy, volume) VALUES (?,?,?,?,?)",
            [userID, "KG","CM","KCAL","L"],
            (_, result) => {
              if (result.rowsAffected > 0) {
                console.log('Initialised user_metrics table');
              } else {
                console.error('Insert query failed or no rows were affected');
                return 0;
              }
            },
            (_, error) => {
              console.error('Insert query failed with error: ', error);
              return 0;
            }
          ); 
          await tx.executeSql(
            "INSERT INTO user_goals (userid, start_date, target_date, start_weight, target_weight, food_status, food_target, exercise_status, exercise_target, water_status, water_target, inf_status, inf_target, sleep_status, sleep_target) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [userID, 
              new Date().getTime(),
              new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime(),
              0,0,1,0,1,0,1,0,1,0,1,0],
            (_, result) => {
              if (result.rowsAffected > 0) {
                console.log('Initialised user_goals table');
              } else {
                console.error('Insert query failed or no rows were affected');
                return 0;
              }
            },
            (_, error) => {
              console.error('Insert query failed with error: ', error);
              return 0;
            }
          ); 
          await tx.executeSql(
            "INSERT INTO user_entries (userid, entry_date, weight, food, exercise, inf, sleep, water) VALUES (?,?,?,?,?,?,?,?)",
            [userID, 
              new Date().getTime(),
              0,0,0,0,0],
            (_, result) => {
              if (result.rowsAffected > 0) {
                console.log('Initialised user_entries table');
              } else {
                console.error('Insert query failed or no rows were affected');
                return 0;
              }
            },
            (_, error) => {
              console.error('Insert query failed with error: ', error);
              return 0;
            }
          ); 

        })

        Alert.alert("Thank you!", 
          "Your account has been created. Set up your profile to begin.",
          [{text:'Continue', onPress: () =>{navigation.navigate('Profile Setup',userID)}}]
        );


      } catch(err) {
        Alert.alert("Unfortunately, we are unable to process your request at this moment. Please try again later.")
        console.log(err)
      }  

    }
  }


  return(
    <SafeAreaView style={styles.safeArea}>

    <OnboardingStepIndicator step1="done" step2="pending" step3="pending"/>

      <View style ={styles.content}>


        <View>
          <Text style={styles.fieldHeading}>Email Address</Text>
          <TextInput style={styles.input} 
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"/>
        </View>
        <View>
          <Text style={styles.fieldHeading}>Create Password</Text>
          <TextInput style={styles.input}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry/>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => {checkExistingAccount(email)}}>
          <Text style={{fontWeight:'bold',color:'#D7D7D7'}}>Start your journey!</Text>
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
    stepsIndicatorSection:{
      flexDirection:'row',
      justifyContent:'space-between',
      paddingBottom:50
    },
    stepsIndicatorComplete:{
      height:10, 
      width:"32%", 
      backgroundColor:"#11CCFF"
    },    
    stepsIndicator:{
      height:10, 
      width:"32%", 
      backgroundColor:"#D9D9D9"
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
  