import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TenantsStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';

type NavProp = NativeStackNavigationProp<TenantsStackParamList>;

const tenants = [
  { id: '1', name: 'Julianne Sterling', property: 'The Meridian Penthouse', email: 'julianne@example.com', rent: '$4,200', status: 'paid' },
  { id: '2', name: 'Marcus Thorne', property: 'Cascade Lofts #4B', email: 'marcus@example.com', rent: '$2,850', status: 'upcoming' },
  { id: '3', name: 'Elena Vasquez', property: 'Harborview Suite', email: 'elena@example.com', rent: '$3,600', status: 'overdue' },
];

export default function TenantsListScreen() {
  const navigation = useNavigation<NavProp>();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const statusConfig = {
    paid: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('tenants.paid') },
    upcoming: { bg: Colors.tertiaryFixed, text: Colors.onTertiaryFixed, label: t('tenants.upcoming') },
    overdue: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('tenants.overdue') },
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('tenants.title')}</Text>
          <Text style={styles.subtitle}>{tenants.length} {t('tenants.subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreateTenant')}
        >
          <Text style={styles.addButtonText}>{t('tenants.newButton')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tenants.map((tenant) => {
          const status = statusConfig[tenant.status as keyof typeof statusConfig];
          return (
            <TouchableOpacity key={tenant.id} style={styles.card} activeOpacity={0.7}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{tenant.name.split(' ').map(n => n[0]).join('')}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{tenant.name}</Text>
                  <View style={[styles.badge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                  </View>
                </View>
                <Text style={styles.property}>{tenant.property}</Text>
                <Text style={styles.email}>{tenant.email}</Text>
                <Text style={styles.rent}>{tenant.rent}/mo</Text>
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
    title: { ...Typography.headlineMd, fontFamily: FontFamily.manropeExtraBold, color: C.primary },
    subtitle: { ...Typography.bodyMd, color: C.onSurfaceVariant, marginTop: 4 },
    content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
    card: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxxl,
      padding: Spacing.lg,
      flexDirection: 'row',
      gap: Spacing.md,
      alignItems: 'flex-start',
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: C.primaryFixed,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarText: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.primary },
    info: { flex: 1, gap: 4 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    name: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm },
    badgeText: { ...Typography.labelSm, letterSpacing: 0.5 },
    property: { ...Typography.bodyMd, color: C.onSurfaceVariant },
    email: { ...Typography.bodySm, color: C.onSurfaceVariant, opacity: 0.7 },
    rent: { ...Typography.labelMd, fontFamily: FontFamily.interSemiBold, color: C.secondary, marginTop: 4 },
  });
}
