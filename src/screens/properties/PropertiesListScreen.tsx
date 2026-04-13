import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PropertiesStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';
import { getProperties, deleteProperty, type ApiProperty } from '../../services/api';

type NavProp = NativeStackNavigationProp<PropertiesStackParamList>;

export default function PropertiesListScreen() {
  const navigation = useNavigation<NavProp>();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredProperties = useMemo(
    () => properties
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => !statusFilter || p.status === statusFilter),
    [properties, search, statusFilter]
  );

  const loadProperties = useCallback(() => {
    setLoading(true);
    getProperties()
      .then(setProperties)
      .catch(() => Alert.alert('Error', 'Failed to load properties'))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { loadProperties(); }, [loadProperties]));

  const handleLongPress = useCallback((id: string) => {
    Alert.alert(
      t('properties.deleteTitle'),
      t('properties.deleteMessage'),
      [
        { text: t('properties.deleteCancel'), style: 'cancel' },
        {
          text: t('properties.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProperty(id);
              loadProperties();
            } catch (e) {
              Alert.alert('Error', e instanceof Error ? e.message : 'Failed to delete property');
            }
          },
        },
      ]
    );
  }, [t, loadProperties]);

  const statusConfig = useMemo<Record<string, { bg: string; text: string; label: string }>>(() => ({
    rented: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('properties.rented') },
    available: { bg: Colors.primaryFixed, text: Colors.primary, label: t('properties.available') },
    overdue: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('properties.overdue') },
  }), [Colors, t]);

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

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          value={search}
          onChangeText={setSearch}
          placeholder="Search properties..."
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.filterRow}>
          {[
            { label: 'All',       value: null },
            { label: 'Available', value: 'available' },
            { label: 'Rented',    value: 'rented' },
            { label: 'Overdue',   value: 'overdue' },
          ].map(chip => (
            <TouchableOpacity
              key={chip.label}
              style={[styles.filterChip, statusFilter === chip.value && styles.filterChipActive]}
              activeOpacity={0.7}
              onPress={() => setStatusFilter(chip.value)}
            >
              <Text style={[styles.filterChipText, statusFilter === chip.value && styles.filterChipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1, marginTop: 60 }} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(p) => p._id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: p }) => {
            const status = statusConfig[p.status] ?? statusConfig['available'];
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('PropertyDetail', { propertyId: p._id })}
                onLongPress={() => handleLongPress(p._id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardImagePlaceholder}>
                  <Text style={{ fontSize: 35 }}>🏠</Text>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardName}>{p.name}</Text>
                    <View style={[styles.badge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardAddress}>{p.address}</Text>
                  {p.area !== undefined && (
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardRent}>{p.area} m²</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
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
    searchContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm, gap: Spacing.sm },
    searchBar: {
      backgroundColor: C.surfaceContainerLow,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: 12,
      ...Typography.bodyMd,
      color: C.onSurface,
    },
    filterRow: { flexDirection: 'row', gap: Spacing.xs },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: BorderRadius.xl,
      backgroundColor: C.surfaceContainerLow,
    },
    filterChipActive: { backgroundColor: C.primary },
    filterChipText: { ...Typography.labelSm, color: C.onSurfaceVariant, fontFamily: FontFamily.interSemiBold },
    filterChipTextActive: { color: C.onPrimary },
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
      height: 80,
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
