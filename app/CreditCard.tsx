import React, { useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const h = 350;

const CreditCard = ({ color }: { color: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMovedUp, setIsMovedUp] = useState(false);
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Tap Gesture
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (!isMovedUp) {
        translateY.value = withTiming(-h, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        });
        runOnJS(setIsMovedUp)(true);
      } else {
        // Flip the card
        const config = {
          mass: 1,
          damping: 20,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        };
        rotation.value = withSpring(isFlipped ? 0 : 180, config);
        runOnJS(setIsFlipped)(!isFlipped);
      }
    })
    .simultaneousWithExternalGesture();

  // Pan Gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      translateY.value = translateY.value;
    })
    .onUpdate((event) => {
      const newTranslateY = translateY.value + event.translationY;
      if (newTranslateY <= 0) {
        translateY.value = newTranslateY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 50) {
        translateY.value = withSpring(0, {
          mass: 1,
          stiffness: 100,
          damping: 10,
        });
        rotation.value = withTiming(0, { duration: 500 });
        runOnJS(setIsMovedUp)(false);
        runOnJS(setIsFlipped)(false);
      } else {
        translateY.value = withTiming(-h, { duration: 500 });
      }
    })
    .simultaneousWithExternalGesture();

  // Combined Gesture
  const combinedGesture = Gesture.Simultaneous(tapGesture, panGesture);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = `${interpolate(rotation.value, [0, 180], [0, 180])}deg`;
    return {
      transform: [
        { perspective: 1000 },
        { rotateY },
        { translateY: translateY.value },
      ],
      backfaceVisibility: "hidden",
      position: "absolute",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = `${interpolate(rotation.value, [0, 180], [180, 360])}deg`;
    return {
      transform: [
        { perspective: 1000 },
        { rotateY },
        { translateY: translateY.value },
      ],
      backfaceVisibility: "hidden",
      position: "absolute",
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              frontAnimatedStyle,
              { backgroundColor: color },
            ]}
          >
            {/* Front Side Content */}
            <View style={styles.cardHeader}>
              <Text style={styles.bankName}>My Bank</Text>
              <View style={styles.chip} />
            </View>
            <Text style={styles.cardNumber}>1234 5678 9012 3456</Text>
            <View style={styles.cardDetails}>
              <View>
                <Text style={styles.label}>Card Holder</Text>
                <Text style={styles.info}>Michael Jackson</Text>
              </View>
              <View>
                <Text style={styles.label}>Expires</Text>
                <Text style={styles.info}>12/28</Text>
              </View>
            </View>
          </Animated.View>
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              backAnimatedStyle,
              { backgroundColor: color },
            ]}
          >
            {/* Back Side Content */}
            <View style={styles.blackStrip} />
            <View style={styles.signatureStrip}>
              <Text style={styles.cvv}>123</Text>
            </View>
            <Text style={styles.bankInfo}>Address</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const CARD_WIDTH = 300;
const CARD_HEIGHT = 180;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: -120,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 30,
    padding: 20,
    backfaceVisibility: "hidden",
    position: "absolute",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: -40,
  },
  cardFront: {
    backgroundColor: "#ee6055",
    justifyContent: "space-between",
  },
  cardBack: {
    backgroundColor: "#ee6055",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: "#D4AF37",
    borderRadius: 5,
  },
  cardNumber: {
    fontSize: 18,
    color: "#fff",
    letterSpacing: 2,
    marginVertical: 10,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 10,
    color: "#ccc",
  },
  info: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
  blackStrip: {
    height: 40,
    backgroundColor: "#000",
    marginTop: 15,
  },
  signatureStrip: {
    height: 30,
    backgroundColor: "#fff",
    marginTop: 15,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  cvv: {
    textAlign: "right",
    fontSize: 16,
    color: "#000",
  },
  bankInfo: {
    fontSize: 12,
    color: "#fff",
    marginTop: 2,
  },
});

export default CreditCard;
