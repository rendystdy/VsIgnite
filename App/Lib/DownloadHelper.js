import { name as appName } from '../../app.json';
import RNFS from 'react-native-fs';
import CameraRoll from "@react-native-community/cameraroll";
import { Method } from 'react-native-awesome-component';
import { ToastAndroid, Alert, Platform } from 'react-native';


export function getLocalFileFromUrl(url) {
  const rootDir = Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath : `file://${RNFS.TemporaryDirectoryPath}`;
  return `${rootDir}/${appName}/${Method.Helper.getFileNameFromURL(url)}`;
}

export async function isLocalFileExist(url) {
  const localFile = getLocalFileFromUrl(url)
  try {
    const isExist = await RNFS.exists(localFile)
    console.tron.error({ isExist, localFile })
    return isExist
  } catch (error) {
    console.tron.error('ERROR CHECK EXIST')
  }
}

export function downloadWithAlert(url) {
  const options = {
    fromUrl: url,
    toFile: getLocalFileFromUrl(url)
  };
  if (Platform.OS === 'ios') {
    CameraRoll.save(url, { album: appName, type: 'photo' })
      .then(() => {
        Alert.alert('Download completed', `kindly check your ${appName} album`)
      })
      .catch(() => {
        Alert.alert('Download failure', 'Please check your persmission and internet connection, and try again')
      })
  } else {
    RNFS.downloadFile(options).promise
      .then(() => {
        CameraRoll.save(options.toFile, { album: appName, type: 'photo' })
          .then(() => {
            ToastAndroid.show(`Download completed. kindly check your ${appName} album`, ToastAndroid.LONG)
          })
      })
      .catch(() => {
        ToastAndroid.show('Download failure. Please check your persmission and internet connection, and try again', ToastAndroid.LONG)
      })
  }
}

export function silentDownload(url) {
  return new Promise(async (resolve, reject) => {
    const options = {
      fromUrl: url,
      toFile: getLocalFileFromUrl(url),
      background: true,     // Continue the download in the background after the app terminates (iOS only)
      discretionary: true, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)
      // cacheable: true,      // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)
      // progressInterval: (progress) => console.tron.error({ progress }),
      // progressDivider: (divider) => console.tron.error({ divider }),
      begin: (resBegin) => console.tron.error({ resBegin }),
      progress: (resProgress) => console.tron.error({ resProgress }),
    };
    if (Platform.OS === 'ios') {
      CameraRoll.save(url, { album: appName, type: 'photo' })
        .then((res) => {
          console.tron.error({ res })
          resolve(options.toFile)
        })
        .catch((e) => {
          console.tron.error({ e })
          reject(e)
        })
    } else {
      RNFS.downloadFile(options).promise
        .then(() => {
          CameraRoll.save(options.toFile, { album: appName, type: 'photo' })
            .then(() => {
              resolve(options.toFile)
            })
        })
        .catch((e) => {
          reject(e)
        })
    }
  })
}