import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

// Types
interface ToolListing {
  id: string;
  title: string;
  price: number;
  distance: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  owner: string;
  rating: number;
}

// Dummy data for tool listings (DC area)
const DUMMY_LISTINGS: ToolListing[] = [
  {
    id: '1',
    title: 'DeWalt Power Drill',
    price: 15,
    distance: 0.3,
    coordinate: { latitude: 38.9072, longitude: -77.0369 },
    owner: 'Mike S.',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Circular Saw',
    price: 25,
    distance: 0.7,
    coordinate: { latitude: 38.91, longitude: -77.042 },
    owner: 'Sarah K.',
    rating: 4.5,
  },
  {
    id: '3',
    title: 'Pressure Washer',
    price: 40,
    distance: 1.2,
    coordinate: { latitude: 38.915, longitude: -77.03 },
    owner: 'John D.',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Ladder - 12ft Extension',
    price: 12,
    distance: 0.5,
    coordinate: { latitude: 38.902, longitude: -77.045 },
    owner: 'Emily R.',
    rating: 4.7,
  },
  {
    id: '5',
    title: 'Cordless Drill Set',
    price: 18,
    distance: 1.5,
    coordinate: { latitude: 38.92, longitude: -77.025 },
    owner: 'Chris M.',
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Table Saw',
    price: 35,
    distance: 2.0,
    coordinate: { latitude: 38.895, longitude: -77.05 },
    owner: 'David L.',
    rating: 4.4,
  },
];

const { width, height } = Dimensions.get('window');

const INITIAL_REGION: Region = {
  latitude: 38.9072,
  longitude: -77.0369,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const ToolSearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredListings, setFilteredListings] = useState<ToolListing[]>(DUMMY_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<ToolListing | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);

  const handleSearch = (text: string): void => {
    setSearchQuery(text);

    if (text.trim() === '') {
      setFilteredListings(DUMMY_LISTINGS);
      setShowResults(false);
    } else {
      const filtered = DUMMY_LISTINGS.filter((listing) =>
        listing.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredListings(filtered);
      setShowResults(true);
    }
  };

  const handleSelectListing = (listing: ToolListing): void => {
    setSelectedListing(listing);
    setShowResults(false);
    setSearchQuery(listing.title);
    Keyboard.dismiss();

    mapRef.current?.animateToRegion(
      {
        ...listing.coordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  const handleMarkerPress = (listing: ToolListing): void => {
    setSelectedListing(listing);
  };

  const handleClearSearch = (): void => {
    setSearchQuery('');
    setFilteredListings(DUMMY_LISTINGS);
    setSelectedListing(null);
    setShowResults(false);

    mapRef.current?.animateToRegion(INITIAL_REGION, 500);
  };

  const handleMapPress = (): void => {
    setShowResults(false);
    setSelectedListing(null);
    Keyboard.dismiss();
  };

  const handleRentRequest = (): void => {
    if (selectedListing) {
      // TODO: Navigate to rental request flow
      console.log('Requesting to rent:', selectedListing.title);
    }
  };

  const renderSearchResult: ListRenderItem<ToolListing> = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectListing(item)}
    >
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultSubtitle}>
          {item.distance} mi away • ${item.price}/day
        </Text>
      </View>
      <Text style={styles.resultRating}>★ {item.rating}</Text>
    </TouchableOpacity>
  );

  // Custom marker component
  const PriceMarker: React.FC<{ price: number; selected: boolean }> = ({ price, selected }) => (
    <View style={[styles.customMarker, selected && styles.selectedMarker]}>
      <Text style={[styles.markerText, selected && styles.selectedMarkerText]}>
        ${price}
      </Text>
      <View style={[styles.markerArrow, selected && styles.selectedMarkerArrow]} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredListings.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={listing.coordinate}
            onPress={() => handleMarkerPress(listing)}
            tracksViewChanges={false}
          >
            <PriceMarker
              price={listing.price}
              selected={selectedListing?.id === listing.id}
            />
          </Marker>
        ))}
      </MapView>

      {/* Search Bar Overlay */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for tools..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setShowResults(searchQuery.length > 0)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Dropdown */}
        {showResults && (
          <View style={styles.resultsContainer}>
            {filteredListings.length > 0 ? (
              <FlatList
                data={filteredListings}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                style={styles.resultsList}
              />
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No tools found</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Selected Listing Card */}
      {selectedListing && !showResults && (
        <View style={styles.listingCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{selectedListing.title}</Text>
            <Text style={styles.cardRating}>★ {selectedListing.rating}</Text>
          </View>
          <Text style={styles.cardOwner}>Listed by {selectedListing.owner}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>${selectedListing.price}/day</Text>
            <Text style={styles.cardDistance}>
              {selectedListing.distance} mi away
            </Text>
          </View>
          <TouchableOpacity style={styles.rentButton} onPress={handleRentRequest}>
            <Text style={styles.rentButtonText}>Request to Rent</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },

  // Search bar
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    fontSize: 18,
    color: '#999',
    padding: 4,
  },

  // Search results
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  resultsList: {
    borderRadius: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  resultRating: {
    fontSize: 14,
    color: '#f5a623',
    fontWeight: '600',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },

  // Custom marker
  customMarker: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMarker: {
    backgroundColor: '#4A90E2',
    borderColor: '#2E6BB0',
  },
  markerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A90E2',
  },
  selectedMarkerText: {
    color: '#fff',
  },
  markerArrow: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4A90E2',
  },
  selectedMarkerArrow: {
    borderTopColor: '#2E6BB0',
  },

  // Listing card
  listingCard: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  cardRating: {
    fontSize: 16,
    color: '#f5a623',
    fontWeight: '600',
  },
  cardOwner: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
  },
  cardDistance: {
    fontSize: 14,
    color: '#666',
  },
  rentButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  rentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ToolSearchScreen;