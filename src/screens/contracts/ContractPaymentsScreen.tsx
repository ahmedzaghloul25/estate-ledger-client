import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { ContractsStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';
import {
  getContractById,
  getPayments,
  terminateContract,
  collectPayment,
  derivePaymentStatus,
  type ApiContract,
  type ApiPayment,
} from '../../services/api';

function formatPaymentMonth(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function formatPaymentDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export default function ContractPaymentsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ContractsStackParamList, 'ContractPayments'>>();
  const { contractId } = route.params;
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [contract, setContract] = useState<ApiContract | null>(null);
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState(false);
  const [collectingId, setCollectingId] = useState<string | null>(null);

  const isTerminated = contract?.isEarlyTerminated ?? false;

  const loadData = useCallback(async () => {
    const [c, p] = await Promise.all([
      getContractById(contractId),
      getPayments({ contractId }),
    ]);
    setContract(c);
    setPayments(p);
  }, [contractId]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadData()
      .catch((e) => { if (mounted) console.error('[ContractPayments] loadData failed:', e); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [loadData]);

  const statusConfig = useMemo<Record<string, { bg: string; text: string; label: string }>>(() => ({
    paid: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('contractPayments.paid') },
    upcoming: { bg: Colors.tertiaryFixed, text: Colors.onTertiaryFixed, label: t('contractPayments.upcoming') },
    overdue: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('contractPayments.overdue') },
    voided: { bg: Colors.surfaceContainerLow, text: Colors.onSurfaceVariant, label: t('contractPayments.voided') },
  }), [Colors, t]);

  function handleTerminate() {
    Alert.alert(
      t('contractPayments.terminateTitle'),
      t('contractPayments.terminateMessage'),
      [
        { text: t('contractPayments.terminateCancel'), style: 'cancel' },
        {
          text: t('contractPayments.terminateConfirm'),
          style: 'destructive',
          onPress: async () => {
            setTerminating(true);
            try {
              await terminateContract(contractId);
              await loadData();
            } catch (e) {
              Alert.alert('Error', e instanceof Error ? e.message : 'Something went wrong');
            } finally {
              setTerminating(false);
            }
          },
        },
      ]
    );
  }

  async function handleCollect(paymentId: string) {
    setCollectingId(paymentId);
    try {
      await collectPayment(paymentId);
      const updated = await getPayments({ contractId });
      setPayments(updated);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setCollectingId(null);
    }
  }

  const durationMonths = contract
    ? Math.round(
        (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) /
        (1000 * 60 * 60 * 24 * 30.44)
      )
    : 0;

  // Sum actual scheduled payment amounts (excludes voided) — accounts for annual increase
  const totalValue = useMemo(
    () => payments.filter((p) => !p.isVoided).reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('contractPayments.headerTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1, marginTop: 60 }} size="large" color={Colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Contract Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTenant}>{contract?.tenantId.fullName ?? '--'}</Text>
            <Text style={styles.summaryProperty}>{contract?.propertyId?.name ?? '—'}</Text>
            {contract?.propertyId?.address ? (
              <Text style={styles.summaryAddress}>{contract.propertyId.address}</Text>
            ) : null}
            <View style={styles.summaryDatesRow}>
              <View style={styles.summaryDateCol}>
                <Text style={styles.summaryDateLabel}>{t('contractPayments.startDate')}</Text>
                <Text style={styles.summaryDateValue}>
                  {contract ? formatPaymentDate(contract.startDate) : '—'}
                </Text>
              </View>
              <Text style={styles.summaryDateSep}></Text>
              <View style={styles.summaryDateCol}>
                <Text style={styles.summaryDateLabel}>{t('contractPayments.endDate')}</Text>
                <Text style={styles.summaryDateValue}>
                  {contract ? formatPaymentDate(contract.endDate) : '—'}
                </Text>
              </View>
            </View>
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>{t('contractPayments.totalValue')}</Text>
              <Text style={styles.summaryTotalValue}>EGP {totalValue.toLocaleString()}</Text>
            </View>
          </View>

          {isTerminated ? (
            <View style={styles.terminatedBanner}>
              <Text style={styles.terminatedBannerText}>{t('contractPayments.terminatedBanner')}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.terminateButton, terminating && { opacity: 0.7 }]}
              onPress={handleTerminate}
              activeOpacity={0.8}
              disabled={terminating}
            >
              {terminating
                ? <ActivityIndicator color={Colors.onErrorContainer} />
                : <Text style={styles.terminateButtonText}>{t('contractPayments.terminateButton')}</Text>
              }
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>{t('contractPayments.paymentHistory')}</Text>

          {payments.map((p) => {
            const effectiveStatus = derivePaymentStatus(p);
            const status = statusConfig[effectiveStatus] ?? statusConfig['upcoming'];
            const isCollectable = effectiveStatus === 'upcoming' || effectiveStatus === 'overdue';
            const isCollecting = collectingId === p._id;
            return (
              <View key={p._id} style={styles.paymentCard}>
                <View>
                  {/* <Text style={styles.paymentMonth}>{formatPaymentMonth(p.dueDate)}</Text> */}
                  <Text style={styles.paymentDate}>{formatPaymentDate(p.dueDate)}</Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>EGP {p.amount.toLocaleString()}</Text>
                  <View style={[styles.badge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                  </View>
                  {isCollectable && (
                    <TouchableOpacity
                      style={[styles.collectButton, isCollecting && { opacity: 0.6 }]}
                      activeOpacity={0.7}
                      disabled={isCollecting}
                      onPress={() => handleCollect(p._id)}
                    >
                      {isCollecting
                        ? <ActivityIndicator size="small" color={Colors.onPrimary} />
                        : <Text style={styles.collectButtonText}>{t('contractPayments.collect')}</Text>
                      }
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
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
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    backIcon: { fontSize: 22, color: C.primary },
    headerTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
    summaryCard: {
      backgroundColor: C.primary,
      borderRadius: BorderRadius.xxxl,
      padding: Spacing.xl,
      marginBottom: Spacing.sm,
      gap: Spacing.sm,
    },
    summaryTenant: { ...Typography.headlineSm, fontFamily: FontFamily.manropeBold, color: C.onPrimary },
    summaryProperty: { ...Typography.bodyMd, color: C.primaryFixed, opacity: 0.7 },
    summaryAddress: { ...Typography.bodySm, color: C.primaryFixed, opacity: 0.5 },
    summaryDatesRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
    summaryDateCol: { flex: 1, gap: 2 },
    summaryDateLabel: { ...Typography.labelSm, color: C.primaryFixed, opacity: 0.6, letterSpacing: 0.5 },
    summaryDateValue: { ...Typography.labelMd, fontFamily: FontFamily.interSemiBold, color: C.onPrimary },
    summaryDateSep: { ...Typography.bodyMd, color: C.primaryFixed, opacity: 0.4, paddingHorizontal: 35 },
    summaryTotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Spacing.sm,
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: `${C.primaryFixed}33`,
    },
    summaryTotalLabel: { ...Typography.labelSm, color: C.primaryFixed, opacity: 0.6, letterSpacing: 0.5 },
    summaryTotalValue: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onPrimary },
    summaryStats: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
    summaryStat: { flex: 1, alignItems: 'center', gap: 4 },
    summaryStatValue: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onPrimary },
    summaryStatLabel: { ...Typography.labelSm, color: C.primaryFixed, opacity: 0.6, letterSpacing: 0.5 },
    summaryStatDivider: { width: 1, height: 36, backgroundColor: `${C.primaryFixed}33` },
    sectionTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.primary },
    paymentCard: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentMonth: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    paymentDate: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    paymentRight: { alignItems: 'flex-end', gap: 6 },
    paymentAmount: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm },
    badgeText: { ...Typography.labelSm, letterSpacing: 0.5 },
    collectButton: {
      backgroundColor: C.primary,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: 26,
      paddingVertical: 7,
      minWidth: 70,
      alignItems: 'center',
    },
    collectButtonText: {
      ...Typography.labelSm,
      fontFamily: FontFamily.interSemiBold,
      color: C.onPrimary,
      letterSpacing: 0.5,
    },
    terminateButton: {
      backgroundColor: C.errorContainer,
      borderRadius: BorderRadius.xl,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    terminateButtonText: {
      ...Typography.labelSm,
      fontFamily: FontFamily.interSemiBold,
      color: C.onErrorContainer,
      letterSpacing: 0.8,
    },
    terminatedBanner: {
      backgroundColor: C.errorContainer,
      borderRadius: BorderRadius.xl,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      opacity: 0.7,
    },
    terminatedBannerText: {
      ...Typography.labelSm,
      fontFamily: FontFamily.interSemiBold,
      color: C.onErrorContainer,
      letterSpacing: 0.8,
    },
  });
}
