import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Define the custom theme
const theme = defineConfig({
    colors: {
      // Define your custom color palette
      brand: {
        50: "#e5f3fe",
        100: "#b3e0fb",
        200: "#80cfff",
        300: "#4dbffe",
        400: "#1ab0fc",
        500: "#0081e0", // Default primary color
        600: "#0068b3",
        700: "#004d80",
        800: "#00344d",
        900: "#001a1a",
      },
      // Default color palette (if you want to override)
      blue: {
        50: "#ebf8ff",
        100: "#bee3f8",
        200: "#90cdf4",
        300: "#63b3ed",
        400: "#4299e1",
        500: "#3182ce", // Default blue color
        600: "#2b6cb0",
        700: "#2c5282",
        800: "#2a4365",
        900: "#1A365D",
      },
    },
    // Other theme settings like typography, space, etc. can also be defined here.
    components: {
      Button: {
        baseStyle: {
          fontWeight: "bold", // Example: Change the default button font weight
          borderRadius: "md", // Example: Default button border radius
        },
        variants: {
          solid: {
            backgroundColor: "brand.500", // Use custom 'brand' color for button
            color: "white",
            _hover: {
              backgroundColor: "brand.400", // Hover state
            },
          },
        },
      },
    },
  });

const system = createSystem(defaultConfig, theme);

export default system;
