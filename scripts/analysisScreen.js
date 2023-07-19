import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { useState } from 'react';

// custom components
import PageHeading from './components/pageHeading';

export default function AnalysisScreen({navigation, route}){

  return(
      <SafeAreaView style= {styles.safeArea}>
        
        <PageHeading title="Trend Analysis"/>

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
  homeHeading: {
    width:'100%', 
    flexDirection:'row',
    paddingHorizontal:20,
    justifyContent:'space-between',
    paddingVertical:20,
  },
  topTitle: {
    fontSize: 28, 
    fontWeight:'bold', 
    color:'white',
  },

})