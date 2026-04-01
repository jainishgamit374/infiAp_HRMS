import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export const useImagePicker = () => {
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (libraryStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert(
          'Permissions Required', 
          'Sorry, we need camera and library permissions to make this work!'
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  };

  const showImagePickerOptions = async (onImagePicked: (uri: string) => void) => {
    Alert.alert(
      'Select Photo',
      'Choose an option to upload your profile photo',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const uri = await takePhoto();
            if (uri) onImagePicked(uri);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const uri = await pickImage();
            if (uri) onImagePicked(uri);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return {
    pickImage,
    takePhoto,
    showImagePickerOptions,
  };
};
