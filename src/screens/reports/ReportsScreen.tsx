import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const barData = [14200, 16800, 13400, 18450, 15200, 17600];
const maxBar = Math.max(...barData);

export default function ReportsScreen() {
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const breakdown = [
    { labelKey: 'reports.collected' as const, amount: '$14,200', pct: 77, color: Colors.secondary },
    { labelKey: 'reports.pending' as const, amount: '$2,850', pct: 15, color: Colors.onTertiaryContainer },
    { labelKey: 'reports.overdue' as const, amount: '$1,400', pct: 8, color: Colors.error },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('reports.title')}</Text>
        <Text style={styles.subtitle}>{t('reports.subtitle')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Revenue Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t('reports.ytdRevenue')}</Text>
          <Text style={styles.summaryAmount}>$95,650</Text>
          <Text style={styles.summaryTrend}>{t('reports.trend')}</Text>
        </View>

        {/* Mini Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{t('reports.monthlyCollections')}</Text>
          <View style={styles.chart}>
            {barData.map((val, i) => (
              <View key={i} style={styles.barWrapper}>
                <Text style={styles.barValue}>${(val / 1000).toFixed(1)}k</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${(val / maxBar) * 100}%` as any },
                      i === 3 && styles.barActive,
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{months[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Breakdown */}
        <Text style={styles.sectionTitle}>{t('reports.paymentBreakdown')}</Text>
        {breakdown.map((item) => (
          <View key={item.labelKey} style={styles.breakdownCard}>
            <View>
              <Text style={styles.breakdownLabel}>{t(item.labelKey)}</Text>
              <Text style={styles.breakdownAmount}>{item.amount}</Text>
            </View>
            <View style={styles.breakdownBarContainer}>
              <View style={[styles.breakdownBar, { width: `${item.pct}%` as any, backgroundColor: item.color }]} />
            </View>
            <Text style={styles.breakdownPct}>{item.pct}%</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    header: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
    },
    title: { ...Typography.headlineMd, fontFamily: FontFamily.manropeExtraBold, color: C.primary },
    subtitle: { ...Typography.bodyMd, color: C.onSurfaceVariant, marginTop: 4 },
    content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
    summaryCard: {
      backgroundColor: C.primary,
      borderRadius: BorderRadius.xxxl,
      padding: Spacing.xl,
      gap: 4,
    },
    summaryLabel: { ...Typography.labelSm, color: C.primaryContainer, letterSpacing: 2 },
    summaryAmount: { ...Typography.displaySm, fontFamily: FontFamily.manropeExtraBold, color: C.onPrimary, letterSpacing: -0.5 },
    summaryTrend: { ...Typography.bodyMd, color: C.secondaryContainer, fontFamily: FontFamily.interSemiBold },
    chartCard: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxxl,
      padding: Spacing.xl,
    },
    chartTitle: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface, marginBottom: Spacing.md },
    chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: Spacing.sm },
    barWrapper: { flex: 1, alignItems: 'center', gap: 4 },
    barValue: { ...Typography.labelSm, color: C.onSurfaceVariant, fontSize: 9 },
    barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end' },
    bar: { width: '100%', backgroundColor: C.primaryFixed, borderRadius: 4 },
    barActive: { backgroundColor: C.primary },
    barLabel: { ...Typography.labelSm, color: C.onSurfaceVariant, letterSpacing: 0 },
    sectionTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.primary },
    breakdownCard: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    breakdownLabel: { ...Typography.labelMd, color: C.onSurfaceVariant, fontFamily: FontFamily.interSemiBold, width: 70 },
    breakdownAmount: { ...Typography.titleSm, fontFamily: FontFamily.manropeBold, color: C.onSurface, width: 70 },
    breakdownBarContainer: { flex: 1, height: 6, backgroundColor: C.surfaceContainerHigh, borderRadius: BorderRadius.full, overflow: 'hidden' },
    breakdownBar: { height: '100%', borderRadius: BorderRadius.full },
    breakdownPct: { ...Typography.labelMd, fontFamily: FontFamily.interSemiBold, color: C.onSurfaceVariant, width: 36, textAlign: 'right' },
  });
}
