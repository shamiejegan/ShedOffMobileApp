import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useIsFocused } from "@react-navigation/native";

import { format } from "date-fns";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as SQLite from 'expo-sqlite';

//custom components
import PageHeading from './components/pageHeading';
import BottomNavigationBar from './components/bottomNavigationBar';


export default function GoalScreen({navigation, route}){

  const userID = route.params; 
  const isFocused = useIsFocused();

  const db = SQLite.openDatabase('userDB.db');

  const [changeDetected, setChangeDetected]=useState(0);

  //configurations for weight
  const [startWeight, setStartWeight] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [targetWeight, setTargetWeight] =  useState(0);

  const [weightMetric, setWeightMetric]= useState("KG"); 
  const [energyMetric, setEnergyMetric]= useState("KCAL"); 
  const [volumeMetric, setVolumeMetric]= useState("L"); 

  //configurations for activities
  const [foodGoal, setFoodGoal] = useState(0);
  const [exerciseGoal, setExerciseGoal] = useState(0);
  const [waterGoal, setWaterGoal] = useState(0);
  const [infGoal, setInfGoal] = useState(0);
  const [sleepGoal, setSleepGoal] = useState(0);

  const dayinDateTime = (60 * 60 * 24 *1000); 

  function reduceDateGranularity(inputDateTimeInt){
    return Math.floor(inputDateTimeInt/dayinDateTime)*dayinDateTime;
  }

  //configurations for date pickers
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onDateChange = (event,selectedDate) => {
    setSelectedDate(selectedDate); //update date to selected date
  }

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const onStartDateSelect = () => {
    setStartDate(selectedDate); //update date to selected date
    setShowStartDatePicker(false); //update date to selected date
    setChangeDetected(1);
  } 
  const onStartDateExit = () => {
    setShowStartDatePicker(false); //update date to selected date
  } 

  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const onEndDateSelect = () => {
    setEndDate(selectedDate); //update date to selected date
    setShowEndDatePicker(false); //update date to selected date
    setChangeDetected(1);
  } 
  const onEndDateExit = () => {
    setShowEndDatePicker(false); //update date to selected date
  } 
  
  const getInitialData = async () => {
    try {
      await db.transaction(async(tx) => {
        await tx.executeSql(
          'SELECT * FROM user_goals WHERE userid="'+userID+'"',
          [],
          (_, user_goals) => {
            if(user_goals.rows.length>0){
              console.log(user_goals.rows.item(0));
              setStartWeight(user_goals.rows.item(0).start_weight); 
              setTargetWeight(user_goals.rows.item(0).target_weight); 
              setFoodGoal(user_goals.rows.item(0).food_target); 
              setExerciseGoal(user_goals.rows.item(0).exercise_target); 
              setWaterGoal(user_goals.rows.item(0).water_target); 
              setInfGoal(user_goals.rows.item(0).inf_target); 
              setSleepGoal(user_goals.rows.item(0).sleep_target); 
              setStartWeight(user_goals.rows.item(0).start_weight); 
              setStartDate(new Date(user_goals.rows.item(0).start_date));
              setEndDate(new Date(user_goals.rows.item(0).target_date));
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
              setWeightMetric(result.rows.item(0).weight); 
              setEnergyMetric(result.rows.item(0).energy); 
              setVolumeMetric(result.rows.item(0).volume); 
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

  //update data when any of the data is updated 
  useEffect(() => {
    if(changeDetected==1){
      console.log("Data change detected");
      updateData();
      setChangeDetected(0);
    }
  }, [changeDetected]);

  const updateData = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE user_goals SET start_date=?, target_date=?, start_weight=?, target_weight=?, food_target=?, exercise_target=?, water_target=?, inf_target=?, sleep_target=? WHERE userID=?",
          [reduceDateGranularity(startDate.getTime()),reduceDateGranularity(endDate.getTime()),startWeight,targetWeight,foodGoal,exerciseGoal,waterGoal,infGoal,sleepGoal,userID],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log(result);
              console.log('Update query user_goals successful');
            } else {
              console.error('Update query user_goals failed or no rows were affected');
            }
          },
          (_, error) => {
            console.error('Update query user_goals failed with error: ', error);
          }
        ); 
      })


    } catch(err) {
      console.log(err)
    }  
  }



  return(
    <SafeAreaView style= {styles.safeArea}>

      <PageHeading title = "Modify goals"/>

      {/* avoid the screen from being blocked when users are entering values */}
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled>

      <ScrollView style={{paddingBottom:150}}>

        {/* weight goals */}
        <View style={styles.entriesSection}>

          <Text style={styles.fieldHeading}>Weight Goals</Text>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Start Weight ({weightMetric})</Text>
            </View>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Target Weight ({weightMetric})</Text>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <TextInput 
                style={styles.inputText}
                keyboardType='numeric'
                returnKeyType='done'
                maxLength='5'
                onChangeText={(text) => {setStartWeight(text);setChangeDetected(1);}}
              >{startWeight}</TextInput>
            </View>
            <View style={{width:"50%"}}>
              <TextInput 
                style={styles.inputText}
                keyboardType='numeric'
                returnKeyType='done'
                maxLength='5'
                onChangeText={(text) => {setTargetWeight(text);setChangeDetected(1);}}
              >{targetWeight}</TextInput>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Start Date</Text>
            </View>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Target Date</Text>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <TouchableOpacity 
                onPress={()=> setShowStartDatePicker(true)}>
                <Text style={styles.inputText}>{format(startDate, "dd-MMM-yyyy")}</Text> 
              </TouchableOpacity>
            </View>
            <View style={{width:"50%"}}>
              <TouchableOpacity 
                onPress={()=> setShowEndDatePicker(true)}>
                <Text style={styles.inputText}>{format(endDate, "dd-MMM-yyyy")}</Text> 
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* daily goals */}
        <View style={styles.entriesSection}>

          <Text style={styles.fieldHeading}>Daily Activity Goals</Text>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Food ({energyMetric})</Text>
            </View>
            <View style={{width:"50%"}}>
              <TextInput 
                style={styles.inputText}
                keyboardType='number-pad'
                returnKeyType='done'
                maxLength='4'
                onChangeText={(text) => {setFoodGoal(text);setChangeDetected(1);}}
              >{foodGoal}</TextInput>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Exercise ({energyMetric})</Text>
            </View>
            <View style={{width:"50%"}}>
              <TextInput 
                style={styles.inputText}
                keyboardType='number-pad'
                returnKeyType='done'
                maxLength='4'
                onChangeText={(text) => {setExerciseGoal(text);setChangeDetected(1);}}
              >{exerciseGoal}</TextInput>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Water ({volumeMetric})</Text>
            </View>
            <View style={{width:"50%"}}>
              <TextInput 
                style={styles.inputText}
                keyboardType='numeric'
                returnKeyType='done'
                maxLength='4'
                onChangeText={(text) => {setWaterGoal(text);setChangeDetected(1);}}
              >{waterGoal}</TextInput>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Fasting (HR)</Text>
            </View>
            <View style={{width:"50%"}}>
              <TextInput 
                style={styles.inputText}
                keyboardType='numeric'
                returnKeyType='done'
                maxLength='4'
                onChangeText={(text) => {setInfGoal(text);setChangeDetected(1);}}
              >{infGoal}</TextInput>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <View style={{width:"50%"}}>
              <Text style={styles.rowTitle}>Sleep (HR)</Text>
            </View>
            <View style={{width:"50%"}}>
              <TextInput 
                style={styles.inputText}
                keyboardType='numeric'
                returnKeyType='done'
                maxLength='4'
                onChangeText={(text) => {setSleepGoal(text);setChangeDetected(1);}}
              >{sleepGoal}</TextInput>
            </View>
          </View>

        </View>
      </ScrollView>

      </KeyboardAvoidingView>

      {/* only showStartDatePicker date picker at bottom of screen when state is on showStartDatePicker */}
      {showStartDatePicker ? (
            <View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderTopWidth:1, paddingTop:10,borderColor:'#D9D9D9'}}>
                <TouchableOpacity style={{padding:5, backgroundColor:'#13181A'}}onPress={onStartDateExit}><Ionicons name='close' size='30' color='#D9D9D9'/></TouchableOpacity>
                <Text style={{padding:5, color:'#D9D9D9'}}>Select Start Date</Text>
                <TouchableOpacity style={{padding:5, backgroundColor:'#13181A'}}onPress={onStartDateSelect}><Ionicons name='checkmark' size='30' color='#D9D9D9'/></TouchableOpacity>
              </View>
              <DateTimePicker
                value={startDate}
                mode='date'
                maximumDate={new Date()}
                themeVariant="dark" 
                onChange={onDateChange}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              />
            </View>
      ): null}
      {/* only showEndDatePicker date picker at bottom of screen when state is on showEndDatePicker */}
      {showEndDatePicker ? (
            <View style={styles.datePicker}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderTopWidth:3, borderColor:'#D9D9D9'}}>
                <TouchableOpacity style={{padding:5, backgroundColor:'#13181A'}}onPress={onEndDateExit}><Ionicons name='close' size='30' color='#D9D9D9'/></TouchableOpacity>
                <Text style={{padding:5, color:'#D9D9D9'}}>Select Date</Text>
                <TouchableOpacity style={{padding:5, backgroundColor:'#13181A'}}onPress={onEndDateSelect}><Ionicons name='checkmark' size='30' color='#D9D9D9'/></TouchableOpacity>
              </View>
              <DateTimePicker
                value={endDate}
                mode='date'
                minimumDate={startDate}
                themeVariant="dark" 
                onChange={onDateChange}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              />
            </View>
      ): null}

        <BottomNavigationBar 
          currentPage="Goals" 
          actionHome={() => {navigation.navigate('Home',userID);}}
          actionGoals={() => {navigation.navigate('Goals',userID);}}
          actionEntries={() => {navigation.navigate('Entries',userID);}}
          actionProfile={() => {navigation.navigate('Profile',userID);}}
        />

      <StatusBar style="light"/>
    </SafeAreaView>    
  );
}
const styles = StyleSheet.create({
  

  safeArea: {
    backgroundColor: '#13181A',
    justifyContent:'flex-start',
    flexDirection:"column",
    flex:1, 
    height:"100%",
    width:"100%",
  },
  sectionRow: {
    height:55, 
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    borderTopWidth:1,
    borderWidth:1,
    borderColor:'#13181A',
  },
  rowTitle: {
    color:'#AAA',
    paddingLeft:20,
  },
  inputText: {
    color:'#D9D9D9', 
    borderColor:'#555',
    borderWidth:'0.5', 
    marginHorizontal:15,
    padding:10, 
    borderRadius:5,
    width:'80%',
    backgroundColor:'#232D37',
  },
  inputMetric: {
    color:'#D9D9D9', 
    borderRadius:'2px',
    borderColor:'white',
    justifyContent:'flex-end'
  },
  fieldHeading:{
    color:'#D9D9D9',
    fontWeight:'bold',
    paddingBottom:15,
  },
  entriesSection:{
    width:"100%",
    padding:15
  }
    
  

})