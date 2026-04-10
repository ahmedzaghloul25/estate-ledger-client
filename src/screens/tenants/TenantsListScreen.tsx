import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TenantsStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';
import { getTenants, deleteTenant, type ApiTenant } from '../../services/api';

type NavProp = NativeStackNavigationProp<TenantsStackParamList>;

export default function TenantsListScreen() {
  const navigation = useNavigation<NavProp>();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [tenants, setTenants] = useState<ApiTenant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTenants = useCallback(() => {
    setLoading(true);
    getTenants()
      .then(setTenants)
      .catch(() => Alert.alert('Error', 'Failed to load tenants'))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { loadTenants(); }, [loadTenants]));

  const handleLongPress = useCallback((id: string) => {
    Alert.alert(
      t('tenants.deleteTitle'),
      t('tenants.deleteMessage'),
      [
        { text: t('tenants.deleteCancel'), style: 'cancel' },
        {
          text: t('tenants.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTenant(id);
              loadTenants();
            } catch (e) {
              Alert.alert('Error', e instanceof Error ? e.message : 'Failed to delete tenant');
            }
          },
        },
      ]
    );
  }, [t, loadTenants]);

  const statusConfig = useMemo<Record<string, { bg: string; text: string; label: string }>>(() => ({
    paid: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('tenants.paid') },
    upcoming: { bg: Colors.tertiaryFixed, text: Colors.onTertiaryFixed, label: t('tenants.upcoming') },
    overdue: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('tenants.overdue') },
  }), [Colors, t]);

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

      {loading ? (
        <ActivityIndicator style={{ flex: 1, marginTop: 60 }} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={tenants}
          keyExtractor={(tenant) => tenant._id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: tenant }) => {
            const status = tenant.paymentStatus ? statusConfig[tenant.paymentStatus] : undefined;
            const initials = tenant.fullName.split(' ').map((n) => n[0]).join('');
            return (
              <TouchableOpacity style={styles.card} activeOpacity={0.7} onLongPress={() => handleLongPress(tenant._id)}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{tenant.fullName}</Text>
                    {status && (
                      <View style={[styles.badge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                      </View>
                    )}
                  </View>
                  {tenant.currentProperty && (
                    <Text style={styles.property}>{tenant.currentProperty}</Text>
                  )}
                  <Text style={styles.secondaryInfo}>{tenant.phone}</Text>
                  <Text style={styles.secondaryInfo}>{tenant.identificationId}</Text>
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
    secondaryInfo: { ...Typography.bodySm, color: C.onSurfaceVariant, opacity: 0.7 },
  });
}
