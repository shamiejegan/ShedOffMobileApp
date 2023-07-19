import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {useState, useEffect} from 'react';
import { useIsFocused } from "@react-navigation/native";

import * as SQLite from 'expo-sqlite';

//custom component
import StatButton from './components/statButton';
import PageHeading from './components/pageHeading';
import BottomNavigationBar from './components/bottomNavigationBar';

export default function HomeScreen({navigation,route}){

  const userID = route.params; 
  const isFocused = useIsFocused();

  const db = SQLite.openDatabase('userDB.db');

  const [entryShown, setEntryShown]=useState({"entry_date": 0, "entryid":0, "exercise": 0, "food": 0, "inf": 0, "sleep": 0, "userid":0, "water": 0, "weight": 0});

  const [weightMetric, setWeightMetric]= useState("KG"); 
  const [energyMetric, setEnergyMetric]= useState("KCAL"); 
  const [volumeMetric, setVolumeMetric]= useState("L"); 

  const [targetWeight, setTargetWeight] =  useState(0);
  const [startWeight, setStartWeight] =  useState(0);

  const [targetDate, setTargetDate] =  useState(0);
  const [startDate, setStartDate] =  useState(0);

  const [latestWeight, setLatestWeight] = useState(0);

  const dayinDateTime = (60 * 60 * 24 *1000); 

  const [foodGoal, setFoodGoal] = useState(0);
  const [exerciseGoal, setExerciseGoal] = useState(0);
  const [waterGoal, setWaterGoal] = useState(0);
  const [infGoal, setInfGoal] = useState(0);
  const [sleepGoal, setSleepGoal] = useState(0);


  function reduceDateGranularity(inputDateTimeInt){
    return Math.floor(inputDateTimeInt/dayinDateTime)*dayinDateTime;
  }

  const getInitialData = async () => {
    try {
      await db.transaction(async(tx) => {
        await tx.executeSql(
          'SELECT * FROM user_metrics WHERE userid="'+userID+'"',
          [],
          (_, result) => {
            if(result.rows.length>0){
              setWeightMetric(result.rows.item(0).weight); 
              setEnergyMetric(result.rows.item(0).energy); 
              setVolumeMetric(result.rows.item(0).volume); 
              console.log(result.rows.item(0));
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
              setTargetWeight(result.rows.item(0).target_weight); 
              setStartWeight(result.rows.item(0).start_weight); 
              setTargetDate(result.rows.item(0).target_date); 
              setStartDate(result.rows.item(0).start_date); 
              setFoodGoal(result.rows.item(0).food_target); 
              setExerciseGoal(result.rows.item(0).exercise_target); 
              setWaterGoal(result.rows.item(0).water_target); 
              setInfGoal(result.rows.item(0).inf_target); 
              setSleepGoal(result.rows.item(0).sleep_target); 
              console.log(result.rows.item(0));
            }
            else{
              return 0;
            }
          }
        );
        // get the weight for latest entry containing a weight
        await tx.executeSql(
          'SELECT * FROM user_entries WHERE entry_date= (SELECT MAX(entry_date) as latest_date FROM user_entries WHERE userid="'+userID+'" AND weight !=0 AND weight !="")',
          [],
          (_, result) => {
            if(result.rows.length>0){
              console.log(result.rows.item(0).weight)
              setLatestWeight(result.rows.item(0));
              console.log("latest available weight:",latestWeight);
            }
            else{
              setLatestWeight(0);
            }
          }
        );
        await tx.executeSql(
          'SELECT * FROM user_entries WHERE userid="'+userID+'" ORDER BY entry_date DESC',
          [],
          (_, user_entries) => {

            console.log("today's datetime:",reduceDateGranularity(new Date().getTime()));

            if(user_entries.rows.length>0){

              var entries = user_entries.rows["_array"];
              console.log("entries: ", entries);
              
              var filtered = entries.find(e => e.entry_date === reduceDateGranularity(new Date().getTime())); 

              if(filtered){
                setEntryShown(filtered);
              }

              console.log("today's entry: ", entryShown);
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
      console.log("Home page loaded");
      getInitialData();
    }

  }, [isFocused]);


  //calculate progress 
  var weightToReference = entryShown.weight==0 ? startWeight: entryShown.weight;
  var weightlost=startWeight-weightToReference; 
  var targetloss=startWeight-targetWeight; 
  var percent_achieved=Math.round(((weightlost/targetloss)*100)); 
  var percent_achieved_width=Math.round(Math.max(Math.min((percent_achieved),100),0));

  var targetdays=(reduceDateGranularity(targetDate) - reduceDateGranularity(startDate)) / dayinDateTime; 
  var dayspast=(reduceDateGranularity(new Date().getTime())-reduceDateGranularity(startDate)) / dayinDateTime; 
  var timepacing=Math.round(Math.max(Math.min(((dayspast/targetdays)*100),100),0)); 
  
  var progressline1=(timepacing<=percent_achieved_width ? "Keep up the great work!" : "Consistency is key! Keep to your daily activity goals to achieve your target!");
  var progressline2=`Day ${dayspast} (of ${targetdays}) of your weight loss cycle`;
  var progressline3=`Start:\n ${startWeight} ${weightMetric}`;
  var progressline4=`Current:\n ${weightToReference} ${weightMetric}`;
  var progressline5=`Target:\n ${targetWeight} ${weightMetric}`;
  var progressline6=`${percent_achieved_width}% towards goal  ` + (timepacing>=percent_achieved_width ? `(Ideal: ${timepacing}%)` : "");

  return(
    <SafeAreaView style={styles.safeArea}>
      
      <PageHeading
        title="Let's Get Healthy!"
      />

    <ScrollView style={styles.scrollArea}>
      
      <View style = {styles.todayStats}>

        <View style= {styles.headOfSection}>
          <View>
            <Text style= {styles.heading1}>Today's Stats</Text>
          </View>
        </View>

        <View style={styles.entriesSection}>
          <StatButton 
            entry={entryShown.weight? entryShown.weight:"+"} 
            action ={() => {navigation.navigate('Entries', userID)}}
            metric={weightMetric}
            title="Weight"
            entryMeetsGoal={timepacing<=percent_achieved_width}
            toShow={true}
          />
          <StatButton 
            entry={entryShown.food? entryShown.food:"+"} 
            action ={() => {navigation.navigate('Entries', userID)}}
            metric={energyMetric}
            title="Food"
            entryMeetsGoal={entryShown.food<=foodGoal}
            toShow={foodGoal>0}
          />
          <StatButton 
            entry={entryShown.exercise? entryShown.exercise:"+"} 
            action ={() => {navigation.navigate('Entries', userID)}}
            metric={energyMetric}
            title="Exercise"
            entryMeetsGoal={entryShown.exercise>=exerciseGoal}
            toShow={exerciseGoal>0}
          />
          <StatButton 
            entry={entryShown.water? entryShown.water:"+"} 
            action ={() => {navigation.navigate('Entries', userID)}}
            metric={volumeMetric}
            title="Water"
            entryMeetsGoal={entryShown.water>=waterGoal}
            toShow={waterGoal>0}
          />
          <StatButton 
            entry={entryShown.inf? entryShown.inf:"+"} 
            action ={() => {navigation.navigate('Entries', userID)}}
            metric="HR"
            title="Fasting"
            entryMeetsGoal={entryShown.inf>=infGoal}
            toShow={infGoal>0}
          />
          <StatButton 
            entry={entryShown.sleep? entryShown.sleep:"+"} 
            action ={() => {navigation.navigate('Entries', userID)}}
            metric="HR"
            title="Sleep"
            entryMeetsGoal={entryShown.sleep>=sleepGoal}
            toShow={sleepGoal>0}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} 
            onPress={() => {navigation.navigate('Goals', userID);}
          }>
            <Text style={{fontWeight:'bold', color:'#C9C9C9'}}>Modify Goals</Text>
          </TouchableOpacity>

      </View>

      <View>
        <View style= {styles.headOfSection}>
          <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
            <Text style= {styles.heading1}>Your Progress</Text>          
          </View>
        </View>
        <Text style={styles.progressSummaryText}>{progressline1}</Text>
        <Text style={styles.progressSummaryText}>{progressline2}</Text>
        <View style={styles.progressBar}>
            <View style={[styles.progressBarBase,{width:"100%"}]}></View>
            <View style={[styles.progressBarBase,{width:2,left:timepacing+"%",backgroundColor:'grey',position:'absolute', top:10}]}></View>
            <View style={[styles.progressBarBase,{height:30,width:percent_achieved_width+"%",backgroundColor:'#0da18c',position:'absolute',top:20}]}></View>
        </View>
        <View style={styles.progressSummary}>
          <View style={{flexDirection:"row", width:"100%", justifyContent:'space-between'}}>
            <Text style={styles.progressSummaryText}>{progressline3}</Text>
            <Text style={styles.progressSummaryText}>{progressline4}</Text>
            <Text style={styles.progressSummaryText}>{progressline5}</Text>
          </View>
          <Text style={[styles.progressSummaryText,{backgroundColor:'#232D37', paddingVertical:20, paddingHorizontal:20, marginTop: 10, marginBottom: 30}]}>{progressline6}</Text>
        </View>
    </View>



    </ScrollView>

    <BottomNavigationBar 
      navigation={navigation} 
      currentPage="Home" 
      userID={userID}
      actionHome={() => {navigation.navigate('Home',userID);}}
      actionGoals={() => {navigation.navigate('Goals',userID);}}
      actionEntries={() => {navigation.navigate('Entries',userID);}}
      actionProfile={() => {navigation.navigate('Profile',userID);}}
      />

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
    
    scrollArea:{
      paddingHorizontal:20,
    },   
    
    headOfSection: {
      paddingTop:20,
      marginBottom:5,
      flexDirection: 'row', 
      justifyContent:'space-between', 
      alignItems:'center',
    },
    heading1: {
      fontSize: 20, 
      fontWeight:'bold',
      color:'#C9C9C9'
    },

    //progress section 
    progressSummary: {
      flexWrap:'wrap',
      alignItems:'center',
      paddingVertical:10,
      paddingHori:10,
    },
    progressSummaryText: {
      fontSize: 14, 
      // width:"100%",
      color:'#C9C9C9',
      // alignSelf:'center',
      justifyContent:'center',
      paddingVertical:5,
    },

    progressBar: {
      paddingVertical:10,
    },
    progressBarBase: {
      paddingVertical:10,
      height: 50, 
      width:'100%',
      backgroundColor:'#232D37', 
    },
    pacingMarker:{
      color:'#D9D9D9',
    },
    

    //today's stats section 
    entriesSection: {
      flexDirection:'row',
      justifyContent:'flex-start',
      flexWrap:'wrap',
      paddingBottom:10,
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
  