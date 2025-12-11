/**
 * Maps font weight classes to the correct Montserrat font family
 * Since we're using separate font files for each weight, we need to
 * explicitly set the fontFamily for each weight.
 */
export const getMontserratFontFamily = (weight: "regular" | "medium" | "semibold" | "bold" = "regular") => {
  const fontMap = {
    regular: "Montserrat_400Regular",
    medium: "Montserrat_500Medium",
    semibold: "Montserrat_600SemiBold",
    bold: "Montserrat_700Bold",
  };
  
  return fontMap[weight];
};

/**
 * Gets the font style object for a given weight
 */
export const getMontserratFontStyle = (weight: "regular" | "medium" | "semibold" | "bold" = "regular") => {
  return {
    fontFamily: getMontserratFontFamily(weight),
  };
};


