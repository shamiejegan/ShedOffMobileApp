import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView} from 'react-native';
import {useState, useEffect} from 'react';
import { useIsFocused } from "@react-navigation/native";

import { format } from "date-fns";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as SQLite from 'expo-sqlite';

//custom components
import ToggleTwoButtons from '../components/toggleTwoButtons';
import ToggleThreeButtons from '../components/toggleThreeButtons';
import OnboardingStepIndicator from '../components/onboardingStepIndicator';

export default function SetProfile({navigation,route}){

  const userID = route.params; 
  const isFocused = useIsFocused();

  const db = SQLite.openDatabase('userDB.db');

  const [dob,setDob] = useState(new Date()); 
  const [height, setHeight] = useState(0);
  const [heightMetric, setHeightMetric]= useState("CM"); 
  const [startWeight, setStartWeight] = useState(0);
  const [weightMetric, setWeightMetric]= useState("KG"); 
  const [gender, setGender] = useState("OTHERS"); 

  const [selectedDate, setSelectedDate] = useState(new Date());

  const getInitialData = async () => {
    try {
      await db.transaction(async(tx) => {
        await tx.executeSql(
          'SELECT * FROM user_profile WHERE userid="'+userID+'"',
          [],
          (_, result) => {
            if(result.rows.length>0){
              setDob(new Date(result.rows.item(0).dob)); 
              setHeight(result.rows.item(0).height); 
              setGender(result.rows.item(0).gender); 
            }
            else{
              return 0;
            }
          }
        );
        await tx.executeSql(
          'SELECT * FROM user_metrics WHERE userid="'+userID+'"',
          [],
          (_, result) => {
            if(result.rows.length>0){
              setHeightMetric(result.rows.item(0).height); 
              setWeightMetric(result.rows.item(0).weight); 
            }
            else{     
              return 0;
            }
          }
        );

        await tx.executeSql(
          'SELECT * FROM user_goals WHERE userid="'+userID+'"',
          [],
          (_, result) => {
            if(result.rows.length>0){
              setStartWeight(result.rows.item(0).start_weight); 
            }
            else{
     
              return 0;

            }
          }
        );
      });
    } catch(err) {
      console.log(err)
    }

  }

  useEffect(() => {

    if(isFocused){
      getInitialData();
    }

  }, [isFocused]);



  const updateData = async () => {
    try {
      // update DOB, gender, height 
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE user_profile SET dob="+dob.getTime()+", gender='"+gender+"', height="+height+" WHERE userID='"+userID+"'",
          [],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log(result);
              console.log('Update query profile successful');
            } else {
              console.error('Update query profile failed or no rows were affected');
            }
          },
          (_, error) => {
            console.error('Update query profile failed with error: ', error);
          }
        ); 
      // update metrics 
      await tx.executeSql(
        "UPDATE user_metrics SET weight='"+weightMetric+"', height='"+heightMetric+"' WHERE userID='"+userID+"'",
        [],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log(result);
            console.log('Insert query metrics was successful');
          } else {
            console.error('Update query user_metrics failed or no rows were affected');
            }
          },
          (_, error) => {
            console.error('Insert query metrics failed with error: ', error);
          }
        ); 
      // update current weight to goals 
      await tx.executeSql(
        "UPDATE user_goals SET start_weight="+startWeight+" WHERE userID='"+userID+"'",
        [],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log(result);
            console.log('Update query goals was successful');
          } else {
            console.error('Update query user_goals failed or no rows were affected');
          }
        },
        (_, error) => {
          console.error('Insert query goals failed with error: ', error);
        }
      );
    })

      navigation.navigate('Goal Setup',userID);

    } catch(err) {
      console.log(err)
    }  
  }

    
  //Load default values
  const [showDatePicker, setShowDatePicker] = useState(false);
  const onDateChange = (event,selectedDate) => {
    setSelectedDate(selectedDate); 
  }
  const onDateSelect = () => {
    setDob(selectedDate);
    setShowDatePicker(false); 
  } 
  const onDateExit = () => {
    setShowDatePicker(false); 
  } 

  return(
    <SafeAreaView style={styles.safeArea}>

      <OnboardingStepIndicator step1="done" step2="done" step3="pending"/>
      
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',}} behavior="padding" enabled>

      <View style ={styles.content}>

        <ScrollView style={{height:"100%"}}>

          <View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Height</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={3}
                  clearTextOnFocus='true'
                  onChangeText={(text) => setHeight(text)}
                  >{height}</TextInput>
              </View>
              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Metric</Text>
                <ToggleTwoButtons
                  button1Text="CM"
                  button1Condition={heightMetric==="CM"}
                  onButton1Press={()=> setHeightMetric("CM")}
                  button2Text="FT"
                  button2Condition={heightMetric==="FT"}
                  onButton2Press={()=> setHeightMetric("FT")}
                />
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Current Weight</Text>
                <TextInput style={styles.input}
                keyboardType="numeric"
                returnKeyType='done'
                maxLength={5}
                clearTextOnFocus='true'
                onChangeText={(text) => setStartWeight(text)}
                >{startWeight}</TextInput>
              </View>
              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Metric</Text>
                <ToggleTwoButtons
                  button1Text="KG"
                  button1Condition={weightMetric==="KG"}
                  onButton1Press={()=>setWeightMetric("KG")}
                  button2Text="LBS"
                  button2Condition={weightMetric==="LBS"}
                  onButton2Press={()=>setWeightMetric("LBS")}
                />
              </View>
            </View>

            <View>
              <Text style={styles.fieldHeading}>Gender</Text>
              <ToggleThreeButtons
                button1Text="MALE"
                button1Condition={gender==="MALE"}
                onButton1Press={()=>setGender("MALE")}
                button2Text="FEMALE"
                button2Condition={gender==="FEMALE"}
                onButton2Press={()=>setGender("FEMALE")}
                button3Text="OTHERS"
                button3Condition={gender==="OTHERS"}
                onButton3Press={()=>setGender("OTHERS")}
              />
            </View>

            <View>
              <Text style={styles.fieldHeading}>Date of Birth</Text>
              <TouchableOpacity 
                  onPress={()=> setShowDatePicker(true)}
                  style={styles.input}>
                <Text style={{color:'white', paddingVertical:10}}>{format(dob, "dd-MMM-yyyy")}</Text> 
              </TouchableOpacity>
            </View>

          </View>


        <TouchableOpacity style={styles.primaryButton} onPress={() => {updateData()}}>
          <Text style={{fontWeight:'bold', color:'#D7D7D7'}}>Next </Text>
          <Ionicons name='arrow-forward' size='30' color='#D7D7D7'/>
        </TouchableOpacity>
        
        </ScrollView>

      </View>

      </KeyboardAvoidingView>


      {showDatePicker ? (
            <View style={styles.datePicker}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderTopWidth:3, borderColor:'#D9D9D9'}}>
                <TouchableOpacity style={{padding:5, backgroundColor:'#13181A'}}onPress={onDateExit}><Ionicons name='close' size='30' color='#D9D9D9'/></TouchableOpacity>
                <Text style={{padding:5, color:'#D9D9D9'}}>Select Date</Text>
                <TouchableOpacity style={{padding:5, backgroundColor:'#13181A'}}onPress={onDateSelect}><Ionicons name='checkmark' size='30' color='#D9D9D9'/></TouchableOpacity>
              </View>
              <DateTimePicker
                value={dob}
                mode='date'
                maximumDate={new Date()}
                themeVariant="dark" 
                onChange={onDateChange}
                display='spinner'
              />
            </View>
      ): null}


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
    datePicker: {
      position:'absolute',
      zIndex:1,
      backgroundColor:'#13181A',
      bottom:0,
      width:"100%",
      justifyContent:'center', 
    },
  
  });
  