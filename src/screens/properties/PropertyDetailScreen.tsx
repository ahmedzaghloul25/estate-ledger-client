import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PropertiesStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';
import { getPropertyById, type ApiProperty } from '../../services/api';

export default function PropertyDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PropertiesStackParamList>>();
  const route = useRoute<RouteProp<PropertiesStackParamList, 'PropertyDetail'>>();
  const { propertyId } = route.params;
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [property, setProperty] = useState<ApiProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPropertyById(propertyId)
      .then(setProperty)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [propertyId]);

  function handleBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('PropertiesList');
    }
  }

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    rented: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('properties.rented') },
    available: { bg: Colors.primaryFixed, text: Colors.primary, label: t('properties.available') },
    overdue: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('properties.overdue') },
  };

  const status = property ? (statusConfig[property.status] ?? statusConfig['available']) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('propertyDetail.headerTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1, marginTop: 60 }} size="large" color={Colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 48 }}>🏠</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.title}>{property?.name ?? '—'}</Text>
              {status && (
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                </View>
              )}
            </View>
            <Text style={styles.address}>{property?.address ?? '—'}</Text>

            {property?.area !== undefined && (
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{property.area}</Text>
                  <Text style={styles.statLabel}>{t('propertyDetail.area')}</Text>
                </View>
              </View>
            )}

            {property?.currentTenant && (
              <>
                <Text style={styles.sectionTitle}>{t('propertyDetail.sectionTenant')}</Text>
                <View style={styles.tenantCard}>
                  <View style={styles.tenantAvatar}>
                    <Text style={{ fontSize: 24 }}>👤</Text>
                  </View>
                  <View>
                    <Text style={styles.tenantName}>{property.currentTenant.fullName}</Text>
                    <Text style={styles.tenantContact}>{property.currentTenant.email}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      )}
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
  });
}
