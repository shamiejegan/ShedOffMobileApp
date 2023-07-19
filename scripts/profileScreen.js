import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useIsFocused } from "@react-navigation/native";

import { format } from "date-fns";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as SQLite from 'expo-sqlite';

// custom components
import PageHeading from './components/pageHeading';
import ToggleTwoButtons from './components/toggleTwoButtons';
import ToggleThreeButtons from './components/toggleThreeButtons';
import BottomNavigationBar from './components/bottomNavigationBar';

export default function ProfileScreen({navigation,route}){

  const userID = route.params; 
  const isFocused = useIsFocused();

  const db = SQLite.openDatabase('userDB.db');

  const [email,setEmail]= useState(""); 
  const [dob,setDob]= useState(0); 
  const [gender,setGender]= useState(""); 
  const [height,setHeight]= useState(0); 

  const [heightMetric, setHeightMetric]= useState("CM"); 
  const [weightMetric, setWeightMetric]= useState("KG"); 
  const [volumeMetric, setVolumeMetric]= useState("L"); 
  const [energyMetric, setEnergyMetric]= useState("KCAL"); 

  //configurations for date pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const getInitialData = async () => {
    try {
      await db.transaction(async(tx) => {
        await tx.executeSql(
          'SELECT * FROM user_profile WHERE userid="'+userID+'"',
          [],
          (_, user_profile) => {
            if(user_profile.rows.length>0){

              console.log(user_profile.rows.item(0));
              setEmail(user_profile.rows.item(0).email); 
              setDob(new Date(user_profile.rows.item(0).dob));
              setGender(user_profile.rows.item(0).gender); 
              setHeight(user_profile.rows.item(0).height); 
            }
            else{
              return 0;
            }
          }
        );
        await tx.executeSql(
          'SELECT * FROM user_metrics WHERE userid="'+userID+'"',
          [],
          (_, user_metrics) => {
            if(user_metrics.rows.length>0){
              console.log(user_metrics.rows.item(0));
              setWeightMetric(user_metrics.rows.item(0).weight); 
              setHeightMetric(user_metrics.rows.item(0).height); 
              setEnergyMetric(user_metrics.rows.item(0).energy); 
              setVolumeMetric(user_metrics.rows.item(0).volume); 
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
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE user_metrics SET weight='"
          + weightMetric+"'"
          +", height='"+heightMetric+"'"
          +", volume='"+volumeMetric+"'"
          +", energy='"+energyMetric+"'"
          +" WHERE userID='"+userID+"'",
          [],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log(result);
              console.log('Update query user_metrics successful');
            } else {
              console.error('Update query user_metrics failed or no rows were affected');
            }
          },
          (_, error) => {
            console.error('Update query user_metrics failed with error: ', error);
          }
        );
        await tx.executeSql(
          "UPDATE user_profile SET dob="
          + dob.getTime()
          +", gender='"+gender+"'"
          +", height="+height
          +" WHERE userID='"+userID+"'",
          [],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log(result);
              console.log('Update query user_profile successful');
            } else {
              console.error('Update query user_profile failed or no rows were affected');
            }
          },
          (_, error) => {
            console.error('Update query user_profile failed with error: ', error);
          }
        );

      })


    } catch(err) {
      console.log(err)
    }  
  }

  const logout = async () => {
    
    try {

      console.log("Test")
      
      updateData(); 

      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE user_profile SET loggedin=0"
          +" WHERE userID='"+userID+"'",
          [],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log(result);
              console.log('Update query user_profile successful');
            } else {
              console.error('Update query user_profile failed or no rows were affected');
            }
          },
          (_, error) => {
            console.error('Update query user_profile failed with error: ', error);
          }
        );

      })

      navigation.navigate('Welcome');

    } catch(err) {
      console.log(err)
    }  
  }



  return(
    <SafeAreaView style= {styles.safeArea}>
      
      <PageHeading title="Manage Profile"/>

      {/* avoid the screen from being blocked when users are entering values */}
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled>

      <ScrollView style={{paddingHorizontal:"5%", paddingVertical:20}}>

        <View>
          <Text style={styles.sectionHeading}>Username (Email)</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignContent:'center'}}>
            <Text style={styles.uneditableText}>{email}</Text>
            {/* <TouchableOpacity>
              <Text style={[styles.uneditableText,{color:'#90CAF9', fontWeight:'bold'}]}>Change</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <Text style={styles.sectionHeading}>About You</Text>

          <View style={styles.inputSection}>

          <View>
            <Text style={styles.fieldHeading}>Height ({heightMetric})</Text>
            <TextInput style={styles.input}
              keyboardType="numeric"
              returnKeyType='done'
              maxLength={5}
              onChangeText={(text) => setHeight(text)}
              >{height}</TextInput>
          </View>

          <View>
            <Text style={styles.fieldHeading}>Date of Birth</Text>
            <TouchableOpacity 
                onPress={()=> setShowDatePicker(true)}
                style={styles.input}>
              <Text style={{color:'white', paddingVertical:10}}>{format(dob, "dd-MMM-yyyy")}</Text> 
            </TouchableOpacity>
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

        </View>


          <Text style={styles.sectionHeading}>Preferred Metric System</Text>

          <View style={styles.inputSection}>

          <View>
            <Text style={styles.fieldHeading}>Weight Metric</Text>
            <ToggleTwoButtons
              button1Text="KG"
              button1Condition={weightMetric==="KG"}
              onButton1Press={()=>setWeightMetric("KG")}
              button2Text="LBS"
              button2Condition={weightMetric==="LBS"}
              onButton2Press={()=>setWeightMetric("LBS")}
            />
          </View>

          <View>
            <Text style={styles.fieldHeading}>Height Metric</Text>
            <ToggleTwoButtons
              button1Text="CM"
              button1Condition={heightMetric==="CM"}
              onButton1Press={()=> setHeightMetric("CM")}
              button2Text="FT"
              button2Condition={heightMetric==="FT"}
              onButton2Press={()=> setHeightMetric("FT")}
            />
          </View>

          <View>
            <Text style={styles.fieldHeading}>Energy Metric</Text>
            <ToggleTwoButtons
              button1Text="KCAL"
              button1Condition={energyMetric==="KCAL"}
              onButton1Press={()=> setEnergyMetric("KCAL")}
              button2Text="KJ"
              button2Condition={energyMetric==="KJ"}
              onButton2Press={()=> setEnergyMetric("KJ")}
            />
          </View>

          <View>
            <Text style={styles.fieldHeading}>Volume Metric</Text>
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
          
        <TouchableOpacity 
          onPress={() => {logout();}} 
          style={{borderColor:'white', borderWidth:1, width:"50%",marginTop:10,marginBottom:100, borderRadius:10, alignSelf:'center', backgroundColor:"#00090"}}>
          <Text style={[styles.logout]}>Logout</Text>
        </TouchableOpacity>

        </ScrollView>

        </KeyboardAvoidingView>
               
        <BottomNavigationBar 
          currentPage="Profile" 
          actionHome={() => {updateData(); navigation.navigate('Home',userID);}}
          actionGoals={() => {updateData(); navigation.navigate('Goals',userID);}}
          actionEntries={() => {updateData(); navigation.navigate('Entries',userID);}}
          actionProfile={() => {updateData(); navigation.navigate('Profile',userID);}}
        />

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
}
const styles = StyleSheet.create({

  inputSection: {
    marginVertical:10,
  },
  
  //navigators 
  navigator:{
    flexDirection:'row', 
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:'5%',
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
  
  //sections 
  safeArea: {
    backgroundColor: '#13181A',
    justifyContent:'flex-start',
    flexDirection:"column",
    flex:1, 
    height:"100%",
    width:"100%",
  },
  homeHeading: {
    width:'100%', 
    flexDirection:'row',
    paddingHorizontal:20,
    justifyContent:'space-between',
    paddingVertical:20,
    borderBottomWidth:2,
    borderColor:'#222'
  },
  topTitle: {
    fontSize: 28, 
    fontWeight:'bold', 
    color:'white',
  },
  sectionHeading:{
    color: '#D9D9D9',
    fontWeight:'bold',
    fontSize:16,
    marginTop:15,
    paddingBottom:5,
  },
  sectionRow: {
    backgroundColor:'#1A2229', 
    height:55, 
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderTopWidth:1,
    borderWidth:1,
    borderColor:'#13181A',
  },
  rowDescriptions:{
    flexDirection:'column', 
    width:"40%"
  },
  rowTitle: {
    color:'white',
    paddingLeft:20,
  },
  rowSubtitle: {
    color:'#D9D9D9', 
    fontSize:10,
    paddingLeft:20,
    paddingTop:5
  },  
  fieldHeading:{
    color:'#AAA',
  },
  uneditableText: {
    alrightSelf:'stretch',
    marginTop:10,
    height: 40,
    borderRadius:5, 
    paddingHorizontal:10,
    color:'white',
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

  logout:{
    color:'#FF0000',
    fontSize:16,
    fontWeight:'bold',
    alignSelf:'center',
    paddingVertical:10
  }

})