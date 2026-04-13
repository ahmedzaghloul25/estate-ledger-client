import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ContractsStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';
import { getContracts, type ApiContract } from '../../services/api';

type NavProp = NativeStackNavigationProp<ContractsStackParamList>;

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ContractsListScreen() {
  const navigation = useNavigation<NavProp>();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [contracts, setContracts] = useState<ApiContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const filteredContracts = useMemo(
    () => contracts.filter(c => c.propertyId.name.toLowerCase().includes(search.toLowerCase())),
    [contracts, search]
  );

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getContracts()
        .then(setContracts)
        .catch(() => Alert.alert('Error', 'Failed to load contracts'))
        .finally(() => setLoading(false));
    }, [])
  );

  const statusConfig = useMemo<Record<string, { bg: string; text: string; label: string }>>(() => ({
    active: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('contracts.active') },
    expiring: { bg: Colors.tertiaryFixed, text: Colors.onTertiaryFixed, label: t('contracts.expiring') },
    expired: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('contracts.expired') },
    terminated: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('contracts.terminated') },
  }), [Colors, t]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('contracts.title')}</Text>
          <Text style={styles.subtitle}>{contracts.length} {t('contracts.subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('CreateContract')}
          activeOpacity={0.8}
        >
          <Text style={styles.newButtonText}>{t('contracts.newButton')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by property name..."
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1, marginTop: 60 }} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={filteredContracts}
          keyExtractor={(c) => c._id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: c }) => {
            const status = statusConfig[c.status] ?? statusConfig['expired'];
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ContractPayments', { contractId: c._id })}
                activeOpacity={0.7}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.tenant}>{c.tenantId.fullName}</Text>
                  <View style={[styles.badge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                  </View>
                </View>
                <Text style={styles.property}>{c.propertyId.name}</Text>
                <Text style={styles.property}>{c.propertyId.address}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.dates}>{formatDate(c.startDate)} – {formatDate(c.endDate)}</Text>
                  <Text style={styles.rent}>EGP {c.rent.toLocaleString()}</Text>
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
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
    },
    title: { ...Typography.headlineMd, fontFamily: FontFamily.manropeExtraBold, color: C.primary },
    subtitle: { ...Typography.bodyMd, color: C.onSurfaceVariant, marginTop: 4 },
    newButton: {
      backgroundColor: C.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.xl,
    },
    newButtonText: { ...Typography.labelSm, fontFamily: FontFamily.interSemiBold, color: C.onPrimary, letterSpacing: 0.8 },
    searchContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
    searchBar: {
      backgroundColor: C.surfaceContainerLow,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: 12,
      ...Typography.bodyMd,
      color: C.onSurface,
    },
    content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
    card: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxxl,
      padding: Spacing.lg,
      gap: 6,
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    tenant: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm },
    badgeText: { ...Typography.labelSm, letterSpacing: 0.5 },
    property: { ...Typography.bodyMd, color: C.onSurfaceVariant },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    dates: { ...Typography.bodySm, color: C.onSurfaceVariant },
    rent: { ...Typography.labelMd, fontFamily: FontFamily.interSemiBold, color: C.secondary },
  });
}
