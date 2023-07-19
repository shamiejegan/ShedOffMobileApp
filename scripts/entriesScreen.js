import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, KeyboardAvoidingView} from 'react-native';
import {useState, useEffect} from 'react';
import { useIsFocused } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as SQLite from 'expo-sqlite';

import { format } from "date-fns";

//custom components
import PageHeading from './components/pageHeading';
import BottomNavigationBar from './components/bottomNavigationBar';

export default function EntriesScreen({navigation, route}){

  const userID = route.params; 
  const isFocused = useIsFocused();

  const db = SQLite.openDatabase('userDB.db');

  const [changeDetected, setChangeDetected]=useState(0);
  const [weightShown, setWeightShown] = useState(0);
  const [foodShown, setFoodShown] = useState(0);
  const [exerciseShown, setExerciseShown] = useState(0);
  const [waterShown, setWaterShown] = useState(0);
  const [infShown, setInfShown] = useState(0);
  const [sleepShown, setSleepShown] = useState(0);

  const [dateOffset, setDateOffset] = useState(0);

  const [weightMetric, setWeightMetric]= useState("KG"); 
  const [energyMetric, setEnergyMetric]= useState("KCAL"); 
  const [volumeMetric, setVolumeMetric]= useState("L"); 

  const dayinDateTime = (60 * 60 * 24 *1000); 

  function reduceDateGranularity(inputDateTimeInt){
    return Math.floor(inputDateTimeInt/dayinDateTime)*dayinDateTime;
  }

  function stateMonitor(){
    console.log("changeDetected",changeDetected,"weightShown",weightShown,"foodShown",foodShown,"exerciseShown",exerciseShown,"waterShown",waterShown,"infShown",infShown,"sleepShown",sleepShown,"dateOffset",dateOffset);
  }
  
  const addDate = () => {
    stateMonitor();
    console.log(dateOffset);
    //pull records from database again and update records to value for day after previous offset 
    getData(reduceDateGranularity(new Date().getTime() + dateOffset + dayinDateTime)); 
    setDateOffset(dateOffset+dayinDateTime);
  }
  const subtractDate = () => {
    stateMonitor();
    console.log(dateOffset);
    //pull records from database again and update records to value for day before previous offset 
    getData(reduceDateGranularity(new Date().getTime() + dateOffset - dayinDateTime)); //pull records from database again
    setDateOffset(dateOffset-dayinDateTime);
  }

  const getData = async (dateToPull) => {
    console.log("Getting Data...");
    stateMonitor();
    try {
      await db.transaction(async(tx) => {
        await tx.executeSql(
          'SELECT * FROM user_entries WHERE userid="'+userID+'" ORDER BY entry_date DESC',
          [],
          (_, user_entries) => {
            if(user_entries.rows.length>0){

              var entries = user_entries.rows["_array"];
              console.log("all entries: ", entries);

              console.log("date being queired: ", dateToPull);
              var filteredEntry = entries.find(e => e.entry_date === dateToPull); 

              // if there's a value matching the datetime being queried
              if(filteredEntry){
                console.log("Record Found"); 
                console.log("date of entryShown:",new Date(filteredEntry.entry_date));
                console.log("entryShown: ", filteredEntry);
                setWeightShown(filteredEntry.weight);
                setFoodShown(filteredEntry.food);
                setExerciseShown(filteredEntry.exercise);
                setWaterShown(filteredEntry.water);
                setInfShown(filteredEntry.inf);
                setSleepShown(filteredEntry.sleep);
                //reset filtered Entry
                filteredEntry =null; 
              }
              else{
                // if there's are no value matching the datetime being queried, add 
                console.log("Adding new entry"); 
                addRecord();
                setWeightShown(0);
                setFoodShown(0);
                setExerciseShown(0);
                setWaterShown(0);
                setInfShown(0);
                setSleepShown(0);
              }
            }
            else{
              console.log("No records for user yet");
              addRecord();
              setWeightShown(0);
              setFoodShown(0);
              setExerciseShown(0);
              setWaterShown(0);
              setInfShown(0);
              setSleepShown(0);
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
    stateMonitor();
    if(isFocused){
      console.log("Entries page loaded");
      getData(reduceDateGranularity(new Date().getTime()));
    }
  }, [isFocused]);

  //update data when any of the data is updated 
  useEffect(() => {
    if(changeDetected==1){
      console.log(weightShown,foodShown,exerciseShown,waterShown,infShown,sleepShown);
      console.log("Data change detected");
      updateRecord();
      setChangeDetected(0);
    }
  }, [changeDetected]);

  const addRecord = async () => {
    stateMonitor();
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "INSERT INTO user_entries (entryid, entry_date, userid, weight, food, exercise, inf, sleep, water) VALUES (?,?,?,?,?,?,?,?,?)",
          [reduceDateGranularity((new Date().getTime() + dateOffset))+userID, reduceDateGranularity(new Date().getTime() + dateOffset), userID, weightShown, foodShown, exerciseShown, infShown, sleepShown, waterShown],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log('Added new record');
            } else {
              console.error('Insert query failed or no rows were affected');
            }
          },
        (_, error) => {
            console.error('Add record to user_entries failed with error: ', error);
            // updateRecord();
          }
        ); 
      })
    } catch(err) {
      console.log(err)
    }  
  }

  const updateRecord = async () => {
    stateMonitor();
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE user_entries SET weight=?, food=?, exercise=?, inf=?, sleep=?, water=? WHERE userID=? AND entry_date=?",
          [weightShown,foodShown,exerciseShown, infShown,sleepShown,waterShown,userID,reduceDateGranularity(new Date().getTime() + dateOffset)],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log('Updated existing record');
            } else {
              console.error('Insert query failed or no rows were affected');
            }
          },
        (_, error) => {
            console.error('Update query user_entries failed with error: ', error);
          }
        ); 
      })
    } catch(err) {
      console.log(err)
    }  
  }

  
  return(
    <SafeAreaView style= {styles.safeArea}>
        
      <PageHeading title = "Record Data"/>

      {/* avoid the screen from being blocked when users are entering values */}
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled>

        <ScrollView style={{height:"100%"}}>
          
          <View style={styles.dateFilter}>
            <TouchableOpacity onPress={()=>subtractDate()} style={styles.dateHeading}>
              <Ionicons name='arrow-back' size='16' color='#D9D9D9'/>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=>setShowDatePicker(true)} style={[styles.dateHeading,{width:"60%"}]}>
              <Text style={{color:'white', fontWeight:'bold',alignSelf:'center'}}>
                {reduceDateGranularity(new Date().getTime() + dateOffset) === reduceDateGranularity(new Date().getTime()) ? "TODAY":format(new Date(new Date().getTime() + dateOffset), "dd-MMM-yyyy")}
              </Text>
            </TouchableOpacity>
            
            {/* only show next arrow if the date is not beyond today*/}
            {reduceDateGranularity(new Date().getTime() + dateOffset) < reduceDateGranularity(new Date().getTime()) ? 
            (
              <TouchableOpacity onPress={()=>addDate()} style={styles.dateHeading}>
                <Ionicons name='arrow-forward' size='16' color='#D9D9D9'/>
              </TouchableOpacity>
            )
            : 
            (
              <View style={styles.dateHeading}></View>
            )
            }
          </View>

          <View style={styles.entriesSection}>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{width:"100%"}}>
                <Text style={styles.fieldHeading}>Weight ({weightMetric})</Text>
                <TextInput style={styles.input}
                  keyboardType="numeric"
                  returnKeyType='done'
                  maxLength={5}
                  onChangeText={(text) => {setWeightShown(text);setChangeDetected(1);}}
                  >{weightShown}</TextInput>
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{width:"100%"}}>
                <Text style={styles.fieldHeading}>Food ({energyMetric})</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={4}
                  onChangeText={(text) => {setFoodShown(text);setChangeDetected(1);}}
                  >{foodShown}</TextInput>
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{width:"100%"}}>
                <Text style={styles.fieldHeading}>Exercise ({energyMetric})</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={4}
                  onChangeText={(text) => {setExerciseShown(text);setChangeDetected(1);}}
                  >{exerciseShown}</TextInput>
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{width:"100%"}}>
                <Text style={styles.fieldHeading}>Water ({volumeMetric})</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={3}
                  onChangeText={(text) => {setWaterShown(text);setChangeDetected(1);}}
                  >{waterShown}</TextInput>
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{width:"100%"}}>
                <Text style={styles.fieldHeading}>Fasted Duration (HR)</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={2}
                  onChangeText={(text) => {setInfShown(text);setChangeDetected(1);}}
                  >{infShown}</TextInput>
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{width:"100%"}}>
                <Text style={styles.fieldHeading}>Sleep Duration (HR)</Text>
                <TextInput style={styles.input}
                  keyboardType="number-pad"
                  returnKeyType='done'
                  maxLength={2}
                  onChangeText={(text) => {setSleepShown(text);setChangeDetected(1);}}
                  >{sleepShown}</TextInput>
              </View>
            </View>
          </View>



        </ScrollView>

        </KeyboardAvoidingView>

        <BottomNavigationBar 
          currentPage="Entries" 
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

  dateFilter:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'center', 
    backgroundColor: '#0D47A1',
  },
  dateHeading: {
    color:'#D9D9D9',
    width:'20%',
    textAlign:'center',
    justifyContent:'center',
    padding:20,
    fontWeight:'bold'
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
    backgroundColor:'#232D37'
  },
  description:{
    color:'#D9D9D9',
    alignSelf:'center',
  },

  entriesSection:{
    width:"100%",
    padding:15
  }
  

})