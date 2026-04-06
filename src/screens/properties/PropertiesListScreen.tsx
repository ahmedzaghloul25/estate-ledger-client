import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PropertiesStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';

type NavProp = NativeStackNavigationProp<PropertiesStackParamList>;

const properties = [
  { id: '1', name: 'The Meridian Penthouse', address: '12 Skyline Ave, Floor 32', status: 'rented', rent: '$4,200/mo', bedrooms: 3 },
  { id: '2', name: 'Cascade Lofts #4B', address: '88 Harbor St, Unit 4B', status: 'rented', rent: '$2,850/mo', bedrooms: 2 },
  { id: '3', name: 'Harborview Suite', address: '5 Marina Blvd, Suite 1A', status: 'overdue', rent: '$3,600/mo', bedrooms: 2 },
  { id: '4', name: 'The Westwood Studio', address: '200 Elm Court, Apt 7', status: 'available', rent: '$1,900/mo', bedrooms: 1 },
  { id: '5', name: 'Ridgemont Townhouse', address: '44 Oak Lane', status: 'available', rent: '$3,200/mo', bedrooms: 4 },
];

export default function PropertiesListScreen() {
  const navigation = useNavigation<NavProp>();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const statusConfig = {
    rented: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('properties.rented') },
    available: { bg: Colors.primaryFixed, text: Colors.primary, label: t('properties.available') },
    overdue: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('properties.overdue') },
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('properties.title')}</Text>
          <Text style={styles.subtitle}>{properties.length} {t('properties.subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreateProperty')}
        >
          <Text style={styles.addButtonText}>{t('properties.newButton')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {properties.map((p) => {
          const status = statusConfig[p.status as keyof typeof statusConfig];
          return (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              onPress={() => navigation.navigate('PropertyDetail', { propertyId: p.id })}
              activeOpacity={0.7}
            >
              <View style={styles.cardImagePlaceholder}>
                <Text style={{ fontSize: 28 }}>🏠</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardName}>{p.name}</Text>
                  <View style={[styles.badge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                  </View>
                </View>
                <Text style={styles.cardAddress}>{p.address}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardRent}>{p.rent}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
    },
    addButton: {
      backgroundColor: C.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.xl,
    },
    addButtonText: {
      ...Typography.labelSm,
      fontFamily: FontFamily.interSemiBold,
      color: C.onPrimary,
      letterSpacing: 0.8,
    },
    title: {
      ...Typography.headlineMd,
      fontFamily: FontFamily.manropeExtraBold,
      color: C.primary,
    },
    subtitle: {
      ...Typography.bodyMd,
      color: C.onSurfaceVariant,
      marginTop: 4,
    },
    content: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
      gap: Spacing.md,
    },
    card: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxxl,
      overflow: 'hidden',
    },
    cardImagePlaceholder: {
      height: 140,
      backgroundColor: C.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardBody: {
      padding: Spacing.lg,
      gap: 6,
    },
    cardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    cardName: {
      ...Typography.titleMd,
      fontFamily: FontFamily.manropeBold,
      color: C.onSurface,
      flex: 1,
      marginRight: Spacing.sm,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: BorderRadius.sm,
    },
    badgeText: {
      ...Typography.labelSm,
      letterSpacing: 0.5,
    },
    cardAddress: {
      ...Typography.bodyMd,
      color: C.onSurfaceVariant,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    cardRent: {
      ...Typography.titleSm,
      fontFamily: FontFamily.manropeBold,
      color: C.onSurface,
    },
  });
}
