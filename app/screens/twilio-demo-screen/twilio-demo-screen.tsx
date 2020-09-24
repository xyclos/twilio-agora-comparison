import React, { useRef, useState } from "react"
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  // eslint-disable-next-line react-native/split-platform-components
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ViewStyle
} from "react-native"
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc'
import { Screen, Button } from "../../components"
import { color, spacing } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  button: {
    marginTop: 100,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4]
  },
  callContainer: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  // eslint-disable-next-line react-native/no-color-literals
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    height: 50,
    marginLeft: 70,
    marginRight: 70,
    marginTop: 50,
    textAlign: 'center'
  },
  localVideo: {
    bottom: 100,
    flex: 1,
    height: 250,
    position: "absolute",
    right: 10,
    width: 150
  },
  // eslint-disable-next-line react-native/no-color-literals
  optionButton: {
    alignItems: "center",
    backgroundColor: 'grey',
    borderRadius: 100 / 2,
    height: 60,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    width: 60
  },
  // eslint-disable-next-line react-native/no-color-literals
  optionsContainer: {
    alignItems: "center",
    backgroundColor: 'blue',
    bottom: 0,
    flexDirection: "row",
    height: 100,
    left: 0,
    position: "absolute",
    right: 0
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap'
  },
  remoteVideo: {
    height: 120,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    width: 100,
  },
  welcome: {
    fontSize: 30,
    paddingTop: 40,
    textAlign: 'center'
  },
  // eslint-disable-next-line react-native/sort-styles
  buttonText: { fontSize: 12 }
})

export const TwilioDemoScreen = function TwilioDemoScreen() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected')
  const [videoTracks, setVideoTracks] = useState(new Map())
  const [token, setToken] = useState('')
  const twilioVideo = useRef<TwilioVideo>(null)
  const _requestAudioPermission = () => PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: 'Need permission to access microphone',
      message: 'To run this demo we need permission to access your microphone',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK'
    }
  )
  const _requestCameraPermission = () => PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Need permission to access camera',
      message: 'To run this demo we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK'
    }
  )
  const _onConnectButtonPress = async () => {
    if (Platform.OS === 'android') {
      await _requestAudioPermission()
      await _requestCameraPermission()
    }
    twilioVideo.current.connect({ accessToken: token })
    setStatus('connecting')
  }
  const _onEndButtonPress = () => {
    twilioVideo.current.disconnect()
  }
  const _onMuteButtonPress = () => {
    twilioVideo.current.setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled))
  }
  const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera()
  }
  const _onRoomDidConnect = () => {
    setStatus('connected')
  }
  const _onRoomDidDisconnect = ({ error }) => {
    console.log('Error', error)
    setStatus('disconnected')
  }
  const _onRoomDidFailToConnect = (error) => {
    console.log('Error', error)
    setStatus('disconnected')
  }
  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantAddedVideoTrack', { participant, track })
    setVideoTracks(new Map([...videoTracks, [track.trackSid, { participantSid: participant.sid, videoTrackSid: track.trackSid }]]))
  }
  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log('onParticipantRemovedVideoTrack', { participant, track })
    const updatedVideoTracks = new Map(videoTracks)
    updatedVideoTracks.delete(track.trackSid)
    setVideoTracks(updatedVideoTracks)
  }
  return (
    <Screen style={ROOT} preset="scroll">
      <View style={styles.container}>
        {
          status === 'disconnected' &&
          <View>
            <Text style={styles.welcome}>
              React Native Twilio Video
            </Text>
            <TextInput
              style={styles.input}
              autoCapitalize='none'
              value={token}
              onChangeText={(text) => setToken(text)}
              placeholder="Twilio Token"
            >
            </TextInput>
            <Button
              style={styles.button}
              onPress={_onConnectButtonPress}>
              <Text style={styles.buttonText}>Connect</Text>
            </Button>
          </View>
        }

        {
          (status === 'connected' || status === 'connecting') &&
          <View style={styles.callContainer}>
            {
              status === 'connected' &&
              <View style={styles.remoteGrid}>
                {
                  Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                    return (
                      <TwilioVideoParticipantView
                        style={styles.remoteVideo}
                        key={trackSid}
                        trackIdentifier={trackIdentifier}
                      />
                    )
                  })
                }
              </View>
            }
            <View
              style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={_onEndButtonPress}>
                <Text style={styles.buttonText}>End</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={_onMuteButtonPress}>
                <Text style={styles.buttonText}>{ isAudioEnabled ? "Mute" : "Unmute" }</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={_onFlipButtonPress}>
                <Text style={styles.buttonText}>Flip</Text>
              </TouchableOpacity>
              <TwilioVideoLocalView
                enabled={true}
                style={styles.localVideo}
              />
            </View>
          </View>
        }

        <TwilioVideo
          ref={twilioVideo}
          onRoomDidConnect={ _onRoomDidConnect }
          onRoomDidDisconnect={ _onRoomDidDisconnect }
          onRoomDidFailToConnect= { _onRoomDidFailToConnect }
          onParticipantAddedVideoTrack={ _onParticipantAddedVideoTrack }
          onParticipantRemovedVideoTrack= { _onParticipantRemovedVideoTrack }
        />
      </View>
    </Screen>
  )
}
