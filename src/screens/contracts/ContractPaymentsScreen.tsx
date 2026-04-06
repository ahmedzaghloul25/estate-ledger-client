import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';

const INITIAL_PAYMENTS = [
  { id: '1', month: 'April 2026', amount: '$4,200', date: 'Apr 1, 2026', status: 'paid' },
  { id: '2', month: 'March 2026', amount: '$4,200', date: 'Mar 1, 2026', status: 'paid' },
  { id: '3', month: 'February 2026', amount: '$4,200', date: 'Feb 1, 2026', status: 'paid' },
  { id: '4', month: 'May 2026', amount: '$4,200', date: 'May 1, 2026', status: 'upcoming' },
];

export default function ContractPaymentsScreen() {
  const navigation = useNavigation();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [isTerminated, setIsTerminated] = useState(false);
  const [paymentList, setPaymentList] = useState(INITIAL_PAYMENTS);

  const statusConfig = {
    paid: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('contractPayments.paid') },
    upcoming: { bg: Colors.tertiaryFixed, text: Colors.onTertiaryFixed, label: t('contractPayments.upcoming') },
    overdue: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('contractPayments.overdue') },
    voided: { bg: Colors.surfaceContainerLow, text: Colors.onSurfaceVariant, label: t('contractPayments.voided') },
  };

  function handleTerminate() {
    Alert.alert(
      t('contractPayments.terminateTitle'),
      t('contractPayments.terminateMessage'),
      [
        { text: t('contractPayments.terminateCancel'), style: 'cancel' },
        {
          text: t('contractPayments.terminateConfirm'),
          style: 'destructive',
          onPress: () => {
            setIsTerminated(true);
            setPaymentList(prev =>
              prev.map(p => p.status === 'upcoming' || p.status === 'overdue' ? { ...p, status: 'voided' } : p)
            );
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('contractPayments.headerTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contract Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTenant}>Julianne Sterling</Text>
          <Text style={styles.summaryProperty}>The Meridian Penthouse</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>$4,200</Text>
              <Text style={styles.summaryStatLabel}>{t('contractPayments.monthlyRent')}</Text>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>12</Text>
              <Text style={styles.summaryStatLabel}>{t('contractPayments.months')}</Text>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>$50,400</Text>
              <Text style={styles.summaryStatLabel}>{t('contractPayments.totalValue')}</Text>
            </View>
          </View>
        </View>

        {isTerminated ? (
          <View style={styles.terminatedBanner}>
            <Text style={styles.terminatedBannerText}>{t('contractPayments.terminatedBanner')}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.terminateButton} onPress={handleTerminate} activeOpacity={0.8}>
            <Text style={styles.terminateButtonText}>{t('contractPayments.terminateButton')}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>{t('contractPayments.paymentHistory')}</Text>

        {paymentList.map((p) => {
          const status = statusConfig[p.status as keyof typeof statusConfig];
          return (
            <View key={p.id} style={styles.paymentCard}>
              <View>
                <Text style={styles.paymentMonth}>{p.month}</Text>
                <Text style={styles.paymentDate}>{p.date}</Text>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentAmount}>{p.amount}</Text>
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
                </View>
              </View>
            </View>
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
    summaryStats: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
    summaryStat: { flex: 1, alignItems: 'center', gap: 4 },
    summaryStatValue: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onPrimary },
    summaryStatLabel: { ...Typography.labelSm, color: C.primaryFixed, opacity: 0.6, letterSpacing: 0.5 },
    summaryStatDivider: { width: 1, height: 36, backgroundColor: `${C.primaryFixed}33` },
    sectionTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.primary },
    paymentCard: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentMonth: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    paymentDate: { ...Typography.bodyMd, color: C.onSurfaceVariant, marginTop: 2 },
    paymentRight: { alignItems: 'flex-end', gap: 6 },
    paymentAmount: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm },
    badgeText: { ...Typography.labelSm, letterSpacing: 0.5 },
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
