import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList  } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Card from '@/components/HomeComponents/Card';


export default function SelectionPage() {
  const router = useRouter();
  const router1 = useRouter();


  const mockData = Array.from({ length: 2 }, (_, i) => ({
  id: i.toString(),
  title: `Item ${i + 1}`,
}));
const renderItem = ({ item }: { item: any }) => <Card/>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => router1.back()} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bottoms</Text>
        <View style={styles.headerIcons}>
            <TouchableOpacity  onPress={() => router.push('/MainSearchPage')} >
          <Ionicons name="search" size={22} color="black" style={styles.icon} />
          </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/ShoppingBag')}>
          <Ionicons name="bag-outline" size={22} color="black" />
                </TouchableOpacity>
        </View>
      </View>

      {/* Filters Row */}
      <View style={styles.filterRow}>
        <Text style={styles.filterText}>SORT ▼</Text>
        <Text style={styles.filterText}>SIZE ▼</Text>
        <Text style={styles.filterText}>FILTER 1 ▼</Text>
      </View>

      {/* Horizontal Scroll Filter Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollBar}>
        <FilterTag emoji="🔥" label="New In" />
        <FilterTag emoji="🚛" label="Fast Delivery" />
        <FilterTag emoji="🥳" label="Lowest Price" />
      </ScrollView>
      
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

function FilterTag({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{emoji} {label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 20, paddingHorizontal: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    headerIcons: { flexDirection: 'row', gap: 12 },
    icon: { marginRight: 10 },
  
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom: 12,
    },
    filterText: { fontWeight: '600' },
  
    scrollBar: { flexGrow: 0, marginBottom: 13 , height:40},
    tag: {
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
    },
    tagText: {
      fontSize: 14,
      fontWeight: '500',
    },
    cardList: {
      paddingBottom: 20,
    },
  });