// WELCOME PAGE WILL BE SHOWN TO USERS IF WE ARE NOT ABLE TO FIND CURRENT LOG IN SESSION 

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import { useEffect } from 'react';

import * as SQLite from 'expo-sqlite';

import logo from '../../assets/Logo.png';
import { useState } from 'react/cjs/react.development';


export default function Welcome({navigation}){

  const db = SQLite.openDatabase('userDB.db');

  //create all tables if they do not already exist
  const createUserTable = () => {
    db.transaction((tx)=>{
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS user_profile (userid TEXT PRIMARY KEY, email TEXT, password_encrypted TEXT, dob INTEGER, gender TEXT, height REAL, streak_days INT, loggedin INT, registered INT, latest_weight REAL, latest_entry_date INT)'
      )
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS user_access (userid TEXT PRIMARY KEY, access_level TEXT)'
      )
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS user_metrics (userid TEXT PRIMARY KEY, weight TEXT, height TEXT, energy TEXT, volume TEXT)'
      )
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS user_goals (userid TEXT PRIMARY KEY, start_date INTEGER, target_date INT, start_weight REAL, target_weight REAL, food_status INT, food_target INT, exercise_status INT, exercise_target INT, water_status INT, water_target REAL, inf_status INT, inf_target REAL, sleep_status INT, sleep_target REAL)'
      ) 
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS user_entries (entryid TEXT PRIMARY KEY, entry_date INTEGER, userid TEXT, weight REAL, food INT, exercise INT, inf INT, sleep INT, water INT)'
      )  
    })
  }


  const getUserData = () => {
    try {
      db.transaction((tx) =>{
        tx.executeSql(
          "SELECT userid FROM user_profile WHERE loggedin=0",
          [],
          (tx,result)=> {
            if (result.rowsAffected > 0) {
              var len = result.row.length; 
              if(len >0){
                var userID=result.rows.item(0).userid
                //navigate to home page if the user is already logged in, sending across the user id for data querying within the app
                navigation.navigate('Home',userID);
              }
              else {
                return 0;
              }
            }
            else {
              return 0;
            }
          }
        )
      })
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {

    createUserTable();
    getUserData();

  }, []);


  return(
    <SafeAreaView style={styles.safeArea}>

      <View style ={styles.content}>
          <Image source={logo} style={{width: '100%'}} resizeMode='contain'></Image>
          <TouchableOpacity testID="signup" style={styles.primaryButton} onPress={() => {navigation.navigate('Sign Up')}}>
            <Text style={{fontWeight:'bold'}}>Register Today!</Text>
          </TouchableOpacity>

          <Text style={styles.description}>Already have an account?</Text>
          <TouchableOpacity testID="signin" style={{margin:10}} onPress={() => {navigation.navigate('Sign In');}}>
            <Text style={{fontSize:'20', color:'#11CCFF', fontWeight:'bold'}}>LOG IN</Text>
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
      justifyContent:'center',
      flexDirection:"column",
      flex:1, 
      height:"100%",
      width:"100%",
    },
    content: {
      padding:20,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column',
      margin:20,
    },
    description:{
      color:'#D9D9D9',
      alignSelf:'center',
      paddingTop:50
    },
    primaryButton: {
      backgroundColor:'#11CCFF',
      width:"70%",
      height:50,
      alignItems:'center',
      alignSelf:'center',
      justifyContent:'center',
      borderRadius:10,
      marginVertical:50
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
  