import React from "react"
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Screen, Text } from "../../components"
import { color } from "../../theme"
import { RtcRemoteView, RtcLocalView, VideoRenderMode } from "react-native-agora"
import { useAgoraEngine } from "./useAgoraEngine"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  button: {
    backgroundColor: '#0093E9',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonHolder: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-evenly',
  },
  // eslint-disable-next-line react-native/no-color-literals
  buttonText: {
    color: '#fff',
  },
  fullView: {
    height: dimensions.height - 100,
    width: dimensions.width,
  },
  max: {
    flex: 1,
  },
  remote: {
    height: 150,
    marginHorizontal: 2.5,
    width: 150
  },
  remoteContainer: {
    height: 150,
    position: 'absolute',
    top: 5,
    width: '100%'
  },
  scrollContentContainer: {
    paddingHorizontal: 2.5
  }
})

export const AgoraDemoScreen = function AgoraDemoScreen() {
  const { channelName, peerIds, joinSucceed, startCall, endCall } = useAgoraEngine()
  const renderRemoteVideos = () => {
    return (
      <ScrollView style={styles.remoteContainer} contentContainerStyle={styles.scrollContentContainer} horizontal={true}>
        {peerIds.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              key={value}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
              style={styles.remote}
            />
          )
        })}
      </ScrollView>
    )
  }
  const renderVideos = () => {
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView channelId={channelName} renderMode={VideoRenderMode.Hidden} style={styles.max} />
        {renderRemoteVideos()}
      </View>
    ) : null
  }
  return (
    <Screen style={ROOT} preset="fixed">
      <View style={styles.max}>
        <View style={styles.max}>
          <View style={styles.buttonHolder}>
            <TouchableOpacity onPress={startCall} style={styles.button}>
              <Text style={styles.buttonText}>Start Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={endCall} style={styles.button}>
              <Text style={styles.buttonText}>End Call</Text>
            </TouchableOpacity>
          </View>
          {renderVideos()}
        </View>
      </View>
    </Screen>
  )
}
