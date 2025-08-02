// 🚀 ULTRA-ADVANCED UI COMPONENTS
// Revolutionary components with stunning animations and interactions

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';
import { useThemeStore } from '../store';

// 🎨 Ultra Button Component with haptic feedback and animations
interface UltraButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  animationDuration?: number;
  style?: any;
}

export const UltraButton: React.FC<UltraButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  hapticFeedback = true,
  animationDuration = 200,
  style,
}) => {
  const theme = useTheme();
  const { hapticFeedback: globalHaptic } = useThemeStore();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (theme.animationsEnabled) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 0.95,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.8,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (hapticFeedback && globalHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (theme.animationsEnabled) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      if (hapticFeedback && globalHaptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...theme.shadows.sm,
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 48,
      },
      large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 56,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      gradient: {
        // Will use LinearGradient
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...(size === 'small' ? theme.typography.buttonSmall : theme.typography.button),
      textAlign: 'center' as const,
    };

    const variantStyles = {
      primary: { color: theme.colors.textInverse },
      secondary: { color: theme.colors.textInverse },
      outline: { color: theme.colors.primary },
      ghost: { color: theme.colors.primary },
      gradient: { color: theme.colors.textInverse },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const animatedStyle = {
    transform: [
      { scale: scaleValue },
      {
        rotate: rotateValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
    opacity: opacityValue,
  };

  const renderContent = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {icon && iconPosition === 'left' && (
        <View style={{ marginRight: theme.spacing.sm }}>{icon}</View>
      )}
      <Text style={getTextStyle()}>{title}</Text>
      {icon && iconPosition === 'right' && (
        <View style={{ marginLeft: theme.spacing.sm }}>{icon}</View>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={1}
        >
          <LinearGradient
            colors={theme.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={getButtonStyle()}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🎭 Ultra Card Component with glass morphism
interface UltraCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  blur?: boolean;
  gradient?: boolean;
  onPress?: () => void;
  style?: any;
}

export const UltraCard: React.FC<UltraCardProps> = ({
  children,
  variant = 'default',
  blur = false,
  gradient = false,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress && theme.animationsEnabled) {
      Animated.spring(scaleValue, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress && theme.animationsEnabled) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    };

    const variantStyles = {
      default: {
        ...theme.shadows.sm,
      },
      glass: {
        backgroundColor: theme.isDark 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(255, 255, 255, 0.9)',
        borderWidth: 1,
        borderColor: theme.isDark 
          ? 'rgba(255, 255, 255, 0.2)' 
          : 'rgba(0, 0, 0, 0.1)',
        ...theme.shadows.lg,
      },
      elevated: {
        ...theme.shadows.xl,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  const CardContent = () => (
    <Animated.View style={[getCardStyle(), animatedStyle, style]}>
      {children}
    </Animated.View>
  );

  if (blur && variant === 'glass') {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={1}
      >
        <BlurView intensity={80} tint={theme.isDark ? 'dark' : 'light'}>
          <CardContent />
        </BlurView>
      </TouchableOpacity>
    );
  }

  if (gradient) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={1}
      >
        <LinearGradient
          colors={[theme.colors.surface, theme.colors.surfaceSecondary]}
          style={[getCardStyle(), animatedStyle, style]}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

// 🌊 Ultra Floating Action Button with ripple effect
interface UltraFABProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'primary' | 'secondary' | 'accent';
  extended?: boolean;
  label?: string;
  style?: any;
}

export const UltraFAB: React.FC<UltraFABProps> = ({
  icon,
  onPress,
  size = 'medium',
  position = 'bottom-right',
  variant = 'primary',
  extended = false,
  label,
  style,
}) => {
  const theme = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rippleValue = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (theme.animationsEnabled) {
      // Scale animation
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Ripple animation
      Animated.sequence([
        Animated.timing(rippleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rippleValue, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onPress();
  };

  const getSizeStyle = () => {
    const sizes = {
      small: { width: 40, height: 40 },
      medium: { width: 56, height: 56 },
      large: { width: 72, height: 72 },
    };
    return sizes[size];
  };

  const getPositionStyle = () => {
    const positions = {
      'bottom-right': { bottom: theme.spacing.lg, right: theme.spacing.lg },
      'bottom-left': { bottom: theme.spacing.lg, left: theme.spacing.lg },
      'top-right': { top: theme.spacing.lg, right: theme.spacing.lg },
      'top-left': { top: theme.spacing.lg, left: theme.spacing.lg },
    };
    return positions[position];
  };

  const getVariantColor = () => {
    const variants = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
    };
    return variants[variant];
  };

  const fabStyle = {
    position: 'absolute' as const,
    ...getSizeStyle(),
    ...getPositionStyle(),
    borderRadius: extended ? theme.borderRadius.full : getSizeStyle().width / 2,
    backgroundColor: getVariantColor(),
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    paddingHorizontal: extended ? theme.spacing.lg : 0,
    ...theme.shadows.lg,
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  const rippleStyle = {
    position: 'absolute' as const,
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: (getSizeStyle().width + 20) / 2,
    backgroundColor: getVariantColor(),
    opacity: rippleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3],
    }),
    transform: [
      {
        scale: rippleValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[fabStyle, animatedStyle, style]}>
      <Animated.View style={rippleStyle} />
      <TouchableOpacity
        onPress={handlePress}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
        activeOpacity={0.8}
      >
        {icon}
        {extended && label && (
          <Text
            style={{
              color: theme.colors.textInverse,
              ...theme.typography.button,
              marginLeft: theme.spacing.sm,
            }}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🎪 Ultra Loading Component with multiple variants
interface UltraLoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'bounce';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export const UltraLoading: React.FC<UltraLoadingProps> = ({
  variant = 'spinner',
  size = 'medium',
  color,
  text,
}) => {
  const theme = useTheme();
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animationValue, {
        toValue: 1,
        duration: variant === 'pulse' ? 1000 : 2000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const getSize = () => {
    const sizes = {
      small: 20,
      medium: 40,
      large: 60,
    };
    return sizes[size];
  };

  const loadingColor = color || theme.colors.primary;
  const loadingSize = getSize();

  const renderSpinner = () => (
    <Animated.View
      style={{
        width: loadingSize,
        height: loadingSize,
        borderWidth: 3,
        borderColor: `${loadingColor}30`,
        borderTopColor: loadingColor,
        borderRadius: loadingSize / 2,
        transform: [
          {
            rotate: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      }}
    />
  );

  const renderDots = () => (
    <View style={{ flexDirection: 'row' }}>
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={{
            width: loadingSize / 3,
            height: loadingSize / 3,
            backgroundColor: loadingColor,
            borderRadius: loadingSize / 6,
            marginHorizontal: 2,
            opacity: animationValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 1, 0.3],
            }),
            transform: [
              {
                translateY: animationValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, -10, 0],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );

  const renderPulse = () => (
    <Animated.View
      style={{
        width: loadingSize,
        height: loadingSize,
        backgroundColor: loadingColor,
        borderRadius: loadingSize / 2,
        opacity: animationValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 1, 0.3],
        }),
        transform: [
          {
            scale: animationValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.8, 1.2, 0.8],
            }),
          },
        ],
      }}
    />
  );

  const renderLoading = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {renderLoading()}
      {text && (
        <Text
          style={{
            ...theme.typography.body2,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.md,
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
      )}
    </View>
  );
};
