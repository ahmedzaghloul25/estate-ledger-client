import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ContractsStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';

type NavProp = NativeStackNavigationProp<ContractsStackParamList>;

const contracts = [
  { id: '1', tenant: 'Julianne Sterling', property: 'The Meridian Penthouse', start: 'Jan 1, 2026', end: 'Dec 31, 2026', rent: '$4,200', status: 'active' },
  { id: '2', tenant: 'Marcus Thorne', property: 'Cascade Lofts #4B', start: 'Mar 1, 2026', end: 'Feb 28, 2027', rent: '$2,850', status: 'active' },
  { id: '3', tenant: 'Elena Vasquez', property: 'Harborview Suite', start: 'Jun 1, 2025', end: 'May 31, 2026', rent: '$3,600', status: 'expiring' },
];

export default function ContractsListScreen() {
  const navigation = useNavigation<NavProp>();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const statusConfig = {
    active: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('contracts.active') },
    expiring: { bg: Colors.tertiaryFixed, text: Colors.onTertiaryFixed, label: t('contracts.expiring') },
    expired: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('contracts.expired') },
    terminated: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('contracts.terminated') },
  };

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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {contracts.map((c) => {
          const status = statusConfig[c.status as keyof typeof statusConfig];
          return (
            <TouchableOpacity
              key={c.id}
              style={styles.card}
              onPress={() => navigation.navigate('ContractPayments', { contractId: c.id })}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <Text style={styles.tenant}>{c.tenant}</Text>
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                </View>
              </View>
              <Text style={styles.property}>{c.property}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.dates}>{c.start} – {c.end}</Text>
                <Text style={styles.rent}>{c.rent}/mo</Text>
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
