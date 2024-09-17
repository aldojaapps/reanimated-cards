import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CreditCard from "./CreditCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView>
        <CreditCard color='#14213d' />
        <CreditCard color='#ff006e' />
        <CreditCard color='#219ebc' />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
