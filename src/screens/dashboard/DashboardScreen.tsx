import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList, ContractsStackParamList, RootStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';
import {
  getReportSummary,
  getReportBreakdown,
  getProperties,
  getPayments,
  getContracts,
  collectPayment,
  type ApiSummary,
  type ApiBreakdown,
} from '../../services/api';

type DashboardNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
  NativeStackNavigationProp<ContractsStackParamList>
>;

interface ActiveRentalItem {
  id: string;
  propertyId: string;
  name: string;
  tenant: string;
  rent: string;
  contractEndISO: string;
  contractEnd: string;
  dueDate: string;
  payStatus: 'paid' | 'upcoming' | 'overdue';
  contractStatus: 'active' | 'expiring' | 'expired';
  paymentId: string | null;
}

function formatDashboardDate(d: Date): string {
  const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${String(d.getDate()).padStart(2, '0')} ${M[d.getMonth()]} ${d.getFullYear()}`;
}

function isExpiringSoon(isoStr: string): boolean {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() + 2);
  return new Date(isoStr) <= cutoff;
}

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavProp>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const Colors = useColors();
  const { isDarkMode, toggleDarkMode, language, setLanguage, t, user, logout } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [summaryData, setSummaryData] = useState<ApiSummary | null>(null);
  const [breakdown, setBreakdown] = useState<ApiBreakdown | null>(null);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [activeRentals, setActiveRentals] = useState<ActiveRentalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const year = new Date().getFullYear();
    try {
      const [summary, props, overduePayments, activeContracts, upcomingPayments, bkd] =
        await Promise.all([
          getReportSummary(year),
          getProperties(),
          getPayments({ status: 'overdue' }),
          getContracts('active'),
          getPayments({ status: 'upcoming' }),
          getReportBreakdown(),
        ]);
      setSummaryData(summary);
      setBreakdown(bkd);
      setPropertiesCount(props.length);
      setOverdueCount(overduePayments.length);
      const rentals: ActiveRentalItem[] = activeContracts.map((c) => {
        const overdueP = overduePayments.find((p) => p.contractId === c._id);
        const upcomingP = upcomingPayments.find((p) => p.contractId === c._id);
        const relevantPayment = overdueP ?? upcomingP;
        return {
          id: c._id,
          propertyId: c.propertyId._id,
          name: c.propertyId.name,
          tenant: c.tenantId.fullName,
          rent: `EGP ${c.rent.toLocaleString()}`,
          contractEndISO: c.endDate,
          contractEnd: formatDashboardDate(new Date(c.endDate)),
          dueDate: relevantPayment
            ? formatDashboardDate(new Date(relevantPayment.dueDate))
            : '—',
          payStatus: overdueP ? 'overdue' : upcomingP ? 'upcoming' : 'paid',
          contractStatus: c.status as ActiveRentalItem['contractStatus'],
          paymentId: relevantPayment?._id ?? null,
        };
      });
      setActiveRentals(rentals);
    } catch (e) {
      console.error('[Dashboard] loadDashboard failed:', e);
    } finally { setLoading(false); }
  }, []);

  useFocusEffect(
    useCallback(() => { loadDashboard(); }, [loadDashboard])
  );

  const menuRental = activeRentals.find((r) => r.id === openMenuId);
  const isPayable =
    menuRental?.payStatus === 'overdue' || menuRental?.payStatus === 'upcoming';

  const payStatusConfig = useMemo(() => ({
    paid: { bg: Colors.secondaryContainer, text: Colors.onSecondaryContainer, label: t('dashboard.paid') },
    upcoming: { bg: Colors.tertiaryFixed, text: Colors.onTertiaryFixed, label: t('dashboard.due') },
    overdue: { bg: Colors.errorContainer, text: Colors.onErrorContainer, label: t('dashboard.late') },
  }), [Colors, t]);

  // Balance card: use current-month breakdown (not YTD summary)
  const monthlyExpected =
    (breakdown?.paid?.amount ?? 0) +
    (breakdown?.upcoming?.amount ?? 0) +
    (breakdown?.overdue?.amount ?? 0);
  const monthlyCollected = breakdown?.paid?.amount ?? 0;
  const monthlyPercent = monthlyExpected > 0
    ? Math.round((monthlyCollected / monthlyExpected) * 100)
    : 0;

  const avatarInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.7}
            onPress={() => setAvatarMenuOpen(true)}
          >
            <Text style={styles.avatarText}>{avatarInitials}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{user?.name}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Bento Grid */}
        <View style={styles.bentoGrid}>
          {/* Main Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.decorativeCircle} />

            <View>
              <Text style={styles.balanceLabel}>{t('dashboard.monthlyPerf')}</Text>
              <Text style={styles.balanceAmount}>
                {loading ? '...' : `EGP ${monthlyExpected.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`}
              </Text>
              <Text style={styles.balanceSubLabel}>{t('dashboard.expectedMonth')}</Text>
            </View>

            <View style={styles.balanceFooter}>
              <View>
                <Text style={styles.collectedLabel}>{t('dashboard.collected')}</Text>
                <View style={styles.collectedRow}>
                  <Text style={styles.collectedAmount}>
                    {loading ? '...' : `EGP ${monthlyCollected.toLocaleString()}`}
                  </Text>
                  <View style={styles.percentBadge}>
                    <Text style={styles.percentText}>
                      {loading ? '—' : `${monthlyPercent}%`}
                    </Text>
                  </View>
                </View>
              </View>
              {/* Mini sparkline */}
              <View style={styles.sparkline}>
                <View style={[styles.sparkBar, { height: 20 }]} />
                <View style={[styles.sparkBar, { height: 32 }]} />
                <View style={[styles.sparkBar, { height: 16 }]} />
                <View style={[styles.sparkBar, { height: 40 }]} />
                <View style={[styles.sparkBar, { height: 28 }]} />
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {/* Properties Card */}
            <TouchableOpacity
              style={styles.statCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Properties')}
            >
              <View style={styles.statCardTop}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>🏢</Text>
                </View>
                <Text style={styles.statArrow}>↗</Text>
              </View>
              <Text style={styles.statNumber}>
                {loading ? '—' : String(propertiesCount).padStart(2, '0')}
              </Text>
              <Text style={styles.statLabel}>{t('dashboard.totalPortfolio')}</Text>
              {/* <Text style={styles.statSubLabel}>{t('dashboard.rented')}</Text> */}
            </TouchableOpacity>

            {/* Overdue Card */}
            {(() => {
              const hasOverdue = overdueCount > 0;
              return (
                <View style={[styles.statCard, hasOverdue ? styles.overdueCard : styles.clearCard]}>
                  <View style={styles.statCardTop}>
                    <View style={hasOverdue ? styles.warningIconContainer : styles.clearIconContainer}>
                      <Text style={styles.statIcon}>{hasOverdue ? '⚠️' : '✓'}</Text>
                    </View>
                    <Text style={[styles.statArrow, { color: hasOverdue ? `${Colors.onErrorContainer}4d` : `${Colors.onSecondaryContainer}4d` }]}>
                      {hasOverdue ? '!' : ''}
                    </Text>
                  </View>
                  <Text style={[styles.statNumber, hasOverdue ? styles.overdueNumber : styles.clearNumber]}>
                    {loading ? '—' : String(overdueCount).padStart(2, '0')}
                  </Text>
                  <Text style={[styles.statLabel, hasOverdue ? styles.overdueLabel : styles.clearLabel]}>
                    {hasOverdue ? t('dashboard.overduePayments') : t('dashboard.noOverdue')}
                  </Text>
                  <Text style={[styles.statSubLabel, hasOverdue ? styles.overdueSubLabel : styles.clearSubLabel]}>
                    {hasOverdue ? t('dashboard.attentionReq') : t('dashboard.allClear')}
                  </Text>
                </View>
              );
            })()}
          </View>
        </View>

        {/* Active Rentals Header */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>{t('dashboard.activeRentals')}</Text>
            <Text style={styles.sectionSubtitle}>{t('dashboard.activeRentalsSubtitle')}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButtonSecondary}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Contracts', { screen: 'CreateContract' } as any)}
          >
            <Text style={styles.actionButtonIcon}>📄</Text>
            <Text style={styles.actionButtonSecondaryText}>{t('dashboard.addContract')}</Text>
          </TouchableOpacity>
        </View>

        {/* Property List */}
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={Colors.primary} />
        ) : (
          <View style={styles.propertyList}>
            {activeRentals.map((rental) => {
              const pay = payStatusConfig[rental.payStatus];
              const expiring = isExpiringSoon(rental.contractEndISO);
              return (
                <View key={rental.id} style={styles.propertyCard}>
                  {/* Row 1: Thumb + Name + More */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.propertyThumb}>
                      <Text style={{ fontSize: 20 }}>🏠</Text>
                    </View>
                    <Text style={styles.propertyName}>{rental.name}</Text>
                    <TouchableOpacity
                      style={styles.moreButton}
                      activeOpacity={0.6}
                      onPress={() => setOpenMenuId(rental.id)}
                    >
                      <Text style={styles.moreButtonText}>⋮</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Row 2: Tenant (left) + Contract end badge (right) */}
                  <View style={styles.tenantContractRow}>
                    <View style={styles.tenantInfo}>
                      <Text style={styles.tenantIcon}>👤</Text>
                      <Text style={styles.tenantName}>{rental.tenant}</Text>
                    </View>
                    <View style={[styles.contractEndBadge, expiring && styles.contractEndBadgeWarning]}>
                      <Text style={styles.contractEndUpperLabel}>{t('dashboard.contractEnd')}</Text>
                      <Text style={[styles.contractEndDateText, expiring && styles.contractEndDateTextWarning]}>
                        {rental.contractEnd}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Row 3: Due date (left) + pay badge + rent */}
                  <View style={styles.cardFooterRow}>
                    <View style={styles.dueDateGroup}>
                      <Text style={styles.dueDateLabel}>{t('dashboard.dueDate')}</Text>
                      <Text style={styles.dueDateValue}>{rental.dueDate}</Text>
                    </View>
                    <View style={[styles.metaBadge, { backgroundColor: pay.bg }]}>
                      <Text style={[styles.metaBadgeText, { color: pay.text }]}>{pay.label}</Text>
                    </View>
                    <Text style={styles.rentAmount}>{rental.rent}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ── Avatar Dropdown Modal ── */}
      <Modal
        visible={avatarMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAvatarMenuOpen(false)}
        >
          <TouchableOpacity style={styles.menuCard} activeOpacity={1} onPress={() => {}}>

            {/* Language section */}
            <View style={styles.menuSectionHeader}>
              <Text style={styles.menuSectionLabel}>{t('menu.language')}</Text>
            </View>
            <View style={styles.languageRow}>
              <TouchableOpacity
                style={[styles.langOption, language === 'en' && styles.langOptionActive]}
                activeOpacity={0.7}
                onPress={() => { setLanguage('en'); setAvatarMenuOpen(false); }}
              >
                <Text style={[styles.langOptionText, language === 'en' && styles.langOptionTextActive]}>
                  {t('menu.languageEnglish')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langOption, language === 'ar' && styles.langOptionActive]}
                activeOpacity={0.7}
                onPress={() => { setLanguage('ar'); setAvatarMenuOpen(false); }}
              >
                <Text style={[styles.langOptionText, language === 'ar' && styles.langOptionTextActive]}>
                  {t('menu.languageArabic')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuDivider} />

            {/* Dark Mode toggle */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemRow]}
              activeOpacity={0.7}
              onPress={toggleDarkMode}
            >
              <Text style={styles.menuItemText}>{t('menu.darkMode')}</Text>
              <View style={[styles.togglePill, isDarkMode && styles.togglePillOn]}>
                <Text style={styles.toggleLabel}>
                  {isDarkMode ? t('menu.on') : t('menu.off')}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Logout */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                setAvatarMenuOpen(false);
                logout();
                rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
              }}
            >
              <Text style={[styles.menuItemText, { color: Colors.error }]}>
                {t('menu.logout')}
              </Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Cancel */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => setAvatarMenuOpen(false)}
            >
              <Text style={[styles.menuItemText, styles.menuCancelText]}>{t('menu.cancel')}</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Rental Card Dropdown Modal ── */}
      <Modal
        visible={openMenuId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenMenuId(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpenMenuId(null)}
        >
          <TouchableOpacity style={styles.menuCard} activeOpacity={1} onPress={() => {}}>
            {/* View Details */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                const rental = activeRentals.find((r) => r.id === openMenuId);
                setOpenMenuId(null);
                if (rental) {
                  navigation.navigate('Properties', {
                    screen: 'PropertyDetail',
                    params: { propertyId: rental.propertyId },
                  } as any);
                }
              }}
            >
              <Text style={styles.menuItemText}>{t('dashboard.viewDetails')}</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Collect Payment */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={isPayable ? 0.7 : 1}
              onPress={isPayable ? async () => {
                const rental = activeRentals.find((r) => r.id === openMenuId);
                setOpenMenuId(null);
                if (!rental?.paymentId) return;
                try {
                  await collectPayment(rental.paymentId);
                  await loadDashboard();
                } catch (e) {
                  Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
                }
              } : undefined}
            >
              <Text
                style={[
                  styles.menuItemText,
                  { color: isPayable ? Colors.secondary : Colors.outlineVariant },
                ]}
              >
                {t('dashboard.collectPayment')}
              </Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Cancel */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => setOpenMenuId(null)}
            >
              <Text style={[styles.menuItemText, styles.menuCancelText]}>{t('menu.cancel')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: C.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: `${C.surfaceContainerLow}cc`,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: C.primaryFixed,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: C.primaryFixed,
    },
    avatarText: {
      ...Typography.labelMd,
      fontFamily: FontFamily.manropeBold,
      color: C.primary,
    },
    headerTitle: {
      ...Typography.titleMd,
      fontFamily: FontFamily.manropeBold,
      color: C.primary,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
      paddingTop: Spacing.md,
    },
    bentoGrid: {
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    balanceCard: {
      borderRadius: BorderRadius.xxxl,
      backgroundColor: C.primary,
      padding: Spacing.xl,
      minHeight: 200,
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    decorativeCircle: {
      position: 'absolute',
      right: -48,
      top: -48,
      width: 192,
      height: 192,
      borderRadius: 96,
      backgroundColor: `${C.primaryFixed}0d`,
    },
    balanceLabel: {
      ...Typography.labelSm,
      color: C.primaryContainer,
      letterSpacing: 2,
      marginBottom: Spacing.xs,
    },
    balanceAmount: {
      ...Typography.displaySm,
      fontFamily: FontFamily.manropeExtraBold,
      color: C.onPrimary,
      letterSpacing: -0.5,
    },
    balanceSubLabel: {
      ...Typography.bodySm,
      color: `${C.primaryFixed}99`,
      marginTop: 4,
    },
    balanceFooter: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: Spacing.lg,
    },
    collectedLabel: {
      ...Typography.labelSm,
      color: `${C.primaryFixed}66`,
      letterSpacing: 1.5,
      marginBottom: 4,
    },
    collectedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    collectedAmount: {
      ...Typography.titleLg,
      fontFamily: FontFamily.manropeBold,
      color: C.onPrimary,
    },
    percentBadge: {
      backgroundColor: C.secondary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: BorderRadius.full,
    },
    percentText: {
      ...Typography.labelSm,
      color: C.onPrimary,
      fontFamily: FontFamily.interSemiBold,
    },
    sparkline: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 4,
      height: 40,
      opacity: 0.5,
    },
    sparkBar: {
      width: 6,
      backgroundColor: C.primaryFixed,
      borderRadius: 3,
    },
    statsRow: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxxl,
      padding: Spacing.lg,
      gap: 4,
    },
    overdueCard: {
      backgroundColor: C.errorContainer,
    },
    clearCard: {
      backgroundColor: C.secondaryContainer,
    },
    clearIconContainer: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.xxl,
      backgroundColor: 'rgba(255,255,255,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    clearNumber: { color: C.onSecondaryContainer },
    clearLabel: {
      color: C.onSecondaryContainer,
      fontFamily: FontFamily.interSemiBold,
    },
    clearSubLabel: { color: `${C.onSecondaryContainer}b3` },
    statCardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.sm,
    },
    statIconContainer: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.xxl,
      backgroundColor: C.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    warningIconContainer: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.xxl,
      backgroundColor: 'rgba(255,255,255,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statArrow: {
      fontSize: 18,
      color: C.outlineVariant,
    },
    statIcon: { fontSize: 20 },
    statNumber: {
      ...Typography.headlineLg,
      fontFamily: FontFamily.manropeBold,
      color: C.onSurface,
    },
    overdueNumber: { color: C.onErrorContainer },
    statLabel: {
      ...Typography.labelSm,
      color: C.onSurfaceVariant,
      letterSpacing: 0.5,
    },
    overdueLabel: {
      color: C.onErrorContainer,
      fontFamily: FontFamily.interSemiBold,
    },
    statSubLabel: {
      ...Typography.bodySm,
      color: C.secondary,
      fontFamily: FontFamily.interSemiBold,
      marginTop: 4,
    },
    overdueSubLabel: { color: `${C.onErrorContainer}b3` },
    sectionHeaderRow: {
      marginBottom: Spacing.md,
    },
    sectionHeaderText: { gap: 4 },
    sectionTitle: {
      ...Typography.headlineSm,
      fontFamily: FontFamily.manropeExtraBold,
      color: C.primary,
    },
    sectionSubtitle: {
      ...Typography.bodyMd,
      color: C.onSurfaceVariant,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    actionButtonSecondary: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      backgroundColor: C.surfaceContainerLowest,
      paddingVertical: 12,
      borderRadius: BorderRadius.xxl,
      shadowColor: C.onSurface,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    actionButtonIcon: { fontSize: 16 },
    actionButtonSecondaryText: {
      ...Typography.labelMd,
      fontFamily: FontFamily.interSemiBold,
      color: C.primary,
    },

    // ── Property cards ──
    propertyList: { gap: Spacing.md },
    propertyCard: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxxl,
      padding: Spacing.lg,
      flexDirection: 'column',
      gap: Spacing.sm,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    propertyThumb: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.xl,
      backgroundColor: C.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    propertyName: {
      ...Typography.titleSm,
      fontFamily: FontFamily.manropeBold,
      color: C.onSurface,
      flex: 1,
    },
    tenantContractRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: Spacing.xs,
    },
    tenantInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 4,
      flex: 1,
    },
    tenantIcon: { fontSize: 11 },
    tenantName: {
      ...Typography.bodyMd,
      color: C.onSurfaceVariant,
    },
    contractEndBadge: {
      alignItems: 'flex-end',
      backgroundColor: C.surfaceContainerLow,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: BorderRadius.lg,
    },
    contractEndBadgeWarning: {
      backgroundColor: C.tertiaryFixed,
    },
    contractEndUpperLabel: {
      ...Typography.labelSm,
      fontSize: 8,
      color: C.onSurfaceVariant,
      letterSpacing: 0.8,
    },
    contractEndDateText: {
      ...Typography.labelSm,
      fontFamily: FontFamily.interSemiBold,
      color: C.onSurface,
      fontSize: 10,
    },
    contractEndDateTextWarning: {
      color: C.onTertiaryFixed,
    },
    dueDateGroup: {
      gap: 1,
    },
    dueDateLabel: {
      ...Typography.labelSm,
      fontSize: 8,
      color: C.onSurfaceVariant,
      letterSpacing: 0.8,
    },
    dueDateValue: {
      ...Typography.labelSm,
      fontFamily: FontFamily.interSemiBold,
      color: C.onSurface,
      fontSize: 10,
    },
    cardDivider: {
      height: 1,
      backgroundColor: C.outlineVariant,
      opacity: 0.15,
    },
    cardFooterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    metaBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: BorderRadius.full,
    },
    metaBadgeText: {
      ...Typography.labelSm,
      fontSize: 9,
      fontFamily: FontFamily.interSemiBold,
      letterSpacing: 0.3,
    },
    rentAmount: {
      ...Typography.titleSm,
      fontFamily: FontFamily.manropeBold,
      color: C.onSurface,
      marginLeft: 'auto',
    },
    moreButton: {
      width: 32,
      height: 32,
      borderRadius: BorderRadius.xl,
      backgroundColor: C.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moreButtonText: {
      fontSize: 18,
      color: C.onSurfaceVariant,
      lineHeight: 20,
    },

    // ── Shared modal overlay ──
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    menuCard: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxxl,
      width: '100%',
      overflow: 'hidden',
      shadowColor: C.onSurface,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 12,
    },
    menuItem: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      alignItems: 'center',
    },
    menuItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    menuItemText: {
      ...Typography.bodyMd,
      fontFamily: FontFamily.interSemiBold,
      color: C.onSurface,
    },
    menuCancelText: {
      color: C.onSurfaceVariant,
    },
    menuDivider: {
      height: 1,
      backgroundColor: C.outlineVariant,
      opacity: 0.2,
      marginHorizontal: Spacing.md,
    },

    // ── Avatar menu extras ──
    menuSectionHeader: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.xs,
    },
    menuSectionLabel: {
      ...Typography.labelSm,
      color: C.onSurfaceVariant,
      letterSpacing: 1,
    },
    languageRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    langOption: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: BorderRadius.xl,
      backgroundColor: C.surfaceContainerLow,
      alignItems: 'center',
    },
    langOptionActive: {
      backgroundColor: C.primary,
    },
    langOptionText: {
      ...Typography.labelMd,
      fontFamily: FontFamily.interSemiBold,
      color: C.onSurfaceVariant,
    },
    langOptionTextActive: {
      color: C.onPrimary,
    },
    togglePill: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: BorderRadius.full,
      backgroundColor: C.surfaceContainerHigh,
    },
    togglePillOn: {
      backgroundColor: C.secondary,
    },
    toggleLabel: {
      ...Typography.labelSm,
      color: C.onSurface,
      fontFamily: FontFamily.interSemiBold,
    },
  });
}
