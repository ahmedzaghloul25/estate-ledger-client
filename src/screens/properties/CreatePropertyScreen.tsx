import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';
import { createProperty } from '../../services/api';

export default function CreatePropertyScreen() {
  const navigation = useNavigation();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);

  const fields = [
    { label: t('createProperty.name'), value: name, onChange: setName, placeholder: t('createProperty.namePlaceholder') },
    { label: t('createProperty.address'), value: address, onChange: setAddress, placeholder: t('createProperty.addressPlaceholder') },
    { label: t('createProperty.area'), value: area, onChange: setArea, placeholder: t('createProperty.areaPlaceholder'), keyboardType: 'number-pad' as const },
  ];

  async function handleSubmit() {
    if (!name.trim() || !address.trim()) {
      Alert.alert('Validation', 'Name and address are required.');
      return;
    }
    if (name.trim().length > 100) {
      Alert.alert('Validation', 'Property name must be 100 characters or less.');
      return;
    }
    if (address.trim().length > 255) {
      Alert.alert('Validation', 'Address must be 255 characters or less.');
      return;
    }
    if (area && (isNaN(Number(area)) || Number(area) <= 0)) {
      Alert.alert('Validation', 'Area must be a positive number.');
      return;
    }
    setLoading(true);
    try {
      await createProperty({ name: name.trim(), address: address.trim(), area: area ? Number(area) : undefined });
      Alert.alert('Success', 'Property created successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('createProperty.headerTitle')}</Text>
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

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            activeOpacity={0.9}
            disabled={loading}
            onPress={handleSubmit}
          >
            {loading
              ? <ActivityIndicator color={Colors.onPrimary} />
              : <Text style={styles.submitButtonText}>{t('createProperty.submit')}</Text>
            }
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
    statusRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    statusOption: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: BorderRadius.xl,
      backgroundColor: C.surfaceContainerLow,
      alignItems: 'center',
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
