import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Guichet } from '../types/Guichet';
import { getIconSource } from '../utils/iconMapping';

type Props = {
  guichet: Guichet;
  onFavorite: () => void;
  onDelete: () => void;
};

export default function GuichetItem({ guichet, onFavorite, onDelete }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const statusColor = guichet.status === 'Actif' ? '#4CAF50' : '#F44336';

  const getIconComponent = () => {
    if (guichet.icon?.startsWith('https')) {
      return (
        <Image
          source={{ uri: guichet.icon }}
          style={styles.icon}
          onError={() => console.log('Failed to load Cloudinary image')}
        />
      );
    } else {
      return <Image source={getIconSource(guichet.icon)} style={styles.icon} />;
    }
  };

  return (
    // Wrapping to detect outside taps
    <TouchableWithoutFeedback onPress={() => menuVisible && setMenuVisible(false)}>
      <View style={styles.cardContainer}>

        {/* Top-left star */}
        <View style={styles.favoriteContainer}>
          <TouchableOpacity onPress={onFavorite}>
            <FontAwesome
              name={guichet.isFavorite ? 'star' : 'star-o'}
              size={20}
              color={guichet.isFavorite ? '#FFD700' : '#999'}
            />
          </TouchableOpacity>
        </View>

        {/* Top-right dots + inline menu */}
        <View style={styles.menuWrapper}>
          <TouchableOpacity
            onPress={() => setMenuVisible(v => !v)}
            style={styles.menuButton}
          >
            <Entypo name="dots-three-horizontal" size={20} color="#666" />
          </TouchableOpacity>
          {menuVisible && (
            <View style={styles.inlineMenu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onDelete();
                }}
              >
                <MaterialIcons name="delete" size={20} color="#F44336" />
                <Text style={styles.deleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Icon + role */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            {guichet.icon ? getIconComponent() : (
              <Entypo name="image" size={40} color="#666" />
            )}
          </View>
          <Text style={styles.roleText} numberOfLines={1}>
            {guichet.role}
          </Text>
        </View>

        {/* Bottom: Name & status */}
        <View style={styles.bottomContainer}>
          <Text style={styles.name} numberOfLines={1}>{guichet.name}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{guichet.status}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    position: 'relative',
  },
  favoriteContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
  },
  menuWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  menuButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    padding: 6,
  },
  inlineMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    width: 140,            // increased width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#F44336',
    fontWeight: '500',
  },
  iconWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  icon: {
    width: 80,
    height: 80,
  },
  roleText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    width: '100%',
    textAlign: 'center',
    maxWidth: '90%',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 50,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

// import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
// import React, { useState } from 'react';
// import {
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View
// } from 'react-native';
// import { Guichet } from '../types/Guichet';
// import { getIconSource } from '../utils/iconMapping';

// type Props = {
//   guichet: Guichet;
//   onFavorite: () => void;
//   onDelete: () => void;
// };

// export default function GuichetItem({ guichet, onFavorite, onDelete }: Props) {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const statusColor = guichet.status === 'Actif' ? '#4CAF50' : '#F44336';

//   const getIconComponent = () => {
//     if (guichet.icon?.startsWith('https')) {
//       return (
//         <Image
//           source={{ uri: guichet.icon }}
//           style={styles.icon}
//           onError={() => console.log('Failed to load Cloudinary image')}
//         />
//       );
//     } else {
//       return <Image source={getIconSource(guichet.icon)} style={styles.icon} />;
//     }
//   };

//   return (
//     // Wrapping to detect outside taps
//     <TouchableWithoutFeedback onPress={() => menuVisible && setMenuVisible(false)}>
//       <View style={styles.cardContainer}>

//         {/* Top-left star */}
//         <View style={styles.favoriteContainer}>
//           <TouchableOpacity onPress={onFavorite}>
//             <FontAwesome
//               name={guichet.isFavorite ? 'star' : 'star-o'}
//               size={20}
//               color={guichet.isFavorite ? '#FFD700' : '#999'}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Top-right dots + inline menu */}
//         <View style={styles.menuWrapper}>
//           <TouchableOpacity
//             onPress={() => setMenuVisible(v => !v)}
//             style={styles.menuButton}
//           >
//             <Entypo name="dots-three-horizontal" size={20} color="#666" />
//           </TouchableOpacity>
//           {menuVisible && (
//             <View style={styles.inlineMenu}>
//               <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => {
//                   setMenuVisible(false);
//                   onDelete();
//                 }}
//               >
//                 <MaterialIcons name="delete" size={20} color="#F44336" />
//                 <Text style={styles.deleteText}>Supprimer</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Icon + role */}
//         <View style={styles.iconWrapper}>
//           <View style={styles.iconCircle}>
//             {guichet.icon ? getIconComponent() : (
//               <Entypo name="image" size={40} color="#666" />
//             )}
//           </View>
//           <Text style={styles.roleText} numberOfLines={1}>
//             {guichet.role}
//           </Text>
//         </View>

//         {/* Bottom: Name & status */}
//         <View style={styles.bottomContainer}>
//           <Text style={styles.name} numberOfLines={1}>{guichet.name}</Text>
//           <View style={styles.statusContainer}>
//             <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
//             <Text style={[styles.statusText, { color: statusColor }]}>{guichet.status}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   cardContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     width: '100%',
//     position: 'relative',
//   },
//   favoriteContainer: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     zIndex: 2,
//   },
//   menuWrapper: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     zIndex: 2,
//   },
//   menuButton: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 20,
//     padding: 6,
//   },
//   inlineMenu: {
//     position: 'absolute',
//     top: 30,
//     right: 0,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingVertical: 5,
//     width: 140,            // increased width
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   deleteText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#F44336',
//     fontWeight: '500',
//   },
//   iconWrapper: {
//     alignItems: 'center',
//     marginVertical: 4,
//   },
//   iconCircle: {
//     width: 90,
//     height: 90,
//     borderRadius: 50,
//     backgroundColor: '#F0F7FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//   },
//   icon: {
//     width: 80,
//     height: 80,
//   },
//   roleText: {
//     marginTop: 8,
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#555',
//     width: '100%',
//     textAlign: 'center',
//     maxWidth: '90%',
//   },
//   bottomContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     marginTop: 50,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//     marginRight: 5,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 4,
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

