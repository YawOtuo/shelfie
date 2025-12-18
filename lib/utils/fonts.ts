/**
 * Maps font weight classes to the correct Poppins font family
 * Since we're using separate font files for each weight, we need to
 * explicitly set the fontFamily for each weight.
 */
export const getPoppinsFontFamily = (weight: "regular" | "medium" | "semibold" | "bold" = "regular") => {
  const fontMap = {
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semibold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
  };
  
  return fontMap[weight];
};

/**
 * Gets the font style object for a given weight
 */
export const getPoppinsFontStyle = (weight: "regular" | "medium" | "semibold" | "bold" = "regular") => {
  return {
    fontFamily: getPoppinsFontFamily(weight),
  };
};


