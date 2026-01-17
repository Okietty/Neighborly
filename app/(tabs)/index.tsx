import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

interface Tool {
  id: number;
  name: string;
  images: string[]
  icon: string;
  price: number;
  owner: string;
  distance: number;
  rating: number;
  reviews: number;
  description: string;
  available: boolean;
}

const tools: Tool[] = [
  {
    id: 1,
    name: 'Power Drill',
    images: ["https://www.mrpowertools.com/data/upload/ueditor/20241015/670dc5b5af22b.jpg",],
    icon: '🔧',
    price: 8,
    owner: 'Sarah M.',
    distance: 0.3,
    rating: 5,
    reviews: 47,
    description: 'DeWalt 20V cordless drill with two batteries and charger. Perfect for hanging pictures, furniture assembly, or small projects.',
    available: true
  },
  {
    id: 2,
    name: 'Lawn Mower',
    images: ["https://m.media-amazon.com/images/I/71PXLWTvP1L._AC_UF894,1000_QL80_.jpg"],
    icon: '🌿',
    price: 15,
    owner: 'Mike R.',
    distance: 0.5,
    rating: 5,
    reviews: 32,
    description: 'Honda self-propelled lawn mower. Well-maintained, starts on first pull. Great for yards up to 1/2 acre.',
    available: true
  },
  {
    id: 3,
    name: 'Extension Ladder',
    images: ["https://wernerco.widen.net/content/rwgbgledrq/jpeg/D6220-3_PI.jpeg?w=1200&h=1200&position=c&color=ffffffff&quality=100&u=qlpvmu"],
    icon: '🪜',
    price: 12,
    owner: 'David L.',
    distance: 0.7,
    rating: 5,
    reviews: 28,
    description: '24-foot Werner extension ladder. Perfect for gutter cleaning, painting, or roof access. Includes stabilizer.',
    available: true
  },
  {
    id: 4,
    name: 'Pressure Washer',
    images: ["https://i5.walmartimages.com/seo/All-Power-Heavy-Duty-3200-PSI-2-6-GPM-Gas-Pressure-Washer-Power-Washer-for-Outdoor-Cleaning-APW5120_c36fa084-e734-4626-b124-f91097eb62c9_1.9e3d0a7af8ccc2238c044146eb0f72ea.jpeg"],
    icon: '💦',
    price: 20,
    owner: 'Jessica T.',
    distance: 0.4,
    rating: 5,
    reviews: 41,
    description: 'Gas-powered pressure washer. 3000 PSI. Includes multiple nozzles. Great for decks, driveways, and siding.',
    available: true
  },
];

export default function HomeScreen() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const router = useRouter();

  const handleJoinWaitlist = () => {
    Alert.alert(
      '🎉 Join the Beta!',
      'Get early access to Neighborly in Austin, Denver, or Portland. Would you like to join our waitlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join Waitlist', 
          onPress: () => Alert.alert('Success! ✓', 'Thanks for your interest! We\'ll reach out soon with beta access.') 
        }
      ]
    );
  };


  const handleBrowseTools = () => {
    router.push('/explore');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View>
          <Text style={styles.logo}>🏠 Neighborly</Text>
          <Text style={styles.tagline}>Share tools, build community</Text>
        </View>
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinWaitlist}>
          <Text style={styles.joinButtonText}>Join Beta</Text>
        </TouchableOpacity>
      </ThemedView>

      {/* Hero Section */}
      <ThemedView style={styles.hero}>
        <Text style={styles.heroEmoji}>🔨</Text>
        <ThemedText type="title" style={styles.heroTitle}>
          Borrow Tools from{'\n'}Your Neighbors
        </ThemedText>
        <Text style={styles.heroSubtitle}>
          Access power tools, lawn equipment, and more from verified neighbors within walking distance.
        </Text>

        {/* CTA Buttons */}
        <View style={styles.ctaButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleBrowseTools}>
            <Text style={styles.primaryButtonText}>Browse Tools</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleJoinWaitlist}>
            <Text style={styles.secondaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>TOOLS NEARBY</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0.3mi</Text>
            <Text style={styles.statLabel}>AVG DISTANCE</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>VERIFIED</Text>
          </View>
        </View>
      </ThemedView>

      {/* Featured Tools */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🔥 Available Now
          </ThemedText>
          <TouchableOpacity onPress={handleBrowseTools}>
            <Text style={styles.seeAllText}>See all →</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolsScroll}>
          {tools.filter(t => t.available).map(tool => (
            <TouchableOpacity 
              key={tool.id} 
              style={styles.toolCardHorizontal}
              onPress={() => router.push({
                pathname: '/tool-details',
                params: {
                  tool: encodeURIComponent(JSON.stringify(tool))
                }
              })}
              activeOpacity={0.8}
            >
              {tool.images.length > 0 ? (<Image
                      source={{ uri: tool.images[0]}}
                      style={styles.toolImage}
                    />  
                  ) : (
                    <Text>no images</Text>
                  )}
              <Text style={styles.toolNameCompact}>{tool.name}</Text>
              <View style={styles.toolPriceRow}>
                <Text style={styles.priceCompact}>${tool.price}</Text>
                <Text style={styles.priceLabelCompact}>/day</Text>
              </View>
              <Text style={styles.distanceCompact}>📍 {tool.distance} mi away</Text>
              <View style={styles.availableBadgeSmall}>
                <Text style={styles.availableTextSmall}>Available</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* How It Works */}
      <ThemedView style={styles.howItWorks}>
        <Text style={styles.sectionTag}>⚡ HOW IT WORKS</Text>
        <ThemedText type="title" style={styles.sectionHeading}>
          Simple, Safe, Sustainable
        </ThemedText>

        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Find a Tool</Text>
              <Text style={styles.stepText}>Search by location and see verified tools in your neighborhood</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Book Instantly</Text>
              <Text style={styles.stepText}>Reserve by hour or day with automatic payment processing</Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Pick Up & Use</Text>
              <Text style={styles.stepText}>Coordinate pickup or use our contactless Neighborly Lockbox</Text>
            </View>
          </View>
        </View>
      </ThemedView>

      {/* Value Props */}
      <View style={styles.valueProps}>
        <View style={styles.valueProp}>
          <Text style={styles.valuePropIcon}>💸</Text>
          <Text style={styles.valuePropTitle}>Save Money</Text>
          <Text style={styles.valuePropText}>Why buy expensive tools you'll use once? Rent for 80% less.</Text>
        </View>

        <View style={styles.valueProp}>
          <Text style={styles.valuePropIcon}>🤝</Text>
          <Text style={styles.valuePropTitle}>Build Community</Text>
          <Text style={styles.valuePropText}>Meet neighbors and strengthen local connections.</Text>
        </View>

        <View style={styles.valueProp}>
          <Text style={styles.valuePropIcon}>🌱</Text>
          <Text style={styles.valuePropTitle}>Go Green</Text>
          <Text style={styles.valuePropText}>Reduce waste by sharing instead of buying.</Text>
        </View>
      </View>

      {/* Final CTA */}
      <ThemedView style={styles.finalCta}>
        <Text style={styles.finalCtaEmoji}>🚀</Text>
        <ThemedText type="title" style={styles.finalCtaTitle}>
          Ready to Get Started?
        </ThemedText>
        <Text style={styles.finalCtaText}>
          Join the beta in Austin, Denver, or Portland and get $20 in rental credits!
        </Text>
        <TouchableOpacity style={styles.finalCtaButton} onPress={handleJoinWaitlist}>
          <Text style={styles.finalCtaButtonText}>Join Waitlist →</Text>
        </TouchableOpacity>
      </ThemedView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE8E3',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B55',
    marginBottom: 2,
  },
  tagline: {
    fontSize: 11,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#FF6B55',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 16,
    lineHeight: 44,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 17,
    color: '#6B6B6B',
    marginBottom: 32,
    lineHeight: 25,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#FF6B55',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF6B55',
  },
  secondaryButtonText: {
    color: '#FF6B55',
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF6B55',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B6B6B',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  section: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#FF6B55',
    fontSize: 14,
    fontWeight: '600',
  },
  toolsScroll: {
    paddingLeft: 20,
  },
  toolCardHorizontal: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginRight: 16,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  toolIconLarge: {
    fontSize: 48,
    marginBottom: 12,
    textAlign: 'center',
  },
  toolNameCompact: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 8,
    textAlign: 'center',
  },
  toolPriceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  priceCompact: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D9F6B',
  },
  priceLabelCompact: {
    fontSize: 12,
    color: '#6B6B6B',
    marginLeft: 2,
  },
  distanceCompact: {
    fontSize: 12,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 12,
  },
  availableBadgeSmall: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
  },
  availableTextSmall: {
    color: '#2D9F6B',
    fontSize: 11,
    fontWeight: '700',
  },
  howItWorks: {
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  sectionTag: {
    backgroundColor: '#F5E6D3',
    color: '#FF6B55',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 1,
  },
  sectionHeading: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 32,
    lineHeight: 38,
  },
  steps: {
    gap: 24,
  },
  step: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 6,
  },
  stepText: {
    fontSize: 15,
    color: '#6B6B6B',
    lineHeight: 22,
  },
  valueProps: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 20,
  },
  valueProp: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  valuePropIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  valuePropTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 8,
  },
  valuePropText: {
    fontSize: 15,
    color: '#6B6B6B',
    lineHeight: 22,
  },
  finalCta: {
    paddingHorizontal: 20,
    paddingVertical: 48,
    alignItems: 'center',
    marginBottom: 40,
  },
  finalCtaEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  finalCtaTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  finalCtaText: {
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  finalCtaButton: {
    backgroundColor: '#FF6B55',
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  finalCtaButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
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
