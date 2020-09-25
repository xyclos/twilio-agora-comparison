/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your PrimaryNavigator) which the user
 * will use once logged in.
 */
import React from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { AgoraNavigator, TwilioNavigator, VonageNavigator } from "./primary-navigator"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * We recommend using MobX-State-Tree store(s) to handle state rather than navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type RootParamList = {
  primaryStack: undefined
}

const Stack = createNativeStackNavigator<RootParamList>()

// eslint-disable-next-line react/display-name
const RootStack = (navigator) => () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,

        stackPresentation: "modal",
      }}
    >
      <Stack.Screen
        name="primaryStack"
        component={navigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Vonage" component={RootStack(VonageNavigator)} />
      <Tab.Screen name="Agora" component={RootStack(AgoraNavigator)} />
      <Tab.Screen name="Twilio" component={RootStack(TwilioNavigator)} />
    </Tab.Navigator>
  )
}

export const RootNavigator = React.forwardRef<
  NavigationContainerRef,
  Partial<React.ComponentProps<typeof NavigationContainer>>
>((props, ref) => {
  return (
    <NavigationContainer {...props} ref={ref}>
      <Tabs />
    </NavigationContainer>
  )
})

RootNavigator.displayName = "RootNavigator"
