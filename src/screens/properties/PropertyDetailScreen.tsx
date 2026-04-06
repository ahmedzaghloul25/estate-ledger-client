import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PropertiesStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';

export default function PropertyDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PropertiesStackParamList>>();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  function handleBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Arrived here from outside the Properties stack (e.g. Dashboard).
      // Navigate to the list so the back chain is always Properties-scoped.
      navigation.navigate('PropertiesList');
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('propertyDetail.headerTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imagePlaceholder}>
          <Text style={{ fontSize: 48 }}>🏠</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.title}>The Meridian Penthouse</Text>
            <View style={[styles.badge, { backgroundColor: Colors.secondaryContainer }]}>
              <Text style={[styles.badgeText, { color: Colors.onSecondaryContainer }]}>{t('properties.rented')}</Text>
            </View>
          </View>
          <Text style={styles.address}>12 Skyline Ave, Floor 32</Text>

          <View style={styles.statsRow}>
            {[
              { label: t('propertyDetail.rent'), value: '4,200' },
              { label: t('propertyDetail.area'), value: '160 m' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t('propertyDetail.sectionTenant')}</Text>
          <View style={styles.tenantCard}>
            <View style={styles.tenantAvatar}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View>
              <Text style={styles.tenantName}>Julianne Sterling</Text>
              <Text style={styles.tenantContact}>julianne@example.com</Text>
              <Text style={styles.tenantLease}>Lease: Jan 2026 – Dec 2026</Text>
            </View>
          </View>
        </View>
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
      paddingVertical: Spacing.md,
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    backIcon: { fontSize: 30, color: C.primary },
    headerTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    imagePlaceholder: {
      height: 220,
      backgroundColor: C.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: { paddingBottom: Spacing.xxl },
    body: { padding: Spacing.lg, gap: Spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    title: { ...Typography.headlineSm, fontFamily: FontFamily.manropeBold, color: C.onSurface, flex: 1, marginRight: Spacing.sm },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm },
    badgeText: { ...Typography.labelSm, letterSpacing: 0.5 },
    address: { ...Typography.bodyMd, color: C.onSurfaceVariant },
    statsRow: { flexDirection: 'row', gap: Spacing.sm, marginVertical: Spacing.sm },
    statCard: {
      flex: 1,
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxl,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignContent: 'center',
      padding: Spacing.sm,
      alignItems: 'center',
      gap: 6,
    },
    statValue: { ...Typography.titleLg, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    statLabel: { ...Typography.labelSm, color: C.onSurfaceVariant, textAlign: 'center', letterSpacing: 0.5 },
    sectionTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.primary },
    tenantCard: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    tenantAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: C.primaryFixed,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tenantName: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    tenantContact: { ...Typography.bodyMd, color: C.onSurfaceVariant },
    tenantLease: { ...Typography.bodySm, color: C.secondary, fontFamily: FontFamily.interSemiBold, marginTop: 2 },
  });
}
