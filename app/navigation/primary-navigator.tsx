/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { AgoraDemoScreen, TwilioDemoScreen, VonageDemoScreen } from "../screens"

const AgoraStack = createNativeStackNavigator()

export function AgoraNavigator() {
  return (
    <AgoraStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <AgoraStack.Screen name="welcome" component={AgoraDemoScreen} />
    </AgoraStack.Navigator>
  )
}

const TwilioStack = createNativeStackNavigator()

export function TwilioNavigator() {
  return (
    <TwilioStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <TwilioStack.Screen name="welcome" component={TwilioDemoScreen} />
    </TwilioStack.Navigator>
  )
}

const VonageStack = createNativeStackNavigator()

export function VonageNavigator() {
  return (
    <VonageStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <VonageStack.Screen name="welcome" component={VonageDemoScreen} />
    </VonageStack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
