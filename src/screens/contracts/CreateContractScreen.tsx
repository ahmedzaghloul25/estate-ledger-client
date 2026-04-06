import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';
import {
  TENANT_OPTIONS,
  PROPERTY_OPTIONS,
  PAYMENT_INTERVAL_OPTIONS,
} from '../../data';

// ─── Calendar helpers ────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function formatDate(d: Date) {
  return `${String(d.getDate()).padStart(2, '0')} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CreateContractScreen() {
  const navigation = useNavigation();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  // Dropdown fields
  const [selectedTenant,   setSelectedTenant]   = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('');
  const [openDropdown,     setOpenDropdown]     = useState<string | null>(null);

  // Text input fields
  const [rent,            setRent]            = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [annualIncrease,  setAnnualIncrease]  = useState('');

  // Date picker
  const today = new Date();
  const [startDate,      setStartDate]      = useState<Date | null>(null);
  const [endDate,        setEndDate]        = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState<'start' | 'end' | null>(null);
  const [calYear,        setCalYear]        = useState(today.getFullYear());
  const [calMonth,       setCalMonth]       = useState(today.getMonth());
  const [tempDate,       setTempDate]       = useState<Date | null>(null);

  // ── Dropdown helpers ──
  const dropdownOptions: Record<string, string[]> = {
    tenant:   TENANT_OPTIONS.map(t => t.name),
    property: PROPERTY_OPTIONS.map(p => p.name),
    interval: PAYMENT_INTERVAL_OPTIONS,
  };
  const dropdownValues: Record<string, string> = {
    tenant: selectedTenant, property: selectedProperty, interval: selectedInterval,
  };
  function handleSelect(value: string) {
    if (openDropdown === 'tenant')   setSelectedTenant(value);
    if (openDropdown === 'property') setSelectedProperty(value);
    if (openDropdown === 'interval') setSelectedInterval(value);
    setOpenDropdown(null);
  }
  const currentOptions = openDropdown ? dropdownOptions[openDropdown] ?? [] : [];
  const currentValue   = openDropdown ? dropdownValues[openDropdown]  ?? '' : '';

  // ── Date picker helpers ──
  function openCal(which: 'start' | 'end') {
    const existing = which === 'start' ? startDate : endDate;
    const base = existing ?? today;
    setCalYear(base.getFullYear());
    setCalMonth(base.getMonth());
    setTempDate(existing);
    setOpenDatePicker(which);
  }
  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }
  function confirmDate() {
    if (!tempDate) return;
    if (openDatePicker === 'start') setStartDate(tempDate);
    else setEndDate(tempDate);
    setOpenDatePicker(null);
  }

  // Build calendar grid
  const totalDays  = daysInMonth(calYear, calMonth);
  const startDay   = firstWeekday(calYear, calMonth);
  const calCells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (calCells.length % 7 !== 0) calCells.push(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('createContract.headerTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* ── Tenant Name (dropdown) ── */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('createContract.tenantLabel')}</Text>
            <TouchableOpacity style={styles.dropdownTrigger} activeOpacity={0.7}
              onPress={() => setOpenDropdown('tenant')}>
              <Text style={[styles.dropdownValue, !selectedTenant && styles.dropdownPlaceholder]}>
                {selectedTenant || t('createContract.tenantPlaceholder')}
              </Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* ── Property (dropdown) ── */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('createContract.propertyLabel')}</Text>
            <TouchableOpacity style={styles.dropdownTrigger} activeOpacity={0.7}
              onPress={() => setOpenDropdown('property')}>
              <Text style={[styles.dropdownValue, !selectedProperty && styles.dropdownPlaceholder]}>
                {selectedProperty || t('createContract.propertyPlaceholder')}
              </Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* ── Monthly Rent (text) ── */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('createContract.rentLabel')}</Text>
            <TextInput style={styles.input} value={rent} onChangeText={setRent}
              placeholder="0.00" placeholderTextColor={Colors.outlineVariant}
              keyboardType="decimal-pad" />
          </View>

          {/* ── Payment Interval (dropdown) ── */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('createContract.intervalLabel')}</Text>
            <TouchableOpacity style={styles.dropdownTrigger} activeOpacity={0.7}
              onPress={() => setOpenDropdown('interval')}>
              <Text style={[styles.dropdownValue, !selectedInterval && styles.dropdownPlaceholder]}>
                {selectedInterval || t('createContract.intervalPlaceholder')}
              </Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </TouchableOpacity>
          </View>

          {/* ── Security Deposit (text) ── */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('createContract.depositLabel')}</Text>
            <TextInput style={styles.input} value={securityDeposit} onChangeText={setSecurityDeposit}
              placeholder="0.00" placeholderTextColor={Colors.outlineVariant}
              keyboardType="decimal-pad" />
          </View>

          {/* ── Annual Increase (text) ── */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('createContract.increaseLabel')}</Text>
            <TextInput style={styles.input} value={annualIncrease} onChangeText={setAnnualIncrease}
              placeholder="0.0" placeholderTextColor={Colors.outlineVariant}
              keyboardType="decimal-pad" />
          </View>

          {/* ── Start Date (calendar picker) ── */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('createContract.startDateLabel')}</Text>
            <TouchableOpacity style={styles.dropdownTrigger} activeOpacity={0.7}
              onPress={() => openCal('start')}>
              <Text style={[styles.dropdownValue, !startDate && styles.dropdownPlaceholder]}>
                {startDate ? formatDate(startDate) : t('createContract.datePlaceholder')}
              </Text>
              <Text style={styles.calIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {/* ── End Date (calendar picker) ── */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('createContract.endDateLabel')}</Text>
            <TouchableOpacity style={styles.dropdownTrigger} activeOpacity={0.7}
              onPress={() => openCal('end')}>
              <Text style={[styles.dropdownValue, !endDate && styles.dropdownPlaceholder]}>
                {endDate ? formatDate(endDate) : t('createContract.datePlaceholder')}
              </Text>
              <Text style={styles.calIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} activeOpacity={0.9}>
            <Text style={styles.submitButtonText}>{t('createContract.submit')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Dropdown picker modal ── */}
      <Modal visible={openDropdown !== null} transparent animationType="fade"
        onRequestClose={() => setOpenDropdown(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1}
          onPress={() => setOpenDropdown(null)}>
          <TouchableOpacity style={styles.pickerCard} activeOpacity={1} onPress={() => {}}>
            {currentOptions.map((option, index) => (
              <React.Fragment key={option}>
                {index > 0 && <View style={styles.pickerDivider} />}
                <TouchableOpacity style={styles.pickerOption} activeOpacity={0.7}
                  onPress={() => handleSelect(option)}>
                  <Text style={[styles.pickerOptionText, currentValue === option && styles.pickerOptionSelected]}>
                    {option}
                  </Text>
                  {currentValue === option && <Text style={styles.pickerCheckmark}>✓</Text>}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Calendar modal ── */}
      <Modal visible={openDatePicker !== null} transparent animationType="fade"
        onRequestClose={() => setOpenDatePicker(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1}
          onPress={() => setOpenDatePicker(null)}>
          <TouchableOpacity style={styles.calCard} activeOpacity={1} onPress={() => {}}>

            {/* Month navigation */}
            <View style={styles.calHeader}>
              <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn} activeOpacity={0.7}>
                <Text style={styles.calNavText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.calMonthTitle}>
                {MONTH_NAMES[calMonth]} {calYear}
              </Text>
              <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn} activeOpacity={0.7}>
                <Text style={styles.calNavText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Day-of-week labels */}
            <View style={styles.calWeekRow}>
              {DAY_LABELS.map(d => (
                <Text key={d} style={styles.calDayLabel}>{d}</Text>
              ))}
            </View>

            {/* Day grid */}
            <View style={styles.calGrid}>
              {calCells.map((day, i) => {
                const isSelected = day !== null && tempDate !== null
                  && tempDate.getDate() === day
                  && tempDate.getMonth() === calMonth
                  && tempDate.getFullYear() === calYear;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.calCell, isSelected && styles.calCellSelected]}
                    activeOpacity={day ? 0.7 : 1}
                    onPress={() => day && setTempDate(new Date(calYear, calMonth, day))}
                  >
                    {day !== null && (
                      <Text style={[styles.calDayText, isSelected && styles.calDayTextSelected]}>
                        {day}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.calActions}>
              <TouchableOpacity style={styles.calCancelBtn} activeOpacity={0.7}
                onPress={() => setOpenDatePicker(null)}>
                <Text style={styles.calCancelText}>{t('createContract.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.calConfirmBtn, !tempDate && styles.calConfirmDisabled]}
                activeOpacity={tempDate ? 0.9 : 1}
                onPress={confirmDate}
              >
                <Text style={styles.calConfirmText}>{t('createContract.confirm')}</Text>
              </TouchableOpacity>
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    backIcon: { fontSize: 30, color: C.primary },
    headerTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md, paddingTop: Spacing.sm },
    field: { gap: Spacing.xs },
    label: {
      ...Typography.labelMd, fontFamily: FontFamily.interSemiBold,
      color: C.onSurfaceVariant, paddingHorizontal: 4,
    },
    input: {
      backgroundColor: C.surfaceContainerLow, borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md, paddingVertical: 16,
      ...Typography.bodyMd, color: C.onSurface,
    },

    // ── Dropdown trigger ──
    dropdownTrigger: {
      backgroundColor: C.surfaceContainerLow, borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md, paddingVertical: 16,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    dropdownValue: { ...Typography.bodyMd, color: C.onSurface, flex: 1 },
    dropdownPlaceholder: { color: C.outlineVariant },
    dropdownChevron: { fontSize: 14, color: C.onSurfaceVariant, marginLeft: Spacing.sm },
    calIcon: { fontSize: 16, marginLeft: Spacing.sm },

    // ── Shared overlay ──
    overlay: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center', alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },

    // ── Dropdown list card ──
    pickerCard: {
      backgroundColor: C.surfaceContainerLowest, borderRadius: BorderRadius.xxxl,
      width: '100%', overflow: 'hidden',
      shadowColor: C.onSurface, shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12, shadowRadius: 24, elevation: 12,
    },
    pickerOption: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    },
    pickerOptionText: { ...Typography.bodyMd, fontFamily: FontFamily.interSemiBold, color: C.onSurface, flex: 1 },
    pickerOptionSelected: { color: C.primary },
    pickerCheckmark: { fontSize: 16, color: C.primary, marginLeft: Spacing.sm },
    pickerDivider: { height: 1, backgroundColor: C.outlineVariant, opacity: 0.2, marginHorizontal: Spacing.md },

    // ── Calendar card ──
    calCard: {
      backgroundColor: C.surfaceContainerLowest, borderRadius: BorderRadius.xxxl,
      width: '100%', padding: Spacing.lg, overflow: 'hidden',
      shadowColor: C.onSurface, shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12, shadowRadius: 24, elevation: 12,
    },
    calHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: Spacing.md,
    },
    calNavBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    calNavText: { fontSize: 22, color: C.primary, fontFamily: FontFamily.manropeBold },
    calMonthTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    calWeekRow: {
      flexDirection: 'row', marginBottom: Spacing.xs,
    },
    calDayLabel: {
      flex: 1, textAlign: 'center',
      ...Typography.labelSm, color: C.onSurfaceVariant,
      fontFamily: FontFamily.interSemiBold, letterSpacing: 0.5,
    },
    calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calCell: {
      width: `${100 / 7}%`, aspectRatio: 1,
      alignItems: 'center', justifyContent: 'center',
      borderRadius: BorderRadius.full,
    },
    calCellSelected: { backgroundColor: C.primary },
    calDayText: { ...Typography.bodyMd, color: C.onSurface },
    calDayTextSelected: { color: C.onPrimary, fontFamily: FontFamily.manropeBold },
    calActions: {
      flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg,
    },
    calCancelBtn: {
      flex: 1, paddingVertical: 12, borderRadius: BorderRadius.xl,
      backgroundColor: C.surfaceContainerLow, alignItems: 'center',
    },
    calCancelText: { ...Typography.labelMd, fontFamily: FontFamily.interSemiBold, color: C.onSurfaceVariant },
    calConfirmBtn: {
      flex: 1, paddingVertical: 12, borderRadius: BorderRadius.xl,
      backgroundColor: C.primary, alignItems: 'center',
    },
    calConfirmDisabled: { backgroundColor: C.surfaceContainerLow },
    calConfirmText: { ...Typography.labelMd, fontFamily: FontFamily.manropeBold, color: C.onPrimary },

    // ── Submit ──
    submitButton: {
      backgroundColor: C.primary, borderRadius: BorderRadius.xl,
      paddingVertical: 16, alignItems: 'center', marginTop: Spacing.sm,
      shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2, shadowRadius: 16, elevation: 4,
    },
    submitButtonText: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onPrimary },
  });
}
