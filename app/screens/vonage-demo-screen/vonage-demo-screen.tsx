import React, { useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native'
import { Button, FormRow, Screen, Text } from "../../components"
import config from "../../config"

const ROOT: ViewStyle = {
  flex: 1,
}

const FORM_TEXT: TextStyle = { color: 'gray' }

const BUTTON_TEXT: TextStyle = { color: 'black' }

const OT_STYLE: ViewStyle = { width: 100, height: 100 }

export const VonageDemoScreen = function VonageDemoScreen() {
  const [apiKey, setApiKey] = useState(config.vonage.apiKey)
  const [sessionId, setSessionId] = useState(config.vonage.sessionId)
  const [token, setToken] = useState(config.vonage.token)
  const [connect, setConnect] = useState<boolean>(Boolean(apiKey && sessionId && token))

  return (
    <Screen style={ROOT} preset="scroll">
      {(connect) ? (
        <>
          <OTSession apiKey={apiKey} sessionId={sessionId} token={token}>
            <OTPublisher style={OT_STYLE} />
            <OTSubscriber style={OT_STYLE} />
          </OTSession>
          <Button>
            <Text style={BUTTON_TEXT} onPress={() => {
              setConnect(false)
            }}>Disconnect</Text>
          </Button>
        </>
      ) : (
        <>
          <FormRow preset="clear">
            <Text style={FORM_TEXT}>Api Key</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => setApiKey(text)}
              value={apiKey}
            />
          </FormRow>
          <FormRow preset="clear">
            <Text style={FORM_TEXT}>Session Id</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => setSessionId(text)}
              value={sessionId}
            />
          </FormRow>
          <FormRow preset="clear">
            <Text style={{ color: 'gray' }}>Token</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => setToken(text)}
              value={token}
            />
          </FormRow>
          <FormRow preset="clear">
            <Button onPress={() => setConnect(true)} disabled={!apiKey || !sessionId || !token}>
              <Text style={BUTTON_TEXT}>Connect</Text>
            </Button>
          </FormRow>
        </>
      )}
    </Screen>
  )
}
