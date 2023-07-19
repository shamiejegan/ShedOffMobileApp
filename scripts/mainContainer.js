import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

//import onboarding pages 
import Welcome from './onboarding/welcome';
import SignIn from './onboarding/signIn';
import SetProfile from './onboarding/setProfile';
import SetGoals from './onboarding/setGoals';
import SignUp from './onboarding/signUp';

// import all main screen pages 
import HomeScreen from './homeScreen';
import GoalScreen from './goalScreen';
import EntriesScreen from './entriesScreen';
// import AnalysisScreen from './analysisScreen';
import ProfileScreen from './profileScreen';

//onboarding screen names
const welcome = "Welcome"; 
const signIn = "Sign In"
const setProfile = "Profile Setup";
const setGoals = "Goal Setup";
const signUp = "Sign Up";

// main screen pages 
const homeScreen = 'Home';
const goalScreen = 'Goals';
const entriesScreen = 'Entries';
// const analysisScreen = 'Analysis';
const profileScreen = 'Profile';



const Stack = createStackNavigator();

export default function MainContainer(){
        
    return(
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={welcome}
            >
                <Stack.Screen name={welcome} component={Welcome} options={{headerShown: false, tabBarStyle: { display: "none" },}}/>
                <Stack.Screen name={homeScreen} component={HomeScreen} options={{headerShown: false}}/>
                <Stack.Screen name={goalScreen} component={GoalScreen} options={{headerShown: false}}/>
                <Stack.Screen name={entriesScreen} component={EntriesScreen} options={{headerShown: false}}/>
                {/* <Stack.Screen name={analysisScreen} component={AnalysisScreen} options={{headerShown: false}}/> */}
                <Stack.Screen name={profileScreen} component={ProfileScreen} options={{headerShown: false}}/>

                <Stack.Screen name={signIn} component={SignIn} options={{headerTintColor:'#DDD', headerBackTitleVisible:false ,tabBarStyle: { display: "none" },headerStyle:{backgroundColor:'#13181A'}}}/>
                <Stack.Screen name={signUp} component={SignUp} options={{headerTintColor:'#DDD', headerBackTitleVisible:false ,tabBarStyle: { display: "none" },headerStyle:{backgroundColor:'#13181A'}}}/>
                <Stack.Screen name={setProfile} component={SetProfile} options={{headerTintColor:'#DDD', headerBackTitleVisible:false ,tabBarStyle: { display: "none" },headerStyle:{backgroundColor:'#13181A'}}}/>
                <Stack.Screen name={setGoals} component={SetGoals} options={{headerTintColor:'#DDD', headerBackTitleVisible:false ,tabBarStyle: { display: "none" },headerStyle:{backgroundColor:'#13181A'}}}/>
            </Stack.Navigator>

        </NavigationContainer>
    );
}


