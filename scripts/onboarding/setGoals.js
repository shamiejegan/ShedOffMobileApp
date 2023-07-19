import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState, useEffect} from 'react';

import * as SQLite from 'expo-sqlite';

//custom components
import OnboardingStepIndicator from '../components/onboardingStepIndicator';
import ToggleTwoButtons from '../components/toggleTwoButtons';

export default function SetGoals({navigation, route}){

  const userID = route.params; 

  const db = SQLite.openDatabase('userDB.db');

  const [targetWeight, setTargetWeight] = useState(0);
  const [weightMetric, setWeightMetric]= useState("KG"); 
  const [foodGoal, setFoodGoal]= useState(0);
  const [exerciseGoal, setExerciseGoal]= useState(0);
  const [energyMetric, setEnergyMetric]= useState("KCAL"); 
  const [waterGoal, setWaterGoal] = useState(0);
  const [volumeMetric, setVolumeMetric]= useState("L"); 
  const [infGoal, setInfGoal] = useState(0);
  const [sleepGoal, setSleepGoal] = useState(0);


  const existingDataCheck = async () => {
    try {
      // Check if there exists records for this user in user profile table 
      await db.transaction(async(tx) => {
        await tx.executeSql(
          'SELECT * FROM user_goals WHERE userid="'+userID+'"',
          [],
          (_, result) => {
            if(result.rows.length>0){
              setTargetWeight(result.rows.item(0).target_weight); 
              setFoodGoal(result.rows.item(0).food_target); 
              setExerciseGoal(result.rows.item(0).exercise_target); 
              setWaterGoal(result.rows.item(0).water_target); 
              setInfGoal(result.rows.item(0).inf_target); 
              setSleepGoal(result.rows.item(0).sleep_target); 
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
              console.log(weightMetric);
              console.log(result.rows.item(0));
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

    existingDataCheck();

  }, []);


  const updateData = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE user_goals SET start_date="
          + new Date().getTime()
          +", target_date="+new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime()
          +", target_weight="+targetWeight
          +", food_target="+foodGoal
          +", exercise_target="+exerciseGoal
          +", water_target="+waterGoal
          +", inf_target="+infGoal
          +", sleep_target="+sleepGoal
          +" WHERE userID='"+userID+"'",
          [],
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
        // update metrics 
        await tx.executeSql(
          "UPDATE user_metrics SET weight='"
          +weightMetric
          +"', energy='"
          +energyMetric
          +"', volume='"
          +volumeMetric
          +"' WHERE userID='"+userID+"'",
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
          "UPDATE user_profile SET loggedin=1, registered=1 WHERE userID='"+userID+"'",
          [],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log(result);
              console.log('Insert query user_profile was successful');
            } else {
              console.error('Update query user_profile failed or no rows were affected');
            }
          },
          (_, error) => {
            console.error('Insert query user_profile failed with error: ', error);
          }
        );
      })

      navigation.navigate('Home',userID); 

    } catch(err) {
      console.log(err)
    }  
  }



  return(
    <SafeAreaView style={styles.safeArea}>

      <OnboardingStepIndicator step1="done" step2="done" step3="done"/>

      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',}} behavior="padding" enabled>

        <View style ={styles.content}>

          <ScrollView>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>

              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Target Weight</Text>
                <TextInput style={styles.input}
                  keyboardType="numeric"
                  returnKeyType='done'
                  maxLength={5}
                  clearTextOnFocus='true'
                  onChangeText={(text) => setTargetWeight(text)}
                  >{targetWeight}</TextInput>
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

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>

              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Food Intake</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={4}
                  clearTextOnFocus='true'
                  onChangeText={(text) => setFoodGoal(text)}
                  >{foodGoal}</TextInput>
              </View>
              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Metric</Text>
                <ToggleTwoButtons
                  button1Text="KCAL"
                  button1Condition={energyMetric==="KCAL"}
                  onButton1Press={()=>setEnergyMetric("KCAL")}
                  button2Text="KJ"
                  button2Condition={energyMetric==="KJ"}
                  onButton2Press={()=>setEnergyMetric("KJ")}
                />
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>

              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Exercise Burn</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={4}
                  clearTextOnFocus='true'
                  onChangeText={(text) => setExerciseGoal(text)}
                  >{exerciseGoal}</TextInput>
              </View>
              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Metric</Text>
                <ToggleTwoButtons
                  button1Text="KCAL"
                  button1Condition={energyMetric==="KCAL"}
                  onButton1Press={()=>setEnergyMetric("KCAL")}
                  button2Text="KJ"
                  button2Condition={energyMetric==="KJ"}
                  onButton2Press={()=>setEnergyMetric("KJ")}
                />
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>

              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Water Consumption</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={3}
                  clearTextOnFocus='true'
                  onChangeText={(text) => setWaterGoal(text)}
                  >{waterGoal}</TextInput>
              </View>

              <View style={{width:"45%"}}>
                <View>
                  <Text style={styles.fieldHeading}>Metric</Text>
                  <ToggleTwoButtons
                    button1Text="L"
                    button1Condition={volumeMetric==="L"}
                    onButton1Press={()=>setVolumeMetric("L")}
                    button2Text="OZ"
                    button2Condition={volumeMetric==="OZ"}
                    onButton2Press={()=>setVolumeMetric("OZ")}
                  />
                </View>
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>

              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Fasted Hours</Text>
                  <TextInput style={styles.input}
                    keyboardType="number-pad"
                    returnKeyType='done'
                    maxLength={2}
                    clearTextOnFocus='true'
                    onChangeText={(text) => setInfGoal(text)}
                    >{infGoal}</TextInput>
              </View>

              <View style={{width:"45%"}}>
                <Text style={styles.fieldHeading}>Sleep Hours</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={2}
                  clearTextOnFocus='true'
                  onChangeText={(text) => setSleepGoal(text)}
                  >{sleepGoal}</TextInput>
              </View>

            </View>

            {/* Complete button */}
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => {updateData()}
            }>
              <Text style={{fontWeight:'bold', color:'#C9C9C9'}}>Complete Registration </Text>
              <Ionicons name='arrow-forward' size='30' color='#D7D7D7'/>
            </TouchableOpacity>
          
          </ScrollView>


        </View>
      </KeyboardAvoidingView>

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

    content: {
      padding:20,
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

});
  