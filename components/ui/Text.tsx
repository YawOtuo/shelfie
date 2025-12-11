import { Text as RNText, TextProps as RNTextProps } from "react-native";

interface TextProps extends RNTextProps {
  className?: string;
  variant?: "regular" | "medium" | "semibold" | "bold";
}

/**
 * Removes all font-weight related classes from className
 * We handle font weights via fontFamily style prop, not className
 */
function removeFontWeightClasses(className?: string): string {
  if (!className) return "";
  
  const fontWeightClasses = [
    "font-bold",
    "font-semibold",
    "font-medium",
    "font-normal",
    "font-thin",
    "font-extralight",
    "font-light",
    "font-extrabold",
    "font-black",
  ];
  
  return className
    .split(" ")
    .filter((cls) => {
      // Remove exact matches
      if (fontWeightClasses.includes(cls)) {
        // Silently remove - warnings are too noisy
        return false;
      }
      // Remove any class starting with "font-"
      if (cls.startsWith("font-")) {
        // Silently remove - warnings are too noisy
        return false;
      }
      return true;
    })
    .join(" ");
}

/**
 * Automatically maps font-weight classes to the correct Poppins font family
 * This is used when variant is not provided
 */
function getFontFamilyFromClassName(className?: string): string {
  if (!className) return "Poppins_400Regular";
  
  // Check for font-weight classes and map to correct font family
  if (className.includes("font-bold")) {
    return "Poppins_700Bold";
  }
  if (className.includes("font-semibold")) {
    return "Poppins_600SemiBold";
  }
  if (className.includes("font-medium")) {
    return "Poppins_500Medium";
  }
  
  // Default to regular
  return "Poppins_400Regular";
}

export function Text({ className, variant, style, ...props }: TextProps) {
  // Always remove font-weight classes from className - we handle them via fontFamily
  const cleanedClassName = removeFontWeightClasses(className);
  
  // Determine fontFamily: variant takes precedence, otherwise auto-detect from original className
  let fontFamily: string;
  
  if (variant) {
    // Variant prop takes precedence
    fontFamily =
      variant === "regular"
        ? "Poppins_400Regular"
        : variant === "medium"
        ? "Poppins_500Medium"
        : variant === "semibold"
        ? "Poppins_600SemiBold"
        : "Poppins_700Bold";
  } else {
    // Auto-detect from original className (before cleaning)
    fontFamily = getFontFamilyFromClassName(className);
  }

  return (
    <RNText
      className={cleanedClassName}
      style={[
        {
          fontFamily,
        },
        style,
      ]}
      {...props}
    />
  );
}

