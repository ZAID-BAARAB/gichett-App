import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Guichet } from '../types/Guichet';

const STORAGE_KEY = 'guichets';

export default function AjouterGuichetScreen() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [icon, setIcon] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const generate4DigitId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Please allow media library access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      uploadToCloudinary(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any);
      formData.append('upload_preset', 'gicheteAPP');

      const res = await fetch('https://api.cloudinary.com/v1_1/dsgnuek6y/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        setIcon(data.secure_url);
      } else {
        Alert.alert('Upload failed', JSON.stringify(data));
      }
    } catch {
      Alert.alert('Error', 'Could not upload image');
    } finally {
      setUploading(false);
    }
  };

  const addGuichet = async () => {
    const newG: Guichet = {
      id: generate4DigitId(),
      name,
      role,
      status,
      icon: icon || 'default-icon-url',
      isFavorite: false,
    };

    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const list: Guichet[] = json ? JSON.parse(json) : [];
      list.push(newG);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      Alert.alert('Success', 'Guichet added');
      router.back();
    } catch (e) {
      console.error('AsyncStorage error:', e);
      Alert.alert('Error', 'Could not save guichet');
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Added Header Section */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/placeholder-building.png')} // Use your own icon
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>Ajouter nouveau guichet</Text>
      </View>

      <Pressable onPress={pickImage} style={styles.imageContainer}>
        {uploading ? (
          <ActivityIndicator size="large" color="#999" />
        ) : (
          <Image
            source={
              icon
                ? { uri: icon }
                : require('../../assets/image-placeholder.jpg') // Replace with a default placeholder image
            }
            style={styles.image}
          />
        )}
        <Text style={styles.imageHint}>Formats autorisés: .png et .svg{'\n'}Taille max: 2 Mo</Text>
      </Pressable>

      <TextInput
        placeholder="Nom de guichet"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Rôle"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />
      <TextInput
        placeholder="Statut"
        value={status}
        onChangeText={setStatus}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={addGuichet} disabled={uploading}>
        <Text style={styles.buttonText}>
          {uploading ? 'Téléchargement...' : 'Valider'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

    headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Align to the left
    marginBottom: 20,
  },
  headerImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  imageHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0052cc',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   Alert, Button, Image, TextInput, View,
// } from 'react-native';
// import { Guichet } from '../types/Guichet';

// const STORAGE_KEY = 'guichets';

// export default function AjouterGuichetScreen() {
//   const [name, setName] = useState('');
//   const [role, setRole] = useState('');
//   const [status, setStatus] = useState('');
//   const [icon, setIcon] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const router = useRouter();

//   const generate4DigitId = () => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   const pickImage = async () => {
//     const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!granted) {
//       Alert.alert('Permission required', 'Please allow media library access');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       uploadToCloudinary(result.assets[0].uri);
//     }
//   };

//   const uploadToCloudinary = async (uri: string) => {
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any);
//       formData.append('upload_preset', 'gicheteAPP');

//       const res = await fetch(
//         'https://api.cloudinary.com/v1_1/dsgnuek6y/image/upload',
//         { method: 'POST', body: formData }
//       );
//       const data = await res.json();

//       if (data.secure_url) {
//         setIcon(data.secure_url);
//       } else {
//         Alert.alert('Upload failed', JSON.stringify(data));
//       }
//     } catch {
//       Alert.alert('Error', 'Could not upload image');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const addGuichet = async () => {
//     // if (!name || !role || !status || !icon) {
//     //   Alert.alert('Missing info', 'Fill all fields & pick an image');
//     //   return;
//     // }
//   console.log('Button pressed - start of function'); 
//     const newG: Guichet = {
//       id: generate4DigitId(),
//       name,
//       role,
//       status,
//       icon: icon || 'default-icon-url', 
//       isFavorite: false,
//     };

//     // Debug output
//     console.log('🆕 newGuichet', newG);
//     Alert.alert('Debug', JSON.stringify(newG, null, 2));

//     try {
//       // 1. Read existing list from AsyncStorage
//       const json = await AsyncStorage.getItem(STORAGE_KEY);
//       const list: Guichet[] = json ? JSON.parse(json) : [];
//       console.log('Existing list:', list);

//       // 2. Append and save back
//       list.push(newG);
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
//       console.log('Saved successfully');
//       Alert.alert('Success', 'Guichet added');
//       router.back();
//     } catch (e) {
//       console.error('AsyncStorage error:', e);
//       Alert.alert('Error', 'Could not save guichet');
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <TextInput
//         placeholder="Nom"
//         value={name}
//         onChangeText={setName}
//         style={{ marginBottom: 10, borderBottomWidth: 1 }}
//       />
//       <TextInput
//         placeholder="Rôle"
//         value={role}
//         onChangeText={setRole}
//         style={{ marginBottom: 10, borderBottomWidth: 1 }}
//       />
//       <TextInput
//         placeholder="Statut"
//         value={status}
//         onChangeText={setStatus}
//         style={{ marginBottom: 10, borderBottomWidth: 1 }}
//       />

//       <Button title="📷 Pick Icon" onPress={pickImage} />
//       {icon && (
//         <Image
//           source={{ uri: icon }}
//           style={{ width: 100, height: 100, marginVertical: 10 }}
//         />
//       )}

//       <Button
//         title={uploading ? 'Uploading...' : 'Ajouter'}
//         onPress={addGuichet}
//         // disabled={uploading}
//       />
//     </View>
//   );
// }



