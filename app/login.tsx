import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeaturesStep } from "../components/login/FeaturesStep";
import { LoginFormStep } from "../components/login/LoginFormStep";
import { StepIndicator } from "../components/login/StepIndicator";
import { WelcomeStep } from "../components/login/WelcomeStep";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const TOTAL_STEPS = 3;

export default function LoginScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const isScrollingRef = useRef(false);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      scrollViewRef.current?.scrollTo({
        x: (newStep - 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      scrollViewRef.current?.scrollTo({
        x: (newStep - 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const skipToLogin = () => {
    const loginStep = TOTAL_STEPS;
    setCurrentStep(loginStep);
    scrollViewRef.current?.scrollTo({
      x: (loginStep - 1) * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleScrollBegin = () => {
    isScrollingRef.current = true;
  };

  const handleScrollEnd = (event: any) => {
    isScrollingRef.current = false;
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // Calculate the closest step
    const rawStep = scrollPosition / SCREEN_WIDTH;
    const step = Math.round(rawStep) + 1;
    
    // Only update if step is valid and different
    if (step !== currentStep && step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      // Ensure we snap to the correct position
      scrollViewRef.current?.scrollTo({
        x: (step - 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  return (
    <View className="flex-1 bg-[#12100E]">
      <StatusBar style="light" />
      
      {/* Background Design Elements */}
      <View className="absolute inset-0 overflow-hidden">
        <LinearGradient
          colors={["#1A0F0D", "#0F0907", "#0A0504"]}
          className="absolute inset-0"
        />
        {/* Abstract Glow Blobs */}
        <View 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary-600/10" 
          style={{ transform: [{ scale: 1.8 }] }} 
        />
        <View 
          className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-primary-800/5" 
          style={{ transform: [{ scale: 1.5 }] }} 
        />
        <View 
          className="absolute bottom-0 -right-20 w-80 h-80 rounded-full bg-primary-400/5" 
          style={{ transform: [{ scale: 1.2 }] }} 
        />
        {/* Subtle mesh/texture effect - can be simulated with another gradient or just blobs */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)"]}
          className="absolute inset-0"
        />
      </View>

      <SafeAreaView className="flex-1" edges={["left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          enabled={currentStep === 3}
        >
          {/* Step Indicator */}
          <View className="pt-4 pb-2">
            <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </View>

          {/* Swipeable Steps */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={handleScrollBegin}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            scrollEventThrottle={200}
            decelerationRate="normal"
            snapToInterval={SCREEN_WIDTH}
            snapToAlignment="center"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            scrollEnabled={true}
            disableIntervalMomentum={true}
          >
            {/* Step 1: Welcome */}
            <View style={{ width: SCREEN_WIDTH }}>
              <WelcomeStep onNext={nextStep} onSkip={skipToLogin} />
            </View>

            {/* Step 2: Features */}
            <View style={{ width: SCREEN_WIDTH }}>
              <FeaturesStep onNext={nextStep} />
            </View>

            {/* Step 3: Login Form */}
            <View style={{ width: SCREEN_WIDTH }}>
              <LoginFormStep onBack={prevStep} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
