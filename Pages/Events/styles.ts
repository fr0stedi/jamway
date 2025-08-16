import { StyleSheet } from 'react-native';

export const getStyles = (theme: any) =>
  StyleSheet.create({
    titleBox: {
      backgroundColor: 'transparent',
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      alignItems: 'center',
      marginTop: 40,
    },
    titleText: {
      fontSize: 20,
      color: theme.colors.text,
      fontFamily: 'Spacemono',
      fontWeight: '700',
    },
    calendarWrap: {
      backgroundColor: theme.colors.bubble || theme.colors.card,
      borderRadius: 18,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 18,
      marginHorizontal: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: theme.colors.bubbleborder || theme.colors.border,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    bodyText: {
      color: theme.colors.text,
      fontSize: 22,
      fontFamily: 'Inter',
      fontWeight: '600',
    },
  });
