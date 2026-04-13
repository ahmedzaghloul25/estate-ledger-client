import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { Typography, Spacing, BorderRadius, FontFamily, useColors } from '../../theme';
import { useAppContext } from '../../context/AppContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavProp>();
  const Colors = useColors();
  const { t } = useAppContext();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Login Failed', e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/favicon.png')} style={styles.logoIcon} />
            </View>
            <Text style={styles.brandName}>{t('login.brand')}</Text>
          </View>


          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('login.welcomeBack')}</Text>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('login.emailLabel')}</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t('login.emailPlaceholder')}
                placeholderTextColor={Colors.outlineVariant}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>{t('login.passwordLabel')}</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotLink}>{t('login.forgotPassword')}</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                placeholderTextColor={Colors.outlineVariant}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, loading && { opacity: 0.7 }]}
              onPress={handleSignIn}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={Colors.onPrimary} />
                : <Text style={styles.signInButtonText}>{t('login.signIn')}</Text>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: C.background,
    },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.xxl,
    },
    brandSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.xxl,
    },
    logoContainer: {
      width: 50,
      height: 50,
      borderRadius: BorderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor : 'red',
      overflow: 'hidden'
    },
    logoIcon: {
      width: 60,
      height: 60,
    },
    brandName: {
      ...Typography.titleLg,
      fontFamily: FontFamily.manropeBold,
      color: C.primary,
    },
    heroSection: {
      marginBottom: Spacing.xl,
    },
    heroTitle: {
      ...Typography.displayMd,
      fontFamily: FontFamily.manropeExtraBold,
      color: C.primary,
      letterSpacing: -1,
      marginBottom: Spacing.md,
    },
    heroSubtitle: {
      ...Typography.bodyLg,
      color: C.onSurfaceVariant,
      maxWidth: 280,
      lineHeight: 24,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xxl,
      gap: Spacing.xl,
    },
    statItem: {
      gap: 4,
    },
    statValue: {
      ...Typography.headlineMd,
      fontFamily: FontFamily.manropeBold,
      color: C.primary,
    },
    statLabel: {
      ...Typography.labelSm,
      color: C.onSurfaceVariant,
      letterSpacing: 1.5,
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: C.outlineVariant,
      opacity: 0.4,
    },
    card: {
      backgroundColor: C.surfaceContainerLowest,
      borderRadius: BorderRadius.xxxl,
      padding: Spacing.xl,
      shadowColor: C.onSurface,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 32,
      elevation: 4,
    },
    cardTitle: {
      ...Typography.headlineSm,
      fontFamily: FontFamily.manropeBold,
      color: C.onSurface,
      marginBottom: Spacing.xs,
    },
    cardSubtitle: {
      ...Typography.bodyMd,
      color: C.onSurfaceVariant,
      marginBottom: Spacing.xl,
    },
    fieldGroup: {
      marginBottom: Spacing.md,
    },
    fieldLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    fieldLabel: {
      ...Typography.labelMd,
      fontFamily: FontFamily.interSemiBold,
      color: C.onSurfaceVariant,
      marginBottom: Spacing.xs,
      paddingHorizontal: 4,
    },
    forgotLink: {
      ...Typography.labelSm,
      fontFamily: FontFamily.interSemiBold,
      color: C.primary,
      marginBottom: Spacing.xs,
    },
    input: {
      backgroundColor: C.surfaceContainerLow,
      borderRadius: BorderRadius.xl,
      paddingHorizontal: Spacing.md,
      paddingVertical: 16,
      ...Typography.bodyMd,
      color: C.onSurface,
      borderWidth: 0,
    },
    signInButton: {
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
    signInButtonText: {
      ...Typography.titleMd,
      fontFamily: FontFamily.manropeBold,
      color: C.onPrimary,
      fontSize: 16,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginVertical: Spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: C.outlineVariant,
      opacity: 0.3,
    },
    dividerText: {
      ...Typography.labelSm,
      color: C.onSurfaceVariant,
      letterSpacing: 2,
    },
    biometricRow: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    biometricButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: `${C.outlineVariant}33`,
    },
    biometricIcon: {
      fontSize: 28,
    },
    biometricLabel: {
      ...Typography.labelSm,
      color: C.onSurfaceVariant,
      letterSpacing: 1.5,
    },
    footerText: {
      ...Typography.bodySm,
      color: C.onSurfaceVariant,
      textAlign: 'center',
    },
    footerLink: {
      fontFamily: FontFamily.interSemiBold,
      color: C.primary,
      textDecorationLine: 'underline',
    },
  });
}
