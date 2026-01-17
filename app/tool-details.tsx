import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import { useRouter } from 'expo-router';

export default function ToolDetails() {
  const router = useRouter();
  const params = useSearchParams();
  const toolParam = params.get('tool');
  const selectedTool = toolParam ? JSON.parse(decodeURIComponent(toolParam) as string) : null; 

  if (!selectedTool) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Tool not found </Text>
      </View>
    );
  }

  const handleRequestRental = () => { 
      Alert.alert(
        `Request ${selectedTool.name}?`,
        `This will send a rental request to ${selectedTool.owner} for $${selectedTool.price}/day.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send Request',
            onPress: () => {
              Alert.alert('Request Sent! ✓', `${selectedTool.owner} will respond within 24 hours. Check your messages for updates.`);
            }
          }
        ]
      );
    };
  
    const handleContactOwner = () => {
      Alert.alert(
        `Contacting ${selectedTool.owner}`
      );
    };

  return (
    <View style={styles.modalContent}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {selectedTool && (
          <>
            <Text style={styles.modalTitle}>{selectedTool.name}</Text>
            <View style={styles.modalRatingSection}>
                <Text style={styles.modalStars}>{'⭐'.repeat(selectedTool.rating)}</Text>
                <Text style={styles.modalReviews}>{selectedTool.reviews} reviews</Text>
            </View>

            {selectedTool.images.length > 0 ? (<Image
                source={{ uri: selectedTool.images[0]}}
                style={styles.modalImage}
              />  
            ) : (
              <Text style={styles.modalIcon}>no images</Text>
            )}

            <Text style={styles.modalLocation}>Posted by {selectedTool.owner}</Text>
            <Text style={styles.modalLocation}>📍 {selectedTool.distance} miles away</Text>

            <View style={styles.modalPriceCard}>
              <View style={styles.modalPriceSection}>
                <Text style={styles.modalPriceLabel}>Daily Rate</Text>
                <Text style={styles.modalPrice}>${selectedTool.price}<Text style={styles.modalPriceUnit}>/day</Text></Text>
              </View>
            </View>

            <View style={styles.modalDescriptionCard}>
              <Text style={styles.modalSectionTitle}>About This Tool</Text>
              <Text style={styles.modalDescription}>{selectedTool.description}</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.rentButton}
                onPress={() => handleRequestRental()}
              >
                <Text style={styles.rentButtonText}>Request to Rent</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleContactOwner()}
              >
                <Text style={styles.contactButtonText}>Contact Owner</Text>
              </TouchableOpacity>
            </View>  
          </>
        )}
     </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  text: {
    fontSize: 24,
    color: '#9a1d1d',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF8F0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '90%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#2B2B2B',
    fontWeight: '600',
  },
  modalIcon: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2B2B2B',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalLocation: {
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalPriceCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modalPriceSection: {
    flex: 1,
  },
  modalPriceLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 4,
    fontWeight: '600',
  },
  modalPrice: {
    fontSize: 40,
    fontWeight: '800',
    color: '#2D9F6B',
  },
  modalPriceUnit: {
    fontSize: 20,
    color: '#6B6B6B',
  },
  modalRatingSection: {
    alignItems: 'center',
  },
  modalStars: {
    fontSize: 20,
    marginBottom: 4,
  },
  modalReviews: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  modalOwnerCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ownerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF6B55',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ownerInitial: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 2,
  },
  ownerVerified: {
    fontSize: 13,
    color: '#2D9F6B',
    fontWeight: '600',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFE8E3',
  },
  messageButtonText: {
    fontSize: 20,
  },
  modalDescriptionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    color: '#6B6B6B',
    lineHeight: 23,
  },
  modalProtectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modalImage: {
    height: 140,
    width: 140,
    marginBottom: 12,
    marginTop: 12,
    borderRadius: 12,
    alignSelf: 'center',
  },
  toolImage: {
    height: 100,
    width: 100,
    marginBottom: 12,
    marginTop: 12,
    borderRadius: 12,
    alignSelf: 'center',
  },
  protectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  protectionIcon: {
    fontSize: 28,
  },
  protectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 3,
  },
  protectionDetail: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  rentButton: {
    backgroundColor: '#FF6B55',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  contactButton: {
    backgroundColor: '#FF6B55',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  rentButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  contactButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  
});


