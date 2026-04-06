import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';

export default function CreateTenantScreen() {
  const navigation = useNavigation();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');

  const fields = [
    { label: t('createTenant.fullName'), value: fullName, onChange: setFullName, placeholder: t('createTenant.fullNamePlaceholder') },
    { label: t('createTenant.phone'), value: phone, onChange: setPhone, placeholder: t('createTenant.phonePlaceholder'), keyboardType: 'phone-pad' as const },
    { label: t('createTenant.id'), value: id, onChange: setId, placeholder: t('createTenant.idPlaceholder'), keyboardType: 'number-pad' as const },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('createTenant.headerTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {fields.map((field) => (
            <View key={field.label} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                value={field.value}
                onChangeText={field.onChange}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.outlineVariant}
                keyboardType={field.keyboardType}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.submitButton} activeOpacity={0.9}>
            <Text style={styles.submitButtonText}>{t('createTenant.submit')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    backIcon: { fontSize: 30, color: C.primary },
    headerTitle: { ...Typography.titleMd, fontFamily: FontFamily.manropeBold, color: C.onSurface },
    content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md, paddingTop: Spacing.sm },
    field: { gap: Spacing.xs },
    label: {
      ...Typography.labelMd,
      fontFamily: FontFamily.interSemiBold,
      color: C.onSurfaceVariant,
      paddingHorizontal: 4,
    },
    input: {
      backgroundColor: C.surfaceContainerLow,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: 16,
      ...Typography.bodyMd,
      color: C.onSurface,
    },
    submitButton: {
      backgroundColor: C.primary,
      borderRadius: BorderRadius.xl,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: Spacing.sm,
      shadowColor: C.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 4,
    },
    submitButtonText: {
      ...Typography.titleMd,
      fontFamily: FontFamily.manropeBold,
      color: C.onPrimary,
    },
  });
}
