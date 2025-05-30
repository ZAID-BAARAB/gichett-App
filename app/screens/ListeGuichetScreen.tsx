// app/screens/ListeGuichetScreen.tsx

import { AntDesign, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import GuichetItem from '../components/GuichetItem';
import defaultGuichets from '../data/guichet.json';
import { Guichet } from '../types/Guichet';

const STORAGE_KEY = 'guichets';

export default function ListeGuichetScreen() {
  const [guichets, setGuichets] = useState<Guichet[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');         // Track input value
  const [filteredGuichets, setFilteredGuichets] = useState<Guichet[]>([]); 

  // Load or initialize on screen focus
  useFocusEffect(useCallback(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json === null) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGuichets));
          setGuichets(defaultGuichets);
        } else {
          setGuichets(JSON.parse(json));
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load guichets');
        console.error(e);
      }
    })();
  }, []));

  useEffect(() => {
    const timeout = setTimeout(() => {
      let base = [...guichets];

      // Optionally filter favorites first
      if (showFavorites) {
        base = base.filter(g => g.isFavorite);
      }

      // Then filter by search query (case-insensitive)
      const filtered = base.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredGuichets(filtered);
    }, 1000); // 2-second debounce

    return () => clearTimeout(timeout); // Cancel on re-typing
  }, [searchQuery, guichets, showFavorites]);

  // Toggle favorite & persist
  const toggleFavorite = async (id: string) => {
    const updated = guichets.map(g =>
      g.id === id ? { ...g, isFavorite: !g.isFavorite } : g
    );
    setGuichets(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Delete & persist
  const deleteGuichet = async (id: string) => {
    const updated = guichets.filter(g => g.id !== id);
    setGuichets(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Compute filtered list
  const displayed =
  searchQuery.trim().length > 0
    ? filteredGuichets // Show filtered results if searching
    : showFavorites
      ? guichets.filter(g => g.isFavorite) // Show favorites if toggled
      : guichets; // Otherwise, show all
  // const displayed = showFavorites
  //   ? guichets.filter(g => g.isFavorite)
  //   : guichets;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>

        <View style={styles.headerTop}>
          <Text style={styles.title}>Guichets</Text>
          <Text style={styles.count}>{displayed.length}</Text>
        </View>

        <TouchableOpacity
          style={[styles.favoriteContainer, showFavorites && styles.favoriteActive]}
          onPress={() => setShowFavorites(v => !v)}
        >
          <Entypo
            name="star"
            size={20}
            color={showFavorites ? '#FFD700' : '#999'}
          />
          <Text
            style={[
              styles.favoriteTitle,
              showFavorites && styles.favoriteTitleActive
            ]}
          >
            Mes favorites
          </Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <AntDesign name="search1" size={15} color="#A0A0A0" />
            <TextInput
              placeholder="Rechercher..."
              placeholderTextColor="#A0A0A0"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/screens/AjouterGuichetScreen')}
          >
            <Entypo name="plus" size={18} color="white" />
            <Text style={styles.addButtonText}>Nouveau guichet</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <GuichetItem
            guichet={item}
            onFavorite={() => toggleFavorite(item.id)}
            onDelete={() => deleteGuichet(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  favoriteActive: {
    // optional highlight background:
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 5,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
  },
  favoriteTitleActive: {
    color: '#FFD700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 3,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
});


// import { AntDesign, Entypo } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// import { useRouter } from 'expo-router';
// import React, { useCallback, useState } from 'react';
// import {
//   FlatList,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import GuichetItem from '../components/GuichetItem';
// import defaultGuichets from '../data/guichet.json';
// import { Guichet } from '../types/Guichet';

// const STORAGE_KEY = 'guichets';

// export default function ListeGuichetScreen() {
//   const [guichets, setGuichets] = useState<Guichet[]>([]);
//   const router = useRouter();

//   // Load or initialize on screen focus
//   useFocusEffect(
//     useCallback(() => {
//       (async () => {
//         try {
//           const json = await AsyncStorage.getItem(STORAGE_KEY);
//           if (json === null) {
//             // First run: seed defaults
//             await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGuichets));
//             setGuichets(defaultGuichets);
//           } else {
//             setGuichets(JSON.parse(json));
//           }
//         } catch (e) {
//           Alert.alert('Error', 'Failed to load guichets');
//           console.error(e);
//         }
//       })();
//     }, [])
//   );

//   // Toggle favorite & persist
//   const toggleFavorite = async (id: string) => {
//     const updated = guichets.map(g =>
//       g.id === id ? { ...g, isFavorite: !g.isFavorite } : g
//     );
//     setGuichets(updated);
//     try {
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//     } catch (e) {
//       console.error('Error saving favorites', e);
//     }
//   };

//   // Delete & persist
//   const deleteGuichet = async (id: string) => {
//     const updated = guichets.filter(g => g.id !== id);
//     setGuichets(updated);
//     try {
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//     } catch (e) {
//       console.error('Error deleting guichet', e);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.header}>
//         <Text style={styles.favoriteCount}>
//           {guichets.filter(g => g.isFavorite).length}
//         </Text>
//         <Text style={styles.favoriteTitle}>Mes favorites</Text>

//         <View style={styles.searchContainer}>
//           <View style={styles.searchBar}>
//             <AntDesign name="search1" size={20} color="#A0A0A0" />
//             <TextInput
//               placeholder="Rechercher..."
//               placeholderTextColor="#A0A0A0"
//               style={styles.searchInput}
//             />
//           </View>
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => router.push('/screens/AjouterGuichetScreen')}
//           >
//             <Entypo name="plus" size={18} color="white" />
//             <Text style={styles.addButtonText}>Nouveau guichet</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <FlatList
//         data={guichets}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.gridContainer}
//         numColumns={2}
//         columnWrapperStyle={styles.columnWrapper}
//         renderItem={({ item }) => (
//           <GuichetItem
//             guichet={item}
//             onFavorite={() => toggleFavorite(item.id)}
//             onDelete={() => deleteGuichet(item.id)}
//           />
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
//   header: {
//     backgroundColor: 'white',
//     padding: 20,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EAEAEA',
//   },
//   favoriteCount: { fontSize: 32, fontWeight: 'bold', color: '#333' },
//   favoriteTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 5,
//     marginBottom: 20,
//   },
//   searchContainer: { flexDirection: 'row', alignItems: 'center' },
//   searchBar: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0F0F0',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     marginRight: 10,
//   },
//   searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007AFF',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//   },
//   addButtonText: { color: 'white', fontWeight: '600', marginLeft: 5, fontSize: 16 },
//   gridContainer: { padding: 10 },
//   columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
// });



