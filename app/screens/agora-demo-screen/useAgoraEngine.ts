import { useEffect, useState } from "react"
import RtcEngine from "react-native-agora"
// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from "react-native"
import { useIsFocused } from '@react-navigation/native'
import config from "../../config"

const requestCameraAndAudioPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    ])
    if (granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the cameras & mic')
    } else {
      console.log('Permission denied')
    }
  } catch (e) {
    console.warn(e)
  }
}

export const useAgoraEngine = () => {
  const channelName = config.agora.channel
  const [engine, setEngine] = useState<RtcEngine>(null)
  const [peerIds, setPeerIds] = useState<number[]>([])
  const [joinSucceed, setJoinSucceed] = useState(false)
  const [appId] = useState(config.agora.appId)
  const isFocused = useIsFocused()
  useEffect(() => {
    async function createEngine() {
      const engine = await RtcEngine.create(appId)
      engine.enableVideo()
      engine.addListener('Warning', warn => {
        // console.log('Warning', warn)
      })
      engine.addListener('Error', err => {
        console.log('Error', err)
      })
      engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed)
        if (!peerIds.includes(uid)) {
          setPeerIds([...peerIds, uid])
        }
      })
      engine.addListener('UserOffline', (uid) => {
        setPeerIds(peerIds.filter(id => id !== uid))
      })
      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed)
        setJoinSucceed(true)
      })
      setEngine(engine)
    }
    if (!engine && isFocused && appId) {
      createEngine().catch(e => console.log(e))
    }
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!')
      })
    }

    return () => {
      engine && engine.destroy().then(() => setEngine(null))
    }
  }, [appId, isFocused])
  const startCall = async () => {
    await engine.joinChannel(null, channelName, null, 0)
  }
  const endCall = async () => {
    await engine.leaveChannel()
    setPeerIds([])
    setJoinSucceed(false)
  }

  return {
    startCall,
    endCall,
    peerIds,
    joinSucceed,
    channelName
  }
}
